import { USER_ROLES } from "../../constants/userRoles";
import { AppError } from "../../errors/AppError";
import paginationSorting from "../../helpers/paginationSorting.helper";
import { prisma } from "../../lib/prisma";
import { CreateStudentPayload, GetStudentQuery } from "./student.types";


const getAllStudentProfiles = async (query: GetStudentQuery) => {
    // 1. Pagination + sorting
    const { page, limit, skip, sortBy, sortOrder } =
        paginationSorting(query);

    const searchTerm = query.searchTerm?.trim();

    // 2. Prevent unsafe sorting
    const allowedSortFields = ["createdAt"];
    const safeSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : "createdAt";

    // 3. Build WHERE condition
    const whereCondition: any = {
        user: {
            status: "ACTIVE",
            role: USER_ROLES.STUDENT,
        },

        // Optional search (by name/email/category)
        ...(searchTerm && {
            OR: [
                {
                    user: {
                        name: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    user: {
                        email: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    categories: {
                        some: {
                            OR: [
                                {
                                    category: {
                                        name: {
                                            contains: searchTerm,
                                            mode: "insensitive",
                                        },
                                    },
                                },
                                {
                                    category: {
                                        parent: {
                                            name: {
                                                contains: searchTerm,
                                                mode: "insensitive",
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
            ],
        }),
    };

    // 4. Run queries in parallel
    const [students, total] = await Promise.all([
        prisma.studentProfile.findMany({
            where: whereCondition,
            include: {
                user: true,
                bookingsAsStudent: true,
                studentReviews: true,
                categories: {
                    include: {
                        category: {
                            include: {
                                parent: true,
                            },
                        },
                    },
                },
                _count: true,
            },
            take: limit,
            skip,
            orderBy: {
                [safeSortBy]: sortOrder,
            },
        }),

        prisma.studentProfile.count({
            where: whereCondition,
        }),
    ]);

    // 5. Format response
    const formattedStudents = students.map((student) => ({
        ...student,
        categories: student.categories.map((c) => c.category),
    }));

    // 6. Return structured response
    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        data: formattedStudents,
    };
};

const getMyStudentProfile = async (userId: string) => {
    const student = await prisma.studentProfile.findUnique({
        where: { userId },
        include: {
            user: true,
            bookingsAsStudent: true,
            studentReviews: true,
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

    if (!student) {
        throw new AppError(404, "Student not found");
    }

    const formattedStudentData = {
        ...student,
        categories: student?.categories.map((c) => c.category),
    };

    return formattedStudentData;
};

const getStudentProfileById = async (studentId: string) => {
    const student = await prisma.studentProfile.findUnique({
        where: { id: studentId, },
        include: {
            user: true,
            bookingsAsStudent: true,
            studentReviews: true,
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

    if (!student) {
        throw new AppError(404, "Student not found");
    }

    const formattedStudentData = {
        ...student,
        categories: student?.categories.map((c) => c.category),
    };

    return formattedStudentData;
};

const createStudentProfile = async (payload: CreateStudentPayload, userId: string) => {

    // 1. Check user exists & is student
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError(404, "User not found");
    }
    if (user.role !== USER_ROLES.STUDENT) {
        throw new AppError(403, "Only students can create student profiles");
    }

    // 2. Prevent duplicate profile
    const existingProfile = await prisma.studentProfile.findUnique({
        where: { userId },
    });
    if (existingProfile) {
        throw new AppError(409, "Student profile already exists");
    }

    // 3. Create student profile + studentCategories (transaction)
    const result = await prisma.$transaction(async (tx) => {
        // Create profile
        const studentProfile = await tx.studentProfile.create({
            data: {
                bio: payload.bio ?? null,
                education: payload.education ?? null,
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
                throw new AppError(400, "One or more category IDs are invalid. Only subcategories are allowed.");
            }

            await tx.studentCategory.createMany({
                data: uniqueCategoryIds.map((categoryId) => ({
                    studentId: studentProfile.id,
                    categoryId,
                })),
                skipDuplicates: true,
            });
        }
        return studentProfile;
    });
    return result;
};

const updateStudentProfile = async (
    payload: Partial<CreateStudentPayload>,
    studentId: string,
    userId: string
) => {

    const student = await prisma.studentProfile.findUnique({
        where: { id: studentId },
    });

    if (!student) {
        throw new AppError(404, "Student not found");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    const isAdmin = user?.role === USER_ROLES.ADMIN;
    const isOwner = student?.userId === userId;

    if (!isAdmin && !isOwner) {
        throw new AppError(403, "You are not authorized! Only Admin or the Owner can update profile")
    }

    const result = await prisma.$transaction(async (tx) => {
        // 1. Update basic profile fields
        const updateData = Object.fromEntries(
            Object.entries({
                bio: payload.bio,
                education: payload.education,
            }).filter(([_, value]) => value !== undefined)
        );

        const updatedStudent = await tx.studentProfile.update({
            where: { id: studentId },
            data: updateData,
        });

        // 2. Update categories if provided
        if (payload.categories) {

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
                throw new AppError(400, "One or more category IDs are invalid");
            }

            // remove old relations
            await tx.studentCategory.deleteMany({
                where: { studentId },
            });

            // add new relations
            await tx.studentCategory.createMany({
                data: uniqueCategoryIds.map((categoryId) => ({
                    studentId,
                    categoryId,
                })),
                skipDuplicates: true,
            });
        }
        return updatedStudent;
    });
    return result;
};

const deleteStudentProfile = async (studentId: string, userId: string) => {
    const student = await prisma.studentProfile.findUnique({
        where: { id: studentId },
    });

    if (!student) {
        throw new AppError(404, "Student not found");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    const isAdmin = user?.role === USER_ROLES.ADMIN;
    const isOwner = student?.userId === userId;

    if (!isAdmin && !isOwner) {
        throw new AppError(403, "You are not authorized! Only Admin or the Owner can delete profile")
    }

    const result = await prisma.$transaction(async (tx) => {
        // delete relations first (important if no cascade)  >> I have no cascade but implemented it just to practice
        await tx.studentCategory.deleteMany({
            where: { studentId },
        });

        return await tx.studentProfile.delete({
            where: { id: studentId },
        });
    });
    return result;
};


export const StudentService = {
    getAllStudentProfiles,
    getMyStudentProfile,
    getStudentProfileById,
    createStudentProfile,
    updateStudentProfile,
    deleteStudentProfile,
};
