import { Prisma } from "../../../generated/prisma/browser";
import { User } from "../../../generated/prisma/client";
import { BookingStatus } from "../../../generated/prisma/enums";
import { USER_ROLES, UserRoles } from "../../constants/userRoles";
import { AppError } from "../../errors/AppError";
import paginationSorting from "../../helpers/paginationSorting.helper";
import { prisma } from "../../lib/prisma";
import { CreateReviewPayload, GetReviewQuery, UpdateReviewPayload } from "./review.types";


const createReview = async (userId: string, data: CreateReviewPayload) => {
    return await prisma.$transaction(async (tx) => {
        //user
        const user = await tx.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new AppError(404, "User not found");
        }

        // 1. Combined Check: Get student and verify booking in ONE query
        const studentWithBooking = await tx.studentProfile.findUnique({
            where: { userId },
            include: {
                bookingsAsStudent: {
                    where: {
                        id: data.bookingId,
                        status: "COMPLETED",
                    },
                    include: {
                        review: true, // Check if review exists in the same query
                        tutor: true   // Get tutor stats in the same query
                    }
                }
            }
        });
        if (!studentWithBooking) throw new AppError(404, "Student profile not found");

        const booking = studentWithBooking.bookingsAsStudent[0];

        if (!booking) throw new AppError(404, "No completed booking found with this ID.");
        if (booking.review) throw new AppError(409, "You have already reviewed this booking.");

        const tutor = booking.tutor;
        if (!tutor) throw new AppError(404, "Tutor not found.");

        // 2. Create the Review
        const review = await tx.review.create({
            data: {
                tutorId: booking.tutorId,
                studentId: studentWithBooking.id,
                bookingId: data.bookingId,
                rating: data.rating,
                comment: data.comment ?? null
            }
        });

        // 3. Compute new avg
        const newTotal = tutor.totalReviews + 1;
        const newAvg =
            ((tutor.avgRating * tutor.totalReviews) + data.rating) /
            newTotal;

        // 4. Update tutor
        await tx.tutorProfile.update({
            where: { id: booking.tutorId },
            data: {
                totalReviews: newTotal,
                avgRating: newAvg,
            },
        });

        return review;
    });
};

const updateReview = async (reviewId: string, userId: string, data: UpdateReviewPayload) => {

    return await prisma.$transaction(async (tx) => {
        //user
        const user = await tx.user.findUnique({
            where: { id: userId }
        });
        if (!user) { throw new AppError(404, "User not found!") }

        // 1. ONE query to rule them all: Fetch review, verify owner, and get tutor stats
        const reviewData = await tx.review.findUnique({
            where: { id: reviewId },
            include: {
                student: true, // To verify ownership via userId
                tutor: {       // To get current avgRating and totalReviews
                    select: { id: true, avgRating: true, totalReviews: true }
                }
            }
        });

        // 2. Comprehensive validation
        if (!reviewData) throw new AppError(404, "Review not found!");
        if (!reviewData.student) throw new AppError(404, "Student not found!");
        if (reviewData.student.userId !== userId) {
            throw new AppError(403, "Unauthorized! Only the author can update this review.");
        }
        if (!reviewData.tutor) throw new AppError(404, "Tutor not found!");

        const oldRating = reviewData.rating;
        const newRating = data.rating ?? oldRating;

        // 3. Update the Review
        const updatedReview = await tx.review.update({
            where: { id: reviewId },
            data: {
                rating: newRating,
                comment: data.comment ?? reviewData.comment
            }
        });

        if (data.rating !== undefined && data.rating !== oldRating) {
            const tutor = reviewData.tutor;

            const updatedTotalScore = (tutor.avgRating * tutor.totalReviews) - oldRating + newRating;
            const newAvg = updatedTotalScore / tutor.totalReviews;

            // Update tutor
            await tx.tutorProfile.update({
                where: { id: tutor.id },
                data: {
                    avgRating: parseFloat(newAvg.toFixed(2)),
                },
            });
        }
        return updatedReview;
    });
};

const getReviewByTutorId = async (
    tutorId: string,
    query: GetReviewQuery
) => {
    // 1. Pagination + sorting
    const { page, limit, skip, sortBy, sortOrder } =
        paginationSorting(query);

    // 2. Prevent unsafe sorting
    const allowedSortFields = ["createdAt", "rating"];
    const safeSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : "createdAt";

    // 3. Optional filters
    const minRating = query.minRating
        ? Number(query.minRating)
        : undefined;

    const whereCondition: any = {
        tutorId,

        ...(minRating !== undefined && {
            rating: {
                gte: minRating,
            },
        }),
    };

    // 4. Run queries in parallel
    const [reviews, total] = await Promise.all([
        prisma.review.findMany({
            where: whereCondition,
            include: {
                student: {
                    select: {
                        user: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                    },
                },
                tutor: {
                    select: {
                        education: true,
                        user: {
                            select: {
                                name: true,
                                image: true,
                            },
                        }
                    }
                },
                booking: {
                    select: {
                        category: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            },
            take: limit,
            skip,
            orderBy: {
                [safeSortBy]: sortOrder,
            },
        }),

        prisma.review.count({
            where: whereCondition,
        }),
    ]);

    // 5. (Optional) Check tutor existence ONLY if needed
    if (!reviews.length) {
        const tutorExists = await prisma.tutorProfile.findUnique({
            where: { id: tutorId },
            select: { id: true },
        });

        if (!tutorExists) {
            throw new AppError(404, "Tutor doesn't exist");
        }
    }

    // 6. Return structured response
    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        data: reviews,
    };
};

const getMyReviews = async (
    userId: string,
    role: UserRoles,
    query: GetReviewQuery
) => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationSorting(query);

    const allowedSortFields = ["createdAt", "rating"];

    const safeSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : "createdAt";

    const minRating = query.minRating
        ? Number(query.minRating)
        : undefined;

    let whereCondition: Prisma.ReviewWhereInput = {};

    if (role === USER_ROLES.STUDENT) {
        const student = await prisma.studentProfile.findUnique({
            where: {
                userId,
            },
            select: {
                id: true,
            },
        });

        if (!student) {
            throw new AppError(404, "Student profile not found");
        }

        whereCondition.studentId = student.id;
    }

    if (role === USER_ROLES.TUTOR) {
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

        whereCondition.tutorId = tutor.id;
    }

    if (minRating !== undefined) {
        whereCondition.rating = {
            gte: minRating,
        };
    }

    const [reviews, total] = await Promise.all([
        prisma.review.findMany({
            where: whereCondition,

            include: {
                tutor: {
                    select: {
                        education: true,
                        avgRating: true,
                        totalReviews: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                    },
                },

                student: {
                    select: {
                        education: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                    },
                },

                booking: {
                    include: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },

            skip,
            take: limit,

            orderBy: {
                [safeSortBy]: sortOrder,
            },
        }),

        prisma.review.count({
            where: whereCondition,
        }),
    ]);

    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        data: reviews,
    };
};

const getAllReviews = async (
    query: GetReviewQuery
) => {
    const {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    } = paginationSorting(query);

    const allowedSortFields = [
        "createdAt",
        "rating",
    ];

    const safeSortBy =
        allowedSortFields.includes(sortBy)
            ? sortBy
            : "createdAt";

    const minRating = query.minRating
        ? Number(query.minRating)
        : undefined;

    const searchTerm = query.searchTerm?.trim();

    const where: Prisma.ReviewWhereInput = {
        ...(minRating && {
            rating: {
                gte: minRating,
            },
        }),

        ...(searchTerm && {
            OR: [
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
                    booking: {
                        category: {
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

    const [reviews, total] =
        await Promise.all([
            prisma.review.findMany({
                where,

                include: {
                    student: {
                        include: {
                            user: true,
                        },
                    },

                    tutor: {
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

                skip,
                take: limit,

                orderBy: {
                    [safeSortBy]: sortOrder,
                },
            }),

            prisma.review.count({
                where,
            }),
        ]);

    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(
                total / limit
            ),
        },

        data: reviews,
    };
};

const deleteReview = async (reviewId: string, user: User) => {

    return await prisma.$transaction(async (tx) => {
        if (user.role !== USER_ROLES.STUDENT && user.role !== USER_ROLES.ADMIN) {
            throw new AppError(403, "Unauthorized!");
        }

        const review = await tx.review.findUnique({
            where: { id: reviewId },
            include: { tutor: true }
        });

        if (!review) throw new AppError(404, "Review doesn't exist!");
        if (!review.tutor) throw new AppError(404, "Tutor doesn't exist!");

        if (user.role === USER_ROLES.STUDENT) {
            const student = await tx.studentProfile.findUnique({
                where: { userId: user.id },
            });
            if (!student) throw new AppError(404, "Student profile not found!");
            if (review.studentId !== student.id) {
                throw new AppError(403, "Unauthorized! You can only delete your own reviews.");
            }
        }

        const tutor = review.tutor;

        const newTotal = Math.max(0, tutor.totalReviews - 1);
        let newAvg = 0;

        if (newTotal > 0) {
            const updatedTotalScore = (tutor.avgRating * tutor.totalReviews) - review.rating;
            newAvg = parseFloat((updatedTotalScore / newTotal).toFixed(2));
        }

        await tx.tutorProfile.update({
            where: { id: review.tutorId },
            data: {
                totalReviews: newTotal,
                avgRating: newAvg,
            },
        });

        return tx.review.delete({
            where: { id: reviewId },
        });
    });
};


export const reviewService = {
    createReview,
    updateReview,
    getReviewByTutorId,
    getMyReviews,
    getAllReviews,
    deleteReview,
}