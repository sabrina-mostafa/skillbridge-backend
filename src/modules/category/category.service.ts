import { USER_ROLES } from "../../constants/userRoles";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";



const getAllCategories = async (query: {
    search?: string;
    parentOnly?: string;
    hasTutors?: string;
    hasStudents?: string;
    withNoStudent?: string;
    withNoTutor?: string;
}) => {
    const { search, parentOnly, hasTutors, hasStudents, withNoStudent, withNoTutor } = query;

    return prisma.categories.findMany({
        where: {
            ...(search && {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            }),
            ...(parentOnly === "true" && {
                parentId: null,
            }),

            ...(hasTutors === "true" && {
                tutors: {
                    some: {}, // at least 1 tutor
                },
            }),
            ...(hasStudents === "true" && {
                students: {
                    some: {}, // at least 1 student
                },
            }),
            ...(withNoStudent === "true" && {
                students: { none: {} }
            }),
            ...(withNoTutor === "true" && {
                students: { none: {} }
            }),
        },
        include: {
            parent: true,
            _count: {
                select: {
                    tutors: true,
                    students: true,
                },
            },
        },
        orderBy: { name: "asc" },
    });
};

const createCategory = async (
    payload: { name: string; parentId?: string },
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
    payload: { name: string; parentId?: string },
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
    const name = payload.name.trim().toUpperCase();
    if (!name) {
        throw new AppError(400, "Category name is required");
    }

    const nameConflict = await prisma.categories.findFirst({
        where: {
            name,
            id: { not: categoryId }
        }
    });
    if (nameConflict) {
        throw new AppError(
            409,
            "A category with this name already exists"
        );
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
        where: { id: categoryId },
        data: {
            name,
            parentId: payload.parentId || null,
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
        throw new AppError(404,"User not found");
    }

    if (user.role !== USER_ROLES.ADMIN) {
        throw new AppError(403,"Only admin can delete categories");
    }

    const existing = await prisma.categories.findFirst({
        where: { id: categoryId },
    });

    if (!existing) {
        throw new AppError(404,"CategoryId not found!");
    }

    const category = await prisma.categories.delete({
        where: { id: categoryId },
    });

    return category;
};


export const CategoryService = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
};