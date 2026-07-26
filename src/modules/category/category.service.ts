import { USER_ROLES } from "../../constants/userRoles";
import { AppError } from "../../errors/AppError";
import paginationSorting from "../../helpers/paginationSorting.helper";
import { prisma } from "../../lib/prisma";
import { createCategoryPayload, getCategoryParams, updateCategoryPayload } from "./category.types";



const getAllCategories = async (query: getCategoryParams) => {
    const {
        search,
        parentOnly,
        childOnly,
        hasTutors,
        hasStudents,
        withNoStudent,
        withNoTutor,
    } = query;

    const { page, limit, skip, sortBy, sortOrder } = paginationSorting(query);

    if (parentOnly === "true" && childOnly === "true") {
        throw new AppError(
            400,
            "parentOnly and childOnly cannot both be true"
        );
    }

    const whereCondition: any = {
        ...(search && {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },

                {
                    children: {
                        some: {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                },
            ],
        }),

        ...(parentOnly === "true" && {
            parentId: null,
        }),

        ...(childOnly === "true" && {
            parentId: {
                not: null,
            },
        }),

        ...(hasTutors === "true" && {
            tutors: {
                some: {},
            },
        }),

        ...(hasStudents === "true" && {
            students: {
                some: {},
            },
        }),

        ...(withNoStudent === "true" && {
            students: {
                none: {},
            },
        }),

        ...(withNoTutor === "true" && {
            tutors: {
                none: {},
            },
        }),
    };

    const [categories, total] = await Promise.all([
        prisma.categories.findMany({
            where: whereCondition,
            include: {
                parent: true,
                children: true,
                _count: {
                    select: {
                        tutors: true,
                        students: true,
                        children: true,
                    },
                },
            },

            // PAGINATION ADDED
            skip,
            take: limit,

            // optional sorting (you already have sortBy/sortOrder)
            orderBy: {
                [sortBy || "name"]: sortOrder || "asc",
            },
        }),

        prisma.categories.count({
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
        data: categories,
    };
};

const getCategoryById = async (
    categoryId: string,
    query: getCategoryParams
) => {
    const {
        search,
        hasTutors,
        hasStudents,
        withNoStudent,
        withNoTutor,
    } = query;

    const { page, limit, skip, sortBy, sortOrder } =
        paginationSorting(query);

    // Filters applied to CHILD categories
    const childWhereCondition: any = {
        parentId: categoryId,

        ...(search && {
            name: {
                contains: search,
                mode: "insensitive",
            },
        }),

        ...(hasTutors === "true" && {
            tutors: {
                some: {},
            },
        }),

        ...(hasStudents === "true" && {
            students: {
                some: {},
            },
        }),

        ...(withNoStudent === "true" && {
            students: {
                none: {},
            },
        }),

        ...(withNoTutor === "true" && {
            tutors: {
                none: {},
            },
        }),
    };

    const existing = await prisma.categories.findUnique({
        where: {
            id: categoryId,
        },
        include: {
            parent: true,

            tutors: {
                include: {
                    tutor: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            },

            students: {
                include: {
                    student: true,
                },
            },

            _count: {
                select: {
                    tutors: true,
                    students: true,
                    children: true,
                },
            },
        },
    });

    if (!existing) {
        throw new AppError(404, "CategoryId not found!");
    }

    // Fetch paginated children
    const [children, totalChildren] = await Promise.all([
        prisma.categories.findMany({
            where: childWhereCondition,

            include: {
                tutors: true,
                students: true,

                _count: {
                    select: {
                        tutors: true,
                        students: true,
                    },
                },
            },

            skip,
            take: limit,

            orderBy: {
                [sortBy || "name"]: sortOrder || "asc",
            },
        }),

        prisma.categories.count({
            where: childWhereCondition,
        }),
    ]);

    return {
        meta: {
            page,
            limit,
            total: totalChildren,
            totalPages: Math.ceil(totalChildren / limit),
        },

        data: {
            ...existing,
            children,
        },
    };
};

const createCategory = async (
    payload: createCategoryPayload,
    userId: string
) => {
    try {
        // 1. Check if user is admin
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new AppError(404, "User not found");
        }

        if (user.role !== USER_ROLES.ADMIN) {
            throw new AppError(403, "Only admin can create categories");
        }

        if (!payload.name || typeof payload.name !== "string") {
            throw new AppError(400, "Category name is required");
        }

        // 2. Normalize name
        const name = payload.name.trim().toUpperCase();

        // 3. Validate parent category if provided
        if (payload.parentId) {
            const parent = await prisma.categories.findUnique({
                where: { id: payload.parentId },
            });

            if (!parent) {
                throw new AppError(404, "Parent category not found");
            }
        }

        // 4. Optional pre-check (for better UX error message)
        const existing = await prisma.categories.findFirst({
            where: {
                name,
                parentId: payload.parentId ?? null,
            },
        });

        if (existing) {
            throw new AppError(
                409,
                "Category already exists under this parent"
            );
        }

        // 5. Create category
        const category = await prisma.categories.create({
            data: {
                name,

                shortDesc: payload.shortDesc?.trim() || null,

                description: payload.description?.trim() || null,

                thumbnail: payload.thumbnail?.trim() || null,

                learningOutcomes:
                    payload.learningOutcomes?.filter(Boolean) ?? [],

                isFeatured:
                    payload.isFeatured ?? true,

                parentId: payload.parentId || null,
            },
        });

        return category;

    } catch (error: any) {
        // Prisma unique constraint fallback safety
        if (error.code === "P2002") {
            throw new Error("Category already exists");
        }

        throw error;
    }
};

const updateCategory = async (
    payload: updateCategoryPayload,
    userId: string,
    categoryId: string
) => {
    // 1. Check if user is admin
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    if (user.role !== USER_ROLES.ADMIN) {
        throw new AppError(403, "Only admin can update categories");
    }

    if (payload.parentId && payload.parentId === categoryId) {
        throw new AppError(400, "A category cannot be its own parent");
    }

    // 2. Normalize name
    let name: string | undefined;

    if (payload.name) {
        name = payload.name.trim().toUpperCase();

        const nameConflict =
            await prisma.categories.findFirst({
                where: {
                    name,
                    id: {
                        not: categoryId,
                    },
                },
            });

        if (nameConflict) {
            throw new AppError(
                409,
                "A category with this name already exists"
            );
        }
    }

    // 3. Validate parent category if provided
    if (payload.parentId !== null && payload.parentId !== undefined) {
        const parent = await prisma.categories.findUnique({
            where: { id: payload.parentId },
        });
        if (!parent) {
            throw new AppError(404, "Parent category not found");
        }
    }

    const existing = await prisma.categories.findFirst({
        where: { id: categoryId },
    });

    if (!existing) {
        throw new AppError(404, "Category not found");
    }

    // 4. Update category
    const category = await prisma.categories.update({
        where: {
            id: categoryId,
        },
        data: {
            ...(name && { name }),

            ...(payload.shortDesc !== undefined && {
                shortDesc: payload.shortDesc,
            }),

            ...(payload.description !== undefined && {
                description: payload.description,
            }),

            ...(payload.thumbnail !== undefined && {
                thumbnail: payload.thumbnail,
            }),

            ...(payload.learningOutcomes !== undefined && {
                learningOutcomes: payload.learningOutcomes,
            }),

            ...(payload.isFeatured !== undefined && {
                isFeatured: payload.isFeatured,
            }),

            ...(payload.parentId !== undefined && {
                parentId: payload.parentId,
            }),
        },
    });

    return category;
};

const deleteCategory = async (
    userId: string,
    categoryId: string
) => {
    //  Check if user is admin
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError(404, "User not found");
    }

    if (user.role !== USER_ROLES.ADMIN) {
        throw new AppError(403, "Only admin can delete categories");
    }

    const existing = await prisma.categories.findFirst({
        where: { id: categoryId },
    });

    if (!existing) {
        throw new AppError(404, "CategoryId not found!");
    }

    const category = await prisma.categories.delete({
        where: { id: categoryId },
    });

    return category;
};


export const CategoryService = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};