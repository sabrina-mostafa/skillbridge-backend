import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { MessageService } from "./message.service";


const getMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        const { conversationId } = req.params;

        if (!conversationId) {
            throw new AppError(400, "Conversation ID is required");
        }

        const result = await MessageService.getMessages(
            userId as string,
            conversationId as string
        );

        res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const sendMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        const { conversationId } = req.params;

        if (!conversationId) {
            throw new AppError(400, "Conversation ID is required");
        }

        const result = await MessageService.sendMessage(
            userId as string,
            conversationId as string,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const markMessageRead = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        const { messageId } = req.params;

        if (!messageId) {
            throw new AppError(400, "Message ID is required");
        }

        const result = await MessageService.markMessageRead(
            userId as string,
            messageId as string
        );

        res.status(200).json({
            success: true,
            message: "Message marked as read",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};


export const MessageController = {
    getMessages,
    sendMessage,
    markMessageRead,
};