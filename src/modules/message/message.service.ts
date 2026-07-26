import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { emitToUser } from "../../socket/socketEmitter";


const getMessages = async (
    userId: string,
    conversationId: string
) => {
    const conversation = await prisma.conversation.findFirst({
        where: {
            id: conversationId,
            participants: {
                some: {
                    userId,
                },
            },
        },
    });

    if (!conversation) {
        throw new AppError(
            404,
            "Conversation not found or access denied"
        );
    }

    return prisma.message.findMany({
        where: {
            conversationId,
        },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};

const sendMessage = async (
    userId: string,
    conversationId: string,
    payload: {
        content: string;
    }
) => {
    if (!payload.content?.trim()) {
        throw new AppError(400, "Message content is required");
    }

    const { message, participantIds } = await prisma.$transaction(
        async (tx) => {
            // 1. Verify conversation membership
            const conversation = await tx.conversation.findFirst({
                where: {
                    id: conversationId,
                    participants: {
                        some: {
                            userId,
                        },
                    },
                },
            });

            if (!conversation) {
                throw new AppError(
                    404,
                    "Conversation not found or access denied"
                );
            }

            // 2. Create message
            const message = await tx.message.create({
                data: {
                    conversationId,
                    senderId: userId,
                    content: payload.content.trim(),
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                },
            });

            // 3. Update conversation timestamp
            await tx.conversation.update({
                where: {
                    id: conversationId,
                },
                data: {
                    lastMessageAt: message.createdAt,
                },
            });

            // 4. Get participant ids
            const participants =
                await tx.conversationParticipant.findMany({
                    where: {
                        conversationId,
                    },
                    select: {
                        userId: true,
                    },
                });

            return {
                message,
                participantIds: participants.map((p) => p.userId),
            };
        }
    );

    // Transaction has committed successfully.
    // Now it's safe to emit socket events.

    for (const participantId of participantIds) {
        // if (participantId === userId) continue;

        // Deliver the new message
        emitToUser(participantId, "message:new", message);

        const unreadCount = await prisma.message.count({
            where: {
                conversationId,
                senderId: {
                    not: participantId,
                },
                isRead: false,
            },
        });

        // Update conversation preview + unread badge
        emitToUser(participantId, "conversation:updated", {
            conversationId,
            lastMessage: message,
            unreadCount,
        });

        console.log("Emitting message:new to", participantId);
    }

    return message;
};

const markMessageRead = async (
    userId: string,
    messageId: string
) => {
    const { updatedMessage, participants } =
        await prisma.$transaction(async (tx) => {
            const message = await tx.message.findUnique({
                where: {
                    id: messageId,
                },
                include: {
                    conversation: {
                        include: {
                            participants: true,
                        },
                    },
                },
            });

            if (!message) {
                throw new AppError(404, "Message not found");
            }

            const isParticipant =
                message.conversation.participants.some(
                    (participant) => participant.userId === userId
                );

            if (!isParticipant) {
                throw new AppError(
                    403,
                    "You are not a participant in this conversation"
                );
            }

            if (message.senderId === userId) {
                throw new AppError(
                    400,
                    "You cannot mark your own message as read"
                );
            }

            // Already read
            if (message.isRead) {
                return {
                    updatedMessage: message,
                    participants:
                        message.conversation.participants.map(
                            (participant) => ({
                                userId: participant.userId,
                            })
                        ),
                };
            }

            const updatedMessage = await tx.message.update({
                where: {
                    id: messageId,
                },
                data: {
                    isRead: true,
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                },
            });

            const participants =
                await tx.conversationParticipant.findMany({
                    where: {
                        conversationId: updatedMessage.conversationId,
                    },
                    select: {
                        userId: true,
                    },
                });

            return {
                updatedMessage,
                participants,
            };
        });

    // Emit AFTER transaction commits
    participants.forEach((participant) => {
        if (participant.userId === userId) return;

        emitToUser(participant.userId, "message:read", {
            messageId: updatedMessage.id,
            conversationId: updatedMessage.conversationId,
            readBy: userId,
            readAt: new Date(),
        });

        emitToUser(participant.userId, "conversation:updated", {
            conversationId: updatedMessage.conversationId,
            unreadReset: true,
        });
    });

    return updatedMessage;
};


export const MessageService = {
    getMessages,
    sendMessage,
    markMessageRead,
};