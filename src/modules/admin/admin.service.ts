import { BookingStatus, Status } from "../../../generated/prisma/enums";
import { USER_ROLES } from "../../constants/userRoles";
import { AppError } from "../../errors/AppError";
import paginationSorting from "../../helpers/paginationSorting.helper";
import { prisma } from "../../lib/prisma";
import { GetAllUsersQuery } from "./admin.types";


const getAllUsers = async (
    adminId: string,
    query: GetAllUsersQuery
) => {
    const allowedRoles = Object.values(USER_ROLES);
    const allowedStatuses = [Status.ACTIVE, Status.BLOCKED];

    if (query.role && !allowedRoles.includes(query.role)) {
        throw new AppError(
            400,
            `Invalid role! Allowed: ${allowedRoles.join(", ")}`
        );
    }
    if (query.status && !allowedStatuses.includes(query.status)) {
        throw new AppError(
            400,
            `Invalid status! Allowed: ${allowedStatuses.join(", ")}`
        );
    }

    // 1. Validate admin
    const admin = await prisma.user.findUnique({
        where: { id: adminId },
        select: { role: true },
    });

    if (!admin) {
        throw new AppError(401, "Admin user not found");
    }
    if (admin.role !== USER_ROLES.ADMIN) {
        throw new AppError(403, "Unauthorized access");
    }

    // 2. Pagination + sorting
    const { page, limit, skip, sortBy, sortOrder } =
        paginationSorting(query);

    const searchTerm = query.searchTerm?.trim();

    // 3. Safe sorting
    const allowedSortFields = ["createdAt", "name", "email"];
    const safeSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : "createdAt";

    // 4. Build reusable WHERE condition
    const whereCondition: any = {
        ...(query.role && {
            role: query.role,
        }),

        ...(query.status && {
            status: query.status,
        }),

        ...(searchTerm && {
            OR: [
                {
                    name: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    email: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        }),
    };

    // 5. Run queries in parallel
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where: whereCondition,
            skip,
            take: limit,
            orderBy: {
                [safeSortBy]: sortOrder,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                image: true,
                createdAt: true,
                updatedAt: true,
            },
        }),

        prisma.user.count({
            where: whereCondition,
        }),
    ]);

    // 6. Return structured response
    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        data: users,
    };
};

const getPlatformAnalytics = async () => {
    const now = new Date();

    // Time ranges
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const startOf7Days = new Date(now);
    startOf7Days.setDate(now.getDate() - 7);

    const startOf30Days = new Date(now);
    startOf30Days.setDate(now.getDate() - 30);

    // PARALLEL CORE METRICS
    const [
        totalUsers,
        activeTutors,
        activeStudents,

        bookingsToday,
        totalBookings,
        completedBookings,
        cancelledBookings,

        // revenueToday,
        // revenueLast7Days,

        last7DaysBookings,
        last30DaysUsers,
        bookingStatusStats,
    ] = await Promise.all([
        prisma.user.count(),

        prisma.user.count({
            where: { role: USER_ROLES.TUTOR, status: Status.ACTIVE },
        }),

        prisma.user.count({
            where: { role: USER_ROLES.STUDENT, status: Status.ACTIVE },
        }),

        prisma.booking.count({
            where: {
                createdAt: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
            },
        }),

        prisma.booking.count(),

        prisma.booking.count({
            where: { status: BookingStatus.COMPLETED },
        }),

        prisma.booking.count({
            where: { status: BookingStatus.CANCELLED },
        }),

        // prisma.booking.aggregate({
        //     where: {
        //         status: BookingStatus.COMPLETED,
        //         createdAt: {
        //             gte: startOfToday,
        //             lte: endOfToday,
        //         },
        //     },
        //     _sum: { price: true },
        // }),

        // prisma.booking.aggregate({
        //     where: {
        //         status: BookingStatus.COMPLETED,
        //         createdAt: {
        //             gte: startOf7Days,
        //         },
        //     },
        //     _sum: { price: true },
        // }),

        prisma.$queryRaw<{ date: string; total: number }[]>`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*)::int as total
      FROM "Booking"
      WHERE "createdAt" >= NOW() - INTERVAL '7 days'
      GROUP BY DATE("createdAt")
      ORDER BY date ASC;
    `,

        prisma.user.count({
            where: {
                createdAt: { gte: startOf30Days },
            },
        }),

        prisma.booking.groupBy({
            by: ["status"],
            _count: { status: true },
        }),
    ]);

    // SAFE REVENUE HANDLING
    // const revenue = {
    //     today: revenueToday._sum.price ?? 0,
    //     last7Days: revenueLast7Days._sum.price ?? 0,
    // };

    // KPI METRICS
    const cancellationRate =
        totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0;

    const completionRate =
        totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

    const averageBookingsPerDay =
        last7DaysBookings.length > 0
            ? last7DaysBookings.reduce((sum, d) => sum + d.total, 0) / 7
            : 0;

    // FINAL RESPONSE
    return {
        users: {
            total: totalUsers,
            activeTutors,
            activeStudents,
            last30Days: last30DaysUsers,
        },

        bookings: {
            total: totalBookings,
            today: bookingsToday,
            completed: completedBookings,
            cancelled: cancelledBookings,
            statusBreakdown: bookingStatusStats,
            last7Days: last7DaysBookings,
            avgPerDay: averageBookingsPerDay,
        },

        revenue: {
            // today: revenue.today,
            // last7Days: revenue.last7Days,
            today: 0,
            last7Days: 0,
        },

        kpis: {
            cancellationRate: Number(cancellationRate.toFixed(2)),
            completionRate: Number(completionRate.toFixed(2)),
        },
    };
};

const updateUserStatus = async (
    adminId: string,
    targetUserId: string,
    status: Status
) => {

    // 1. Validate allowed statuses
    const allowedStatuses = [Status.ACTIVE, Status.BLOCKED];

    if (!allowedStatuses.includes(status)) {
        throw new AppError(400, `Invalid status! Allowed: ${Status.ACTIVE} or ${Status.BLOCKED}`);
    }

    // 2. Check admin user
    const admin = await prisma.user.findUnique({
        where: { id: adminId },
        select: { role: true },
    });

    if (!admin) {
        throw new AppError(401, "Admin user not found!");
    }
    if (admin.role !== USER_ROLES.ADMIN) {
        throw new AppError(403, "Unauthorized access");
    }

    // 3. Check target user
    const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { id: true, status: true, role: true },
    });

    if (!targetUser) {
        throw new AppError(404, "Target user not found");
    }

    // 4. Prevent self-status change
    if (adminId === targetUserId) {
        throw new AppError(400, "You cannot change your own status")
    }

    // 5. Prevent redundant update
    if (targetUser.status === status) {
        throw new AppError(409, `User is already ${status}`);
    }

    // 6. Prevent disabling another admin
    if (
        targetUser.role === USER_ROLES.ADMIN &&
        status === Status.BLOCKED
    ) {
        throw new AppError(403, "Cannot deactivate another admin");
    }

    // 7. Update status
    return prisma.user.update({
        where: { id: targetUserId },
        data: { status },
    });
};


export const AdminService = {
    getAllUsers,
    getPlatformAnalytics,
    updateUserStatus,
};