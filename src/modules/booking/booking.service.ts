import { BookingStatus } from "../../../generated/prisma/enums";
import { USER_ROLES, UserRoles } from "../../constants/userRoles";
import { AppError } from "../../errors/AppError";
import paginationSorting from "../../helpers/paginationSorting.helper";
import { prisma } from "../../lib/prisma";
import { createMeetLink } from "../google/google.calendar.service";
import { GetAllBookingsQuery, GetMyBookingsQuery } from "./booking.types";


const toValidDate = (value: any) => {
    const date = new Date(value);
    return !isNaN(date.getTime()) ? date : null;
};


const createBooking = async (
    userId: string,
    payload: {
        tutorId: string;
        date: Date;
        startTime: Date;
        endTime: Date;
    }
) => {

    const date = toValidDate(payload.date);
    const startTime = new Date(payload.startTime); // already UTC
    const endTime = new Date(payload.endTime);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        throw new AppError(400, "Invalid time");
    }

    // console.log("RAW payload:", payload.startTime);
    // console.log("Parsed Date:", new Date(payload.startTime));
    // console.log("ISO:", new Date(payload.startTime).toISOString());

    if (!date || !startTime || !endTime) {
        throw new AppError(400, "Invalid date or time provided");
    }

    if (startTime >= endTime) {
        throw new AppError(400, "Start time must be before end time");
    }

    // independent queries in parallel
    const [user, tutor, student] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        }),
        prisma.tutorProfile.findUnique({
            where: { id: payload.tutorId },
            select: { id: true },
        }),
        prisma.studentProfile.findUnique({
            where: { userId },
            select: { id: true },
        }),
    ]);

    if (!user) throw new AppError(404, "User not found!");
    if (user.role !== USER_ROLES.STUDENT) {
        throw new AppError(401, "Unauthorized! Only students can create bookings.");
    }

    if (!tutor) throw new AppError(404, "Tutor not found!");
    if (!student) throw new AppError(404, "Student not found!");

    // overlapping bookings
    const overlap = await prisma.booking.findFirst({
        where: {
            tutorId: payload.tutorId,
            status: {
                in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
            },
            OR: [
                {
                    startTime: { lt: endTime },
                    endTime: { gt: startTime },
                },
            ],
        },
    });

    if (overlap) {
        throw new AppError(409, "This time slot is already booked");
    }

    // ensure booking is in future
    if (payload.startTime <= new Date()) {
        throw new AppError(400, "Cannot book past time slots");
    }

    const bookings = await prisma.booking.create({
        data: {
            tutorId: payload.tutorId,
            studentId: student.id,
            date: payload.startTime,
            startTime: payload.startTime,
            endTime: payload.endTime,
        },
    });
    console.log("booking:", bookings);
    return bookings;
};

const getAllBookings = async (role: UserRoles, query: GetAllBookingsQuery) => {
    // 0. Authorization
    if (role !== USER_ROLES.ADMIN) {
        throw new AppError(401, "Unauthorized! Only admin can access this resource.");
    }

    // 1. Pagination + sorting
    const { page, limit, skip, sortBy, sortOrder } =
        paginationSorting(query);

    // 2. Prevent unsafe sorting
    const allowedSortFields = ["createdAt", "date", "status"];
    const safeSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : "createdAt";

    const searchTerm = query.searchTerm?.trim();
    const status =
        query.status &&
            Object.values(BookingStatus).includes(query.status as BookingStatus)
            ? (query.status as BookingStatus)
            : undefined;

    // 3. Build WHERE condition
    const whereCondition: any = {
        // Filter by booking status
        ...(status && { status }),

        // Filter by tutor
        ...(query.tutorId && {
            tutorId: query.tutorId,
        }),

        // Filter by student
        ...(query.studentId && {
            studentId: query.studentId,
        }),

        // Date range filter
        ...(query.startDate || query.endDate
            ? {
                date: {
                    ...(query.startDate && {
                        gte: new Date(`${query.startDate}T00:00:00.000Z`),
                    }),
                    ...(query.endDate && {
                        lte: new Date(`${query.endDate}T23:59:59.999Z`),
                    }),
                },
            }
            : {}),

        // Search by tutor/student name
        ...(searchTerm && {
            OR: [
                {
                    tutor: {
                        user: {
                            name: {
                                contains: searchTerm,
                                mode: "insensitive",
                            },
                        },
                    },
                },
                {
                    student: {
                        user: {
                            name: {
                                contains: searchTerm,
                                mode: "insensitive",
                            },
                        },
                    },
                },
            ],
        }),
    };

    // 4. Run queries in parallel
    const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
            where: whereCondition,
            include: {
                tutor: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                student: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
            take: limit,
            skip,
            orderBy: {
                [safeSortBy]: sortOrder,
            },
        }),

        prisma.booking.count({
            where: whereCondition,
        }),
    ]);

    // 5. Return structured response
    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        data: bookings,
    };
};

const getMyBookings = async (userId: string, query: GetMyBookingsQuery) => {
    // 1. Get user
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true },
    });

    if (!user) throw new AppError(404, "User not found!");

    // 2. Pagination + sorting
    const { page, limit, skip, sortBy, sortOrder } =
        paginationSorting(query);

    const allowedSortFields = ["createdAt", "date", "status"];
    const safeSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : "createdAt";

    const status =
        query.status &&
            Object.values(BookingStatus).includes(query.status as BookingStatus)
            ? (query.status as BookingStatus)
            : undefined;

    // 3. Base WHERE condition
    let whereCondition: any = {};

    // 4. Role-based filtering
    if (user.role === USER_ROLES.STUDENT) {
        const student = await prisma.studentProfile.findUnique({
            where: { userId },
            select: { id: true },
        });

        if (!student) throw new AppError(404, "Student not found");

        whereCondition.studentId = student.id;
    }

    if (user.role === USER_ROLES.TUTOR) {
        const tutor = await prisma.tutorProfile.findUnique({
            where: { userId },
            select: { id: true },
        });

        if (!tutor) throw new AppError(404, "Tutor not found");

        whereCondition.tutorId = tutor.id;
    }

    // 5. Optional filters
    if (status) {
        whereCondition.status = status;
    }

    if (query.startDate || query.endDate) {
        whereCondition.date = {
            ...(query.startDate && {
                gte: new Date(`${query.startDate}T00:00:00.000Z`),
            }),
            ...(query.endDate && {
                lte: new Date(`${query.endDate}T23:59:59.999Z`),
            }),
        };
    }

    // 6. Run queries in parallel
    const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
            where: whereCondition,
            include: {
                tutor: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                image: true,
                            },
                        },
                    },
                },
                student: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                image: true,
                            },
                        },
                    },
                },
            },
            take: limit,
            skip,
            orderBy: {
                [safeSortBy]: sortOrder,
            },
        }),

        prisma.booking.count({
            where: whereCondition,
        }),
    ]);

    // 7. Return structured response
    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        data: bookings,
    };
};

const getBookingByBookingId = async (bookingId: string) => {
    if (!bookingId) {
        throw new AppError(400, "Booking ID is required");
    }
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            tutor: true,
            student: true,
        },
    });

    if (!booking) throw new AppError(404, "Booking not found");

    return booking;
};

const updateBookingStatus = async (
    userId: string,
    bookingId: string,
    status: BookingStatus
) => {
    const allowedStatuses = [
        BookingStatus.PENDING,
        BookingStatus.CONFIRMED,
        BookingStatus.COMPLETED,
        BookingStatus.DECLINED,
        BookingStatus.CANCELLED
    ];
    if (!allowedStatuses.includes(status)) {
        throw new AppError(
            400,
            `Invalid status! Allowed: ${allowedStatuses.join(", ")}`
        );
    }

    return prisma.$transaction(async (tx) => {
        // 1. User
        const user = await tx.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });
        if (!user) throw new AppError(401, "User not found");

        // 2. Booking
        const booking = await tx.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) throw new AppError(404, "Booking not found");

        // 3. Prevent same update
        if (booking.status === status) {
            throw new AppError(409, `Booking already ${status}`);
        }

        // 4. Transition FIRST (most important)
        const validTransitions: Record<BookingStatus, BookingStatus[]> = {
            PENDING: [
                BookingStatus.CONFIRMED,
                BookingStatus.DECLINED,
                BookingStatus.CANCELLED,
            ],
            CONFIRMED: [
                BookingStatus.COMPLETED,
                BookingStatus.CANCELLED,
            ],
            COMPLETED: [],
            CANCELLED: [],
            DECLINED: [],
        };

        if (!validTransitions[booking.status]?.includes(status)) {
            throw new AppError(
                400,
                `Invalid transition ${booking.status} → ${status}`
            );
        }

        // 5. Role + ownership
        if (user.role === USER_ROLES.STUDENT) {
            const student = await tx.studentProfile.findUnique({
                where: { userId },
            });
            if (!student) throw new AppError(404, "Student profile not found");

            if (student.id !== booking.studentId) {
                throw new AppError(403, "You can only modify your own bookings");
            }

            // student can ONLY cancel
            if (status !== BookingStatus.CANCELLED) {
                throw new AppError(403, "Students can only cancel bookings");
            }
        }

        else if (user.role === USER_ROLES.TUTOR) {
            const tutor = await tx.tutorProfile.findUnique({
                where: { userId },
            });
            if (!tutor) throw new AppError(404, "Tutor profile not found");

            if (tutor.id !== booking.tutorId) {
                throw new AppError(403, "You can only modify your own bookings");
            }

            const tutorAllowed: BookingStatus[] = [
                BookingStatus.CONFIRMED,
                BookingStatus.COMPLETED,
                BookingStatus.DECLINED,
            ];

            if (!tutorAllowed.includes(status)) {
                throw new AppError(403, "Invalid action for tutor");
            }
        }

        else if (user.role === USER_ROLES.ADMIN) {
            // admin → allow all (or restrict if needed)
        }

        else {
            throw new AppError(403, "Unauthorized role");
        }

        // 6. Side effects (Meet link)
        let meetingLink = booking.meetingLink;
        let meetingType = booking.meetingType;

        if (status === BookingStatus.CONFIRMED && !meetingLink) {
            meetingLink = (await createMeetLink(booking, userId)) ?? null;
            meetingType = "GOOGLE_MEET";
        }

        // 7. Update
        const updatedBooking = await tx.booking.update({
            where: { id: bookingId },
            data: {
                status,
                meetingLink,
                meetingType: meetingType ?? null,
            },
        });

        return updatedBooking;
    });
};


export const BookingService = {
    createBooking,
    getAllBookings,
    getMyBookings,
    getBookingByBookingId,
    updateBookingStatus,
};