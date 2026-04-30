import { NextFunction, Request, Response } from "express";
import { CategoryService } from "./category.service";



const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query;
        const categories = await CategoryService.getAllCategories(query);

        return res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error: any) {
        next(error);
    }
}

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;

        const { name, parentId } = req.body;

        // Call service layer
        const category = await CategoryService.createCategory({ name, parentId }, userId as string);

        // Success response
        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });

    } catch (error: any) {
        next(error);
    }
};

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const categoryId = req.params?.categoryId;

        const { name, parentId } = req.body;

        // Call service layer
        const category = await CategoryService.updateCategory({ name, parentId }, userId as string, categoryId as string);

        // Success response
        return res.status(201).json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });

    } catch (error: any) {
        next(error);
    }
};

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const categoryId = req.params?.categoryId;

        // Call service layer
        const category = await CategoryService.deleteCategory(userId as string, categoryId as string);

        // Success response
        return res.status(201).json({
            success: true,
            message: "Category deleted successfully",
            data: category,
        });

    } catch (error: any) {
        next(error);
    }
};


export const CategoryController = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
}