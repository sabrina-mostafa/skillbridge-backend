import { NextFunction, Request, Response } from "express";
import { reviewService } from "./review.service";
import { User } from "../../../generated/prisma/client";


const createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id as string;

        const { bookingId, rating, comment } = req.body;

        const review = await reviewService.createReview(userId, { bookingId, rating, comment });

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review,
        });
    } catch (error: any) {
        next(error);
    }
};

const updateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user?.id as string;

        const review = await reviewService.updateReview(reviewId as string, userId, req.body);

        res.status(201).json({
            success: true,
            message: "Review updated successfully",
            data: review,
        });
    } catch (error: any) {
        next(error);
    }
};

const getReviewByTutorId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tutorId } = req.params;
        const query = req.query;

        const result = await reviewService.getReviewByTutorId(tutorId as string, query);

        res.status(200).json({
            success: true,
            message: "Review fetched successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { reviewId } = req.params;
        const user = req.user;

        const result = await reviewService.deleteReview(reviewId as string, user as User);

        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

export const reviewController = {
    createReview,
    updateReview,
    getReviewByTutorId,
    deleteReview,
}