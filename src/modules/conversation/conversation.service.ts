import { BookingStatus } from "../../../generated/prisma/enums";
import { USER_ROLES } from "../../constants/userRoles";
import { AppError } from "../../errors/AppError";
import paginationSorting from "../../helpers/paginationSorting.helper";
import { prisma } from "../../lib/prisma";
import { emitToUser } from "../../socket/socketEmitter";
import { CreateConversationPayload, GetConversationQuery } from "./conversation.types";



const getMyConversations = async (
    userId: string,
    query: GetConversationQuery
) => {
    const { page, limit, skip } = paginationSorting(query);
    const search = query.searchTerm?.trim();

    const whereCondition: any = search
        ? {
            AND: [
                {
                    participants: {
                        some: {
                            userId,
                        },
                    },
                },
                {
                    participants: {
                        some: {
                            user: {
                                name: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        },
                    },
                },
            ],
        }
        : {
            participants: {
                some: {
                    userId,
                },
            },
        };

    const [conversations, total] = await Promise.all([
        prisma.conversation.findMany({
            where: whereCondition,
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                email: true,
                            },
                        },
                    },
                },
                messages: {
                    take: 1,
                    orderBy: {
                        createdAt: "desc",
                    },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        messages: {
                            where: {
                                senderId: {
                                    not: userId,
                                },
                                isRead: false,
                            },
                        },
                    },
                },
            },
            orderBy: {
                lastMessageAt: "desc",
            },
            take: limit,
            skip,
        }),

        prisma.conversation.count({
            where: whereCondition,
        }),
    ]);

    const formattedConversations = conversations.map(
        ({ _count, ...conversation }) => ({
            ...conversation,
            unreadCount: _count.messages,
        })
    );

    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        data: formattedConversations,
    };
};

const getContacts = async (userId: string) => {
    const currentUser = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            role: true,
        },
    });

    if (!currentUser) {
        throw new AppError(404, "User not found");
    }

    if (currentUser.role === USER_ROLES.ADMIN) {
        throw new AppError(
            403,
            "Only tutors and students can access contacts."
        );
    }

    const contactsMap = new Map<
        string,
        {
            id: string;
            name: string;
            email: string;
            image: string | null;
            conversationId: string | null;
        }
    >();

    // Fetch all conversations for this user ONCE
    const conversations = await prisma.conversation.findMany({
        where: {
            participants: {
                some: {
                    userId,
                },
            },
        },
        select: {
            id: true,
            participants: {
                select: {
                    userId: true,
                },
            },
        },
    });

    // =====================================================
    // Tutor → Students
    // =====================================================
    if (currentUser.role === USER_ROLES.TUTOR) {
        const bookings = await prisma.booking.findMany({
            where: {
                tutor: {
                    userId,
                },
                status: {
                    notIn: [
                        BookingStatus.CANCELLED,
                        BookingStatus.DECLINED,
                    ],
                },
            },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                            },
                        },
                    },
                },
            },
        });

        for (const booking of bookings) {
            const user = booking.student.user;

            if (contactsMap.has(user.id)) {
                continue;
            }

            const conversation = conversations.find(
                (conversation) =>
                    conversation.participants.some(
                        (participant) =>
                            participant.userId === user.id
                    )
            );

            contactsMap.set(user.id, {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                conversationId: conversation?.id ?? null,
            });
        }
    }

    // =====================================================
    // Student → Tutors
    // =====================================================
    if (currentUser.role === USER_ROLES.STUDENT) {
        const bookings = await prisma.booking.findMany({
            where: {
                student: {
                    userId,
                },
                status: {
                    notIn: [
                        BookingStatus.CANCELLED,
                        BookingStatus.DECLINED,
                    ],
                },
            },
            include: {
                tutor: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                            },
                        },
                    },
                },
            },
        });

        for (const booking of bookings) {
            const user = booking.tutor.user;

            if (contactsMap.has(user.id)) {
                continue;
            }

            const conversation = conversations.find(
                (conversation) =>
                    conversation.participants.some(
                        (participant) =>
                            participant.userId === user.id
                    )
            );

            contactsMap.set(user.id, {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                conversationId: conversation?.id ?? null,
            });
        }
    }

    return [...contactsMap.values()].sort((a, b) =>
        a.name.localeCompare(b.name)
    );
};

const getConversationById = async (
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
        include: {
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            email: true,
                        },
                    },
                },
            },
            messages: {
                orderBy: {
                    createdAt: "asc",
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    messages: {
                        where: {
                            senderId: {
                                not: userId,
                            },
                            isRead: false,
                        },
                    },
                },
            },
        },
    });

    if (!conversation) {
        throw new AppError(
            404,
            "Conversation not found"
        );
    }

    const { _count, ...rest } = conversation;

    return {
        ...rest,
        unreadCount: _count.messages,
    };
};

const createConversation = async (
    userId: string,
    payload: CreateConversationPayload
) => {
    if (userId === payload.participantId) {
        throw new AppError(400, "You cannot message yourself");
    }

    // Get both users
    const [currentUser, participant] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                role: true,
            },
        }),
        prisma.user.findUnique({
            where: { id: payload.participantId },
            select: {
                id: true,
                role: true,
            },
        }),
    ]);

    if (!currentUser) {
        throw new AppError(404, "User not found");
    }

    if (!participant) {
        throw new AppError(404, "Participant not found");
    }

    // Only tutor <-> student conversations
    if (currentUser.role === participant.role) {
        throw new AppError(
            403,
            "Conversations are only allowed between a tutor and a student."
        );
    }

    // Ensure they have at least one valid booking
    const booking = await prisma.booking.findFirst({
        where:
            currentUser.role === USER_ROLES.STUDENT
                ? {
                    student: {
                        userId,
                    },
                    tutor: {
                        userId: payload.participantId,
                    },
                    status: {
                        notIn: [
                            BookingStatus.CANCELLED,
                            BookingStatus.DECLINED,
                        ],
                    },
                }
                : {
                    tutor: {
                        userId,
                    },
                    student: {
                        userId: payload.participantId,
                    },
                    status: {
                        notIn: [
                            BookingStatus.CANCELLED,
                            BookingStatus.DECLINED,
                        ],
                    },
                },
        select: {
            id: true,
        },
    });

    if (!booking) {
        throw new AppError(
            403,
            "You can only message users you have booked sessions with."
        );
    }

    // Existing conversation
    const conversations = await prisma.conversation.findMany({
        where: {
            AND: [
                {
                    participants: {
                        some: {
                            userId,
                        },
                    },
                },
                {
                    participants: {
                        some: {
                            userId: payload.participantId,
                        },
                    },
                },
            ],
        },
        include: {
            participants: {
                include: {
                    user: true,
                },
            },
        },
    });

    const existing =
        await prisma.conversation.findFirst({
            where: {
                AND: [
                    {
                        participants: {
                            some: {
                                userId,
                            },
                        },
                    },
                    {
                        participants: {
                            some: {
                                userId: payload.participantId,
                            },
                        },
                    },
                ],
            },
            include: {
                participants: {
                    include: {
                        user: true,
                    },
                },
            },
        });

    if (
        existing &&
        existing.participants.length === 2
    ) {
        return existing;
    }

    return prisma.conversation.create({
        data: {
            participants: {
                create: [
                    { userId },
                    { userId: payload.participantId },
                ],
            },
        },
        include: {
            participants: {
                include: {
                    user: true,
                },
            },
        },
    });
};

const markConversationRead = async (
    userId: string,
    conversationId: string
) => {
    return prisma.$transaction(async (tx) => {

        const conversation =
            await tx.conversation.findFirst({
                where: {
                    id: conversationId,
                    participants: {
                        some: {
                            userId,
                        },
                    },
                },
                include: {
                    participants: {
                        select: {
                            userId: true,
                        },
                    },
                },
            });

        if (!conversation) {
            throw new AppError(404, "Conversation not found");
        }

        const { count } =
            await tx.message.updateMany({
                where: {
                    conversationId,
                    senderId: {
                        not: userId,
                    },
                    isRead: false,
                },
                data: {
                    isRead: true,
                },
            });

        return {
            participants: conversation.participants,
            count,
        };
    }).then((result) => {

        // Notify the current user that their unread badge is now zero.
        emitToUser(userId, "conversation:updated", {
            conversationId,
            unreadCount: 0,
        });


        // Notify the other participant that their messages were read.
        result.participants.forEach((participant) => {
            if (participant.userId !== userId) {
                emitToUser(
                    participant.userId,
                    "conversation:read",
                    {
                        conversationId,
                        readBy: userId,
                    }
                );
            }
        });

        return {
            success: true,
            message: "Conversation marked as read",
            markedAsRead: result.count,
        };
    });
};

export const ConversationService = {
    getMyConversations,
    getContacts,
    getConversationById,
    createConversation,
    markConversationRead,
};