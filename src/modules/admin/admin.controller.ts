import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";


const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = req.user?.id;

        const result = await AdminService.getAllUsers(adminId as string, req.query);

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const getPlatformAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await AdminService.getPlatformAnalytics();

        res.status(200).json({
            success: true,
            message: "Platform analytics fetched successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = req.user?.id;
        const { userId } = req.params;
        const { status } = req.body;

        const result = await AdminService.updateUserStatus(
            adminId as string,
            userId as string,
            status
        );

        res.status(200).json({
            success: true,
            message: "User status updated successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};


export const AdminController = {
    getAllUsers,
    getPlatformAnalytics,
    updateUserStatus,
};