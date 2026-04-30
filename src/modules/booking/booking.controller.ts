import { Request, Response, NextFunction } from "express";
import { BookingService } from "./booking.service";
import { UserRoles } from "../../constants/userRoles";
import { AppError } from "../../errors/AppError";


const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;

        const result = await BookingService.createBooking(userId as string, req.body);

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userRole = req.user?.role;
        const query = req.query;
        const result = await BookingService.getAllBookings(userRole as UserRoles, query);

        res.status(200).json({
            success: true,
            message: "Booking fetched successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const query = req.query;

        const result = await BookingService.getMyBookings(userId as string, query);

        res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const getBookingByBookingId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await BookingService.getBookingByBookingId(req.params?.bookingId as string);

        res.status(200).json({
            success: true,
            message: "Booking fetched successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const bookingId = req.params?.bookingId;
        const status = req.body.status;

        if (!bookingId) {
            throw new AppError(400, "Booking ID is required");
        }
        if (!status) {
            throw new AppError(400, "Status is required");
        }

        const result = await BookingService.updateBookingStatus(
            userId as string,
            bookingId as string,
            status
        );

        res.status(200).json({
            success: true,
            message: "Booking status updated successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};



export const BookingController = {
    createBooking,
    getAllBookings,
    getMyBookings,
    getBookingByBookingId,
    updateBookingStatus,
};