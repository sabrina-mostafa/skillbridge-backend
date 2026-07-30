import { USER_ROLES } from "../../constants/userRoles";
import { convertStrToNum } from "../../utils/convertStrToNum.utils";
import paginationSorting from "../../helpers/paginationSorting.helper";
import { prisma } from "../../lib/prisma";
import { CreateTutorPayload, dayMap, GetStudentsQuery, GetTutorsQuery } from "./tutor.types";
import { generateTimeSlots } from "../../helpers/generateTimeSlots";
import { BookingStatus, DayOfWeek } from "../../../generated/prisma/enums";
import { AppError } from "../../errors/AppError";
import { AVAILABILITY_STATUS, AvailabilityStatus } from "../../constants/availabilityStatus";



const getAllTutorProfiles = async (query: GetTutorsQuery) => {
    // 1. Convert query params safely
    const minRating = convertStrToNum(query.minRating, "minRating");
    const minPrice = convertStrToNum(query.minPrice, "minPrice");
    const maxPrice = convertStrToNum(query.maxPrice, "maxPrice");
    const subjectId = query.course?.trim();

    // 2. Pagination + sorting
    const { page, limit, skip, sortBy, sortOrder } =
        paginationSorting(query);

    const searchTerm = query.searchTerm?.trim();  // category name

    // 3. Prevent unsafe sorting (VERY IMPORTANT)
    const allowedSortFields = ["avgRating", "hourlyRate", "createdAt"];
    const safeSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : "createdAt";

    // 4. Build reusable WHERE condition
    const whereCondition: any = {
        user: {
            status: "ACTIVE",
            role: USER_ROLES.TUTOR,
        },

        ...(query.isFeatured !== undefined && {
            isFeatured: query.isFeatured === "true",
        }),

        ...(subjectId && {
            categories: {
                some: {
                    categoryId: subjectId,
                },
            },
        }),

        ...(minPrice !== undefined || maxPrice !== undefined
            ? {
                hourlyRate: {
                    ...(minPrice !== undefined && { gte: minPrice }),
                    ...(maxPrice !== undefined && { lte: maxPrice }),
                },
            }
            : {}),

        ...(searchTerm && {
            OR: [
                // 1. Search by tutor name (NEW)
                {
                    user: {
                        name: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                },

                // 2. Search by category / subject
                {
                    categories: {
                        some: {
                            category: {
                                name: {
                                    contains: searchTerm,
                                    mode: "insensitive",
                                },
                            },
                        },
                    },
                },

                // 3. Search by parent category
                {
                    categories: {
                        some: {
                            category: {
                                parent: {
                                    name: {
                                        contains: searchTerm,
                                        mode: "insensitive",
                                    },
                                },
                            },
                        },
                    },
                },
            ],
        }),

        ...(minRating !== undefined && {
            avgRating: {
                gte: minRating,
            },
        }),
    };

    // 5. Run queries in parallel (data + count)
    const [tutors, total] = await Promise.all([
        prisma.tutorProfile.findMany({
            where: whereCondition,
            include: {
                user: true,
                availability: true,
                bookingsAsTutor: true,
                tutorReviews: true,
                categories: {
                    include: {
                        category: {
                            include: {
                                parent: true
                            }
                        },
                    },
                },
                _count: true
            },
            take: limit,
            skip,
            orderBy: {
                [safeSortBy]: sortOrder,
            },
        }),

        prisma.tutorProfile.count({
            where: whereCondition,
        }),
    ]);

    // 6. Format response
    const formattedTutors = tutors.map((tutor) => ({
        ...tutor,
        categories: tutor.categories.map((c) => c.category),
    }));

    // 7. Return structured response
    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        data: formattedTutors,
    };
};

const getMyStudents = async (
    userId: string,
    query: GetStudentsQuery
) => {
    const tutor = await prisma.tutorProfile.findUnique({
        where: {
            userId,
        },
        select: {
            id: true,
        },
    });

    if (!tutor) {
        throw new AppError(404, "Tutor profile not found");
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationSorting(query);

    const searchTerm = query.searchTerm?.trim();

    const whereCondition: any = {
        tutorId: tutor.id,

        ...(searchTerm && {
            student: {
                user: {
                    name: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            },
        }),
    };

    const bookings = await prisma.booking.findMany({
        where: whereCondition,

        include: {
            student: {
                include: {
                    user: true,
                },
            },
            review: true,
        },

        orderBy: {
            [sortBy]: sortOrder,
        },
    });

    /**
     * Group bookings by student
     */

    const studentMap = new Map();

    for (const booking of bookings) {
        const studentId = booking.student.id;

        if (!studentMap.has(studentId)) {
            studentMap.set(studentId, {
                id: booking.student.id,

                user: booking.student.user,

                totalBookings: 0,

                completedBookings: 0,

                cancelledBookings: 0,

                latestBooking: booking.createdAt,

                hasReviewed: false,
            });
        }

        const student = studentMap.get(studentId);

        student.totalBookings++;

        if (booking.status === "COMPLETED") {
            student.completedBookings++;
        }

        if (booking.status === "CANCELLED") {
            student.cancelledBookings++;
        }

        if (booking.review) {
            student.hasReviewed = true;
        }

        if (
            booking.createdAt >
            student.latestBooking
        ) {
            student.latestBooking = booking.createdAt;
        }
    }

    const students = [...studentMap.values()];

    students.sort((a, b) =>
        sortOrder === "asc"
            ? a.latestBooking.getTime() -
            b.latestBooking.getTime()
            : b.latestBooking.getTime() -
            a.latestBooking.getTime()
    );

    const total = students.length;

    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },

        data: students.slice(skip, skip + limit),
    };
};

const getMyTutorProfile = async (userId: string) => {
    const tutor = await prisma.tutorProfile.findUnique({
        where: { userId, },
        include: {
            user: true,
            bookingsAsTutor: true,
            tutorReviews: true,
            availability: true,
            categories: {
                include: {
                    category: {
                        include: {
                            parent: true
                        }
                    },
                },
            },
        },
    });

    if (!tutor) {
        throw new AppError(404, "Tutor not found");
    }

    const formattedTutorsData = {
        ...tutor,
        categories: tutor?.categories.map((c) => c.category),
    };

    return formattedTutorsData;
};

const getTutorProfileById = async (tutorId: string) => {
    const tutor = await prisma.tutorProfile.findUnique({
        where: { id: tutorId, },
        include: {
            user: true,
            bookingsAsTutor: true,
            tutorReviews: {
                include: {
                    student: {
                        select: {
                            user: {
                                select: {
                                    name: true,
                                    image: true
                                }
                            }
                        }
                    }
                }

            },
            availability: true,
            categories: {
                include: {
                    category: {
                        include: {
                            parent: true
                        }
                    },
                },
            },
        },
    });

    if (!tutor) {
        throw new AppError(404, "Tutor not found");
    }

    const formattedTutorsData = {
        ...tutor,
        categories: tutor?.categories.map((c) => c.category),
    };

    return formattedTutorsData;
};

const getAvailableDates = async (tutorId: string) => {
    const tutor = await prisma.tutorProfile.findUnique({
        where: {
            id: tutorId,
            user: {
                status: "ACTIVE",
                role: USER_ROLES.TUTOR,
            },
        }
    });

    if (!tutor) {
        throw new AppError(404, "Tutor not found");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + 2);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);
    endDate.setHours(23, 59, 59, 999);

    // 1. Fetch all availabilities of the tutor
    const availabilities = await prisma.availability.findMany({
        where: { tutorId, isActive: true },
    });

    if (!availabilities.length) {
        return {
            tutorId,
            dates: [],
        };
    }

    // 2. Fetch all bookings of the tutor for next 30 days 
    const bookings = await prisma.booking.findMany({
        where: {
            tutorId,
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
        select: {
            startTime: true,
        },
    });

    // 3. Group bookings by date  // map<date, set<startTimeDate> >
    // const bookingMap = new Map<string, Set<string>>();
    const bookingMap = new Map<string, Set<number>>();

    for (const b of bookings) {
        const dateKey = b.startTime.toLocaleDateString("en-CA");

        if (!bookingMap.has(dateKey)) {
            bookingMap.set(dateKey, new Set());
        }
        // bookingMap.get(dateKey)!.add(b.startTime.toISOString());
        bookingMap.get(dateKey)!.add(b.startTime.getTime());
    }

    // 4. Group availability by weekday   // map<dayOfWeek, availability>
    const availableDays = new Map<string, typeof availabilities>();

    for (const a of availabilities) {
        if (!availableDays.has(a.dayOfWeek)) {
            availableDays.set(a.dayOfWeek, []);
        }
        availableDays.get(a.dayOfWeek)!.push(a);
    }
    const results: any[] = [];

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // 5. Loop (NO DB CALLS) -----> dates for next 30days
    for (let i = 0; i < totalDays; i++) {
        const date = new Date(startDate);   // full time date with zone
        date.setDate(startDate.getDate() + i);
        date.setHours(0, 0, 0, 0);

        const dayName = dayMap[date.getDay()];    // dayOfWeek
        const dateKey = date.toLocaleDateString("en-CA");   // date part only

        const dayAvailabilities = availableDays.get(dayName as DayOfWeek);

        if (!dayAvailabilities) {
            results.push({
                date: dateKey,
                status: AVAILABILITY_STATUS.UNAVAILABLE,
                availableSlots: 0,
            });
            continue;
        }

        let totalSlots = 0;
        let bookedSlots = 0;

        const bookedSet = bookingMap.get(dateKey) ?? new Set<number>();

        for (const avail of dayAvailabilities) {
            const slots = generateTimeSlots(
                avail.startTime,
                avail.endTime,
                avail.slotDuration,
                new Date(dateKey),
                // date
            );
            totalSlots += slots.length;

            for (const slot of slots) {
                if (bookedSet.has(slot.start.getTime())) {
                    bookedSlots++;
                }
            }
        }
        const availableSlots = totalSlots - bookedSlots;

        let status: AvailabilityStatus;

        if (totalSlots === 0) {
            status = AVAILABILITY_STATUS.UNAVAILABLE;
        } else if (availableSlots === 0) {
            status = AVAILABILITY_STATUS.FULL;
        } else if (availableSlots === totalSlots) {
            status = AVAILABILITY_STATUS.AVAILABLE;
        } else {
            status = AVAILABILITY_STATUS.PARTIAL;
        }

        results.push({
            date: dateKey,
            status,
            availableSlots,
        });
    }

    return {
        tutorId,
        range: {
            from: startDate.toLocaleDateString("en-CA"),
            to: endDate.toLocaleDateString("en-CA"),
            // from: startDate.toISOString().split("T")[0],
            // to: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
            //     .toISOString()
            //     .split("T")[0],
        },
        dates: results,
    };
};

const getAvailableSlotsForDate = async (
    tutorId: string,
    date: string
) => {
    if (!date || typeof date !== "string") {
        throw new AppError(400, "Date query is required");
    }

    const tutor = await prisma.tutorProfile.findUnique({
        where: {
            id: tutorId,
            user: {
                status: "ACTIVE",
                role: USER_ROLES.TUTOR,
            },
        }
    });

    if (!tutor) {
        throw new AppError(404, "Tutor not found");
    }

    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
        throw new AppError(400, "Invalid date format. Use YYYY-MM-DD");
    }

    const dayOfWeek = targetDate.getDay();
    const dayName = dayMap[dayOfWeek];

    // 1. Fetch availability
    const availability = await prisma.availability.findMany({
        where: {
            tutorId,
            dayOfWeek: dayName as DayOfWeek,
            isActive: true,
        },
    });
    if (!availability.length) return [];

    // 2. Better date boundary (LOCAL SAFE)
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    // 3. Fetch only required field
    const bookings = await prisma.booking.findMany({
        where: {
            tutorId,
            status: {
                in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
            },
            startTime: {
                gte: start,
                lte: end,
            },
        },
        select: {
            startTime: true,
        },
    });

    // 4. Precompute booked slots (FAST lookup)
    const bookedSet = new Set<number>(
        bookings.map((b) => b.startTime.getTime())
    );

    let allSlots: any[] = [];

    for (const avail of availability) {
        const slots = generateTimeSlots(
            avail.startTime,
            avail.endTime,
            avail.slotDuration,
            targetDate
        );
        for (const slot of slots) {
            const slotTime = slot.start.getTime();

            if (!bookedSet.has(slotTime)) {
                allSlots.push(slot);
            }
        }
    }

    return {
        tutorId,
        date,
        totalSlots: allSlots.length,
        slots: allSlots,
    };
};

const createTutorProfile = async (payload: CreateTutorPayload, userId: string) => {

    // 1. Check user exists & is tutor
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError(404, "User not found");
    }
    if (user.role !== USER_ROLES.TUTOR && user.role !== USER_ROLES.ADMIN) {
        throw new AppError(403, "Only tutors or admin can create tutor profile");
    }

    // 2. Prevent duplicate profile
    const existingProfile = await prisma.tutorProfile.findUnique({
        where: { userId },
    });
    if (existingProfile) {
        throw new AppError(409, "Tutor profile already exists");
    }

    // 3. Create tutor profile + tutorCategories (transaction)
    const result = await prisma.$transaction(async (tx) => {
        // Create profile
        const tutorProfile = await tx.tutorProfile.create({
            data: {
                bio: payload.bio ?? null,
                education: payload.education.toUpperCase(),
                experience: payload.experience,
                hourlyRate: payload.hourlyRate,
                // isFeatured: payload.isFeatured ?? false,
                user: {
                    connect: { id: userId },
                },
            },
        });

        // 4. Handle categories
        if (payload.categories?.length) {

            const uniqueCategoryIds = [...new Set(payload.categories)];

            // validate categories
            const categories = await tx.categories.findMany({
                where: {
                    id: { in: uniqueCategoryIds },
                    parentId: { not: null }
                },
                select: { id: true },
            });

            if (categories.length !== uniqueCategoryIds.length) {
                throw new AppError(400, "Invalid category selection. Only subcategories are allowed.");
            }

            await tx.tutorCategory.createMany({
                data: uniqueCategoryIds.map((categoryId) => ({
                    tutorId: tutorProfile.id,
                    categoryId,
                })),
                skipDuplicates: true,
            });

            // marking profile creation as complete
            await tx.user.update({
                where: { id: userId },
                data: {
                    profileCompleted: true,
                },
            });
        }
        return tutorProfile;
    });
    return result;
};

const updateTutorProfile = async (
    payload: Partial<CreateTutorPayload>,
    tutorId: string,
    userId: string
) => {

    const tutor = await prisma.tutorProfile.findUnique({
        where: { id: tutorId },
    });

    if (!tutor) {
        throw new AppError(404, "Tutor not found");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    const isAdmin = user?.role === USER_ROLES.ADMIN;
    const isOwner = tutor?.userId === userId;

    if (!isAdmin && !isOwner) {
        throw new AppError(403, "You are not authorized!");
    }

    const result = await prisma.$transaction(async (tx) => {
        // 1. Update basic profile fields
        const updateData = Object.fromEntries(
            Object.entries({
                bio: payload.bio,
                education: payload.education?.toUpperCase(),
                experience: payload.experience,
                hourlyRate: payload.hourlyRate,
                // isFeatured: payload.isFeatured,
            }).filter(([_, value]) => value !== undefined)
        );

        const updatedTutor = await tx.tutorProfile.update({
            where: { id: tutorId },
            data: updateData,
        });

        // 2. Update categories if provided
        if (payload.categories) {

            const uniqueCategoryIds = [...new Set(payload.categories)];

            // validate categories
            const categories = await tx.categories.findMany({
                where: { id: { in: uniqueCategoryIds } },
                select: { id: true },
            });

            if (categories.length !== uniqueCategoryIds.length) {
                throw new AppError(400, "One or more category IDs are invalid");
            }

            // remove old relations
            await tx.tutorCategory.deleteMany({
                where: { tutorId },
            });

            // add new relations
            await tx.tutorCategory.createMany({
                data: uniqueCategoryIds.map((categoryId) => ({
                    tutorId,
                    categoryId,
                })),
                skipDuplicates: true,
            });
        }
        return updatedTutor;
    });
    return result;
};

const deleteTutorProfile = async (tutorId: string, userId: string) => {
    const tutor = await prisma.tutorProfile.findUnique({
        where: { id: tutorId },
    });

    if (!tutor) {
        throw new AppError(404, "Tutor not found");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    const isAdmin = user?.role === USER_ROLES.ADMIN;
    const isOwner = tutor?.userId === userId;

    if (!isAdmin && !isOwner) {
        throw new AppError(403, "You are not authorized!")
    }

    const result = await prisma.$transaction(async (tx) => {
        // delete relations first (important if no cascade)  >> I have no cascade but implemented it just to practice
        await tx.tutorCategory.deleteMany({
            where: { tutorId },
        });

        await tx.availability.deleteMany({
            where: { tutorId },
        });

        return await tx.tutorProfile.delete({
            where: { id: tutorId },
        });
    });
    return result;
};


export const TutorService = {
    getAllTutorProfiles,
    getMyStudents,
    getMyTutorProfile,
    getTutorProfileById,
    getAvailableDates,
    getAvailableSlotsForDate,
    createTutorProfile,
    updateTutorProfile,
    deleteTutorProfile,
};
