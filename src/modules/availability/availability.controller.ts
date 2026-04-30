import { NextFunction, Request, Response } from "express";
import { AvailabilityService } from "./availability.service";
import { USER_ROLES } from "../../constants/userRoles";
import { AppError } from "../../errors/AppError";


const getMyAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id as string;

        const result = await AvailabilityService.getMyAvailability(userId);

        res.status(200).json({
            success: true,
            message: "Availability fetched successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const getAllAvailabilities = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query;

        const result = await AvailabilityService.getAllAvailabilities(query);

        res.status(200).json({
            success: true,
            message: "Availability fetched successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const createAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;

        const result = await AvailabilityService.createAvailability(req.body, userId as string);

        res.status(201).json({
            success: true,
            message: "Availability created successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const updateAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { availabilityId } = req.params;

        if (!availabilityId) {
            throw new AppError(400, "availabilityId is required");
        }

        const result = await AvailabilityService.updateAvailability(userId as string, availabilityId as string, req.body);

        res.status(200).json({
            success: true,
            message: "Availability updated successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const deleteAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { availabilityId } = req.params;

        if (!availabilityId) {
            throw new AppError(400, "availabilityId is required");
        }

        const result = await AvailabilityService.deleteAvailability(availabilityId as string, userId as string);

        res.status(200).json({
            success: true,
            message: "Availability deleted successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};


export const AvailabilityController = {
    getMyAvailability,
    getAllAvailabilities,
    createAvailability,
    updateAvailability,
    deleteAvailability,
};