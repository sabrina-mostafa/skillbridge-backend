import { BookingStatus, Status } from "../../../generated/prisma/enums";
import { REPORT_TYPES, ReportFormat, ReportType } from "../../constants/reportTypes";
import { USER_ROLES, UserRoles } from "../../constants/userRoles";
import { AppError } from "../../errors/AppError";
import paginationSorting from "../../helpers/paginationSorting.helper";
import { prisma } from "../../lib/prisma";
import { GetAllMessagesQuery, GetAllUsersQuery, GetReportQuery } from "./admin.types";


type CreateContactMessagePayload = {
    fullName: string;
    email: string;
    phone?: string;
    userType: string;
    inquiryType: string[];
    message: string;
};

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

    // // 3. Safe sorting
    // const allowedSortFields = ["createdAt", "name", "email"];
    // const safeSortBy = allowedSortFields.includes(sortBy)
    //     ? sortBy
    //     : "createdAt";

    const isFeatured =
        query.isFeatured === undefined
            ? undefined
            : query.isFeatured === "true";

    // 3. Build reusable WHERE condition
    const whereCondition: any = {
        ...(query.role && {
            role: query.role,
        }),

        ...(query.status && {
            status: query.status,
        }),

        ...(isFeatured !== undefined && {
            tutorProfile: {
                is: {
                    isFeatured,
                },
            },
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

    // 4. ORDER BY
    let orderBy: any = {
        createdAt: sortOrder,
    };

    switch (sortBy) {
        case "name":
            orderBy = {
                name: sortOrder,
            };
            break;

        case "email":
            orderBy = {
                email: sortOrder,
            };
            break;

        case "avgRating":
            orderBy = {
                tutorProfile: {
                    avgRating: sortOrder,
                },
            };
            break;

        case "hourlyRate":
            orderBy = {
                tutorProfile: {
                    hourlyRate: sortOrder,
                },
            };
            break;

        case "createdAt":
        default:
            orderBy = {
                createdAt: sortOrder,
            };
    }

    // 5. Run queries in parallel
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where: whereCondition,
            skip,
            take: limit,
            orderBy,
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                role: true,
                status: true,
                profileCompleted: true,
                image: true,
                createdAt: true,
                updatedAt: true,
                tutorProfile: {
                    include: {
                        categories: {
                            select: {
                                category: true,
                            }
                        }
                    }
                },
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
        completedTutorProfiles,
        completedStudentProfiles,

        featuredTutors,

        totalCategories,
        parentCategories,
        childCategories,
        assignedTutors,

        reviewStats,

        totalMessages,

        bookingsToday,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,

        // revenueToday,
        // revenueLast7Days,

        last30DaysUsers,
        last30DaysTutors,
        last30DaysStudents,

        last7DaysBookings,
        bookingStatusStats,
    ] = await Promise.all([
        prisma.user.count(),

        prisma.user.count({
            where: { role: USER_ROLES.TUTOR, status: Status.ACTIVE },
        }),

        prisma.user.count({
            where: { role: USER_ROLES.STUDENT, status: Status.ACTIVE },
        }),

        prisma.user.count({
            where: {
                role: USER_ROLES.TUTOR,
                status: Status.ACTIVE,
                profileCompleted: true,
            },
        }),

        prisma.user.count({
            where: {
                role: USER_ROLES.STUDENT,
                status: Status.ACTIVE,
                profileCompleted: true,
            },
        }),

        prisma.tutorProfile.count({
            where: {
                isFeatured: true,
            },
        }),

        prisma.categories.count(),

        prisma.categories.count({
            where: {
                parentId: null,
            },
        }),

        prisma.categories.count({
            where: {
                parentId: {
                    not: null,
                },
            },
        }),

        prisma.tutorCategory.count(),

        prisma.review.aggregate({
            _count: {
                id: true,
            },
            _avg: {
                rating: true,
            },
        }),

        // Contact messages
        prisma.contactMessage.count(),

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
            where: {
                status: BookingStatus.PENDING,
            },
        }),

        prisma.booking.count({
            where: {
                status: BookingStatus.CONFIRMED,
            },
        }),

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

        prisma.user.count({
            where: {
                createdAt: { gte: startOf30Days },
            },
        }),

        prisma.user.count({
            where: {
                role: USER_ROLES.TUTOR,
                createdAt: {
                    gte: startOf30Days,
                },
            },
        }),

        prisma.user.count({
            where: {
                role: USER_ROLES.STUDENT,
                createdAt: {
                    gte: startOf30Days,
                },
            },
        }),

        prisma.$queryRaw<{ date: string; total: number }[]>`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*)::int as total
      FROM "Booking"
      WHERE "createdAt" >= NOW() - INTERVAL '7 days'
      GROUP BY DATE("createdAt")
      ORDER BY date ASC;
    `,

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

    // KPI CALCULATIONS
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
        overview: {
            totalUsers,
            activeTutors,
            activeStudents,

            completedTutorProfiles,
            completedStudentProfiles,

            featuredTutors,

            totalCategories,

            totalBookings,

            totalReviews: reviewStats._count.id,

            totalMessages,
        },

        users: {
            total: totalUsers,
            activeTutors,
            activeStudents,
            completedTutorProfiles,
            completedStudentProfiles,
            last30DaysUsers: last30DaysUsers,
            last30DaysTutors,
            last30DaysStudents,
        },

        categories: {
            total: totalCategories,
            parentCategories,
            childCategories,
            assignedTutors,
        },

        bookings: {
            total: totalBookings,
            today: bookingsToday,
            pending: pendingBookings,
            confirmed: confirmedBookings,
            completed: completedBookings,
            cancelled: cancelledBookings,
            statusBreakdown: bookingStatusStats,
            last7Days: last7DaysBookings,
            avgPerDay: Number(averageBookingsPerDay.toFixed(2)),
        },

        reviews: {
            total: reviewStats._count.id,
            averageRating: Number(
                (reviewStats._avg.rating ?? 0).toFixed(2)
            ),
        },

        contacts: {
            total: totalMessages,
        },

        revenue: {
            // today: revenue.today,
            // last7Days: revenue.last7Days,
            today: 0,
            last7Days: 0,
        },

        kpis: {
            completionRate: Number(completionRate.toFixed(2)),
            cancellationRate: Number(cancellationRate.toFixed(2)),
        },

        charts: {
            bookingsLast7Days: last7DaysBookings,
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

const updateTutorFeatured = async (
    adminId: string,
    tutorId: string,
    isFeatured: boolean
) => {
    const admin = await prisma.user.findUnique({
        where: {
            id: adminId,
        },
        select: {
            role: true,
        },
    });

    if (!admin) {
        throw new AppError(401, "Admin user not found");
    }

    if (admin.role !== USER_ROLES.ADMIN) {
        throw new AppError(403, "Unauthorized access");
    }

    const tutor = await prisma.tutorProfile.findUnique({
        where: {
            id: tutorId,
        },
        select: {
            id: true,
            isFeatured: true,
        },
    });

    if (!tutor) {
        throw new AppError(404, "Tutor profile not found");
    }

    if (tutor.isFeatured === isFeatured) {
        throw new AppError(
            409,
            `Tutor is already ${isFeatured ? "featured" : "not featured"
            }`
        );
    }

    return prisma.tutorProfile.update({
        where: {
            id: tutorId,
        },
        data: {
            isFeatured,
        },
    });
};

const createContactMessage = async (
    payload: CreateContactMessagePayload
) => {
    if (
        !payload.fullName ||
        !payload.email ||
        !payload.message
    ) {
        throw new AppError(
            400,
            "Required fields are missing"
        );
    }

    if (
        !payload.inquiryType ||
        payload.inquiryType.length === 0
    ) {
        throw new AppError(
            400,
            "Select at least one inquiry type"
        );
    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(payload.email)) {
        throw new AppError(
            400,
            "Invalid email format"
        );
    }

    try {
        return await prisma.contactMessage.create({
            data: {
                fullName: payload.fullName,
                email: payload.email,
                phone: payload.phone ?? null,
                userType: payload.userType,
                inquiryType: payload.inquiryType,
                message: payload.message,
            },
        });
    } catch {
        throw new AppError(
            500,
            "Failed to create contact message"
        );
    }
};

const getAllMessages = async (
    adminId: string,
    query: GetAllMessagesQuery
) => {
    // 1. Validate admin
    const admin = await prisma.user.findUnique({
        where: {
            id: adminId,
        },
        select: {
            role: true,
        },
    });

    if (!admin) {
        throw new AppError(401, "Admin user not found");
    }

    if (admin.role !== USER_ROLES.ADMIN) {
        throw new AppError(403, "Unauthorized access");
    }

    // 2. Pagination + sorting
    const {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    } = paginationSorting(query);

    const searchTerm = query.searchTerm?.trim();

    // 3. Build reusable WHERE condition
    const whereCondition: any = {
        ...(query.userType && {
            userType: query.userType,
        }),

        ...(query.inquiryType && {
            inquiryType: {
                has: query.inquiryType,
            },
        }),

        ...(searchTerm && {
            OR: [
                {
                    fullName: {
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
                {
                    phone: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    message: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    inquiryType: {
                        has: searchTerm,
                    },
                },
            ],
        }),
    };

    // 4. ORDER BY
    let orderBy: any = {
        createdAt: sortOrder,
    };

    switch (sortBy) {
        case "fullName":
            orderBy = {
                fullName: sortOrder,
            };
            break;

        case "email":
            orderBy = {
                email: sortOrder,
            };
            break;

        case "userType":
            orderBy = {
                userType: sortOrder,
            };
            break;

        case "createdAt":
        default:
            orderBy = {
                createdAt: sortOrder,
            };
    }

    // 5. Run queries in parallel
    const [messages, total] = await Promise.all([
        prisma.contactMessage.findMany({
            where: whereCondition,
            skip,
            take: limit,
            orderBy,
        }),

        prisma.contactMessage.count({
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
        data: messages,
    };
};

const deleteMessage = async (
    adminId: string,
    messageId: string
) => {

    // Validate admin
    const admin = await prisma.user.findUnique({
        where: {
            id: adminId,
        },
        select: {
            role: true,
        },
    });

    if (!admin) {
        throw new AppError(
            401,
            "Admin user not found"
        );
    }

    if (admin.role !== USER_ROLES.ADMIN) {
        throw new AppError(
            403,
            "Unauthorized access"
        );
    }

    // Check message exists
    const message = await prisma.contactMessage.findUnique({
        where: {
            id: messageId,
        },
    });

    if (!message) {
        throw new AppError(
            404,
            "Message not found"
        );
    }

    try {
        return await prisma.contactMessage.delete({
            where: {
                id: messageId,
            },
        });
    } catch {
        throw new AppError(
            500,
            "Failed to delete message"
        );
    }
};

const getReports = async (
    adminId: string,
    query: GetReportQuery
) => {
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

    const type = query.type ?? "overview";

    const from = query.from ? new Date(query.from) : undefined;
    const to = query.to ? new Date(query.to) : undefined;

    const whereCreatedAt = from || to
        ? {
            createdAt: {
                ...(from && { gte: from }),
                ...(to && { lte: to }),
            },
        }
        : {};


    switch (type) {
        case "overview": {
            const [
                users,
                tutors,
                students,
                bookings,
                completedBookings,
                reviews,
                contacts,
            ] = await Promise.all([
                prisma.user.count({
                    where: {
                        ...whereCreatedAt,
                    },
                }),

                prisma.user.count({
                    where: {
                        role: USER_ROLES.TUTOR,
                        ...whereCreatedAt,
                    },
                }),

                prisma.user.count({
                    where: {
                        role: USER_ROLES.STUDENT,
                        ...whereCreatedAt,
                    },
                }),

                prisma.booking.count({
                    where: {
                        ...whereCreatedAt,
                    },
                }),

                prisma.booking.count({
                    where: {
                        status: BookingStatus.COMPLETED,
                        ...whereCreatedAt,
                    },
                }),

                prisma.review.aggregate({
                    where: { ...whereCreatedAt },
                    _count: { id: true },
                    _avg: { rating: true },
                }),

                prisma.contactMessage.count({
                    where: {
                        ...whereCreatedAt,
                    },
                }),
            ]);

            return {
                type,
                generatedAt: new Date(),
                data: {
                    totalUsers: users,
                    totalTutors: tutors,
                    totalStudents: students,
                    totalBookings: bookings,
                    completedBookings,
                    totalReviews: reviews._count.id,
                    averageRating: Number(
                        (reviews._avg.rating ?? 0).toFixed(2)
                    ),
                    totalContacts: contacts,
                },
            };
        }

        case "users": {
            const data = await prisma.user.findMany({
                where: {
                    ...whereCreatedAt,
                },
                include: {
                    tutorProfile: {
                        include: {
                            categories: {
                                include: {
                                    category: true,
                                },
                            },
                        },
                    },

                    studentProfile: true,
                },

                orderBy: {
                    createdAt: "desc",
                },
            });
            return {
                type,
                generatedAt: new Date(),
                data,
            };
        }

        case "bookings": {
            const data = await prisma.booking.findMany({
                where: {
                    ...whereCreatedAt,
                },

                include: {
                    tutor: {
                        include: {
                            user: true,
                        },
                    },

                    student: {
                        include: {
                            user: true,
                        },
                    },

                    category: true,

                    review: true,
                },

                orderBy: {
                    createdAt: "desc",
                },
            });
            return {
                type,
                generatedAt: new Date(),
                data,
            };
        }

        case "reviews": {
            const data = await prisma.review.findMany({
                where: {
                    ...whereCreatedAt,
                },

                include: {
                    tutor: {
                        include: {
                            user: true,
                        },
                    },

                    student: {
                        include: {
                            user: true,
                        },
                    },

                    booking: {
                        include: {
                            category: true,
                        },
                    },
                },

                orderBy: {
                    createdAt: "desc",
                },
            });
            return {
                type,
                generatedAt: new Date(),
                data,
            };
        }

        case "categories": {
            const data = await prisma.categories.findMany({
                include: {
                    _count: {
                        select: {
                            tutors: true,
                        },
                    },

                    parent: true,
                },

                orderBy: {
                    name: "asc",
                },
            });
            return {
                type,
                generatedAt: new Date(),
                data,
            };
        }

        case "contacts": {
            const data = await prisma.contactMessage.findMany({
                where: {
                    ...whereCreatedAt,
                },

                orderBy: {
                    createdAt: "desc",
                },
            });
            return {
                type,
                generatedAt: new Date(),
                data,
            };
        }
        default:
            throw new AppError(400, "Invalid report type");
    }
};

const generateReport = async (
    adminId: string,
    type: ReportType,
    query: {
        from?: string;
        to?: string;
    },
) => {
    // Validate admin
    const admin = await prisma.user.findUnique({
        where: {
            id: adminId,
        },
        select: {
            role: true,
        },
    });

    if (!admin) {
        throw new AppError(401, "Admin user not found");
    }

    if (admin.role !== USER_ROLES.ADMIN) {
        throw new AppError(403, "Unauthorized access");
    }

    if (!REPORT_TYPES.includes(type)) {
        throw new AppError(400, "Invalid report type");
    }

    const from = query.from
        ? new Date(query.from)
        : undefined;

    const to = query.to
        ? new Date(query.to)
        : undefined;

    const whereCreatedAt =
        from || to
            ? {
                createdAt: {
                    ...(from && { gte: from }),
                    ...(to && { lte: to }),
                },
            }
            : {};

    let data: unknown;

    switch (type) {
        case "overview": {
            const [
                totalUsers,
                totalTutors,
                totalStudents,
                totalBookings,
                completedBookings,
                reviewStats,
                totalContacts,
            ] = await Promise.all([
                prisma.user.count({
                    where: whereCreatedAt,
                }),

                prisma.user.count({
                    where: {
                        role: USER_ROLES.TUTOR,
                        ...whereCreatedAt,
                    },
                }),

                prisma.user.count({
                    where: {
                        role: USER_ROLES.STUDENT,
                        ...whereCreatedAt,
                    },
                }),

                prisma.booking.count({
                    where: whereCreatedAt,
                }),

                prisma.booking.count({
                    where: {
                        status: BookingStatus.COMPLETED,
                        ...whereCreatedAt,
                    },
                }),

                prisma.review.aggregate({
                    where: whereCreatedAt,
                    _count: {
                        id: true,
                    },
                    _avg: {
                        rating: true,
                    },
                }),

                prisma.contactMessage.count({
                    where: whereCreatedAt,
                }),
            ]);

            data = {
                totalUsers,
                totalTutors,
                totalStudents,
                totalBookings,
                completedBookings,
                totalReviews: reviewStats._count.id,
                averageRating: Number(
                    (reviewStats._avg.rating ?? 0).toFixed(2)
                ),
                totalContacts,
            };

            break;
        }

        case "users":
            data = await prisma.user.findMany({
                where: whereCreatedAt,
                include: {
                    tutorProfile: {
                        include: {
                            categories: {
                                include: {
                                    category: true,
                                },
                            },
                        },
                    },
                    studentProfile: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
            break;

        case "bookings":
            data = await prisma.booking.findMany({
                where: whereCreatedAt,
                include: {
                    tutor: {
                        include: {
                            user: true,
                        },
                    },
                    student: {
                        include: {
                            user: true,
                        },
                    },
                    category: true,
                    review: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
            break;

        case "reviews":
            data = await prisma.review.findMany({
                where: whereCreatedAt,
                include: {
                    tutor: {
                        include: {
                            user: true,
                        },
                    },
                    student: {
                        include: {
                            user: true,
                        },
                    },
                    booking: {
                        include: {
                            category: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
            break;

        case "categories":
            data = await prisma.categories.findMany({
                include: {
                    parent: true,
                    _count: {
                        select: {
                            tutors: true,
                        },
                    },
                },
                orderBy: {
                    name: "asc",
                },
            });
            break;

        case "contacts":
            data = await prisma.contactMessage.findMany({
                where: whereCreatedAt,
                orderBy: {
                    createdAt: "desc",
                },
            });
            break;
    }

    return {
        type,
        from: query.from ?? null,
        to: query.to ?? null,
        generatedAt: new Date(),
        data,
    };
};


export const AdminService = {
    getAllUsers,
    getPlatformAnalytics,
    updateUserStatus,
    updateTutorFeatured,
    createContactMessage,
    getAllMessages,
    deleteMessage,
    getReports,
    generateReport,
};