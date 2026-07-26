import { NextFunction, Request, Response } from "express";
import { ConversationService } from "./conversation.service";
import { AppError } from "../../errors/AppError";


const getMyConversations = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        const query = req.query;

        const result = await ConversationService.getMyConversations(
            userId as string,
            query
        );

        res.status(200).json({
            success: true,
            message: "Conversations fetched successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getContacts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        const result = await ConversationService.getContacts(
            userId as string
        );

        res.status(200).json({
            success: true,
            message: "Contacts retrieved successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getConversationById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { conversationId } = req.params;

        if (!conversationId) {
            throw new AppError(400, "Conversation ID is required");
        }
        const userId = req.user?.id;

        const result = await ConversationService.getConversationById(
            userId as string,
            conversationId as string
        );

        res.status(200).json({
            success: true,
            message: "Conversation fetched successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const createConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        const result = await ConversationService.createConversation(
            userId as string,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Conversation created successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const markConversationRead = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { conversationId } = req.params;

        if (!conversationId) {
            throw new AppError(400, "Conversation ID is required");
        }
        const userId = req.user?.id;

        const result = await ConversationService.markConversationRead(
            userId as string,
            conversationId as string
        );

        res.status(200).json({
            success: true,
            message: "Conversation marked as read",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const ConversationController = {
    getMyConversations,
    getContacts,
    getConversationById,
    createConversation,
    markConversationRead,
};