import { Server, Socket } from "socket.io";


export const SOCKET_EVENTS = {
    CONNECTION: "connection",
    DISCONNECT: "disconnect",

    MESSAGE_NEW: "message:new",
    MESSAGE_READ: "message:read",

    CONVERSATION_UPDATED: "conversation:updated",

    TYPING_START: "typing:start",
    TYPING_STOP: "typing:stop",

    CONVERSATION_JOIN: "conversation:join",
    CONVERSATION_LEAVE: "conversation:leave",

    USER_ONLINE: "user:online",
    USER_OFFLINE: "user:offline",

    PRESENCE_INIT: "presence:init",
} as const;


export const registerSocketEvents = (
    io: Server,
    socket: Socket
) => {

    console.log("Connected:", socket.data.user.id);

    /**
     * Join conversation room
     */
    socket.on(
        SOCKET_EVENTS.CONVERSATION_JOIN,
        (conversationId: string) => {

            socket.join(conversationId);

            console.log(
                `${socket.data.user.id} joined ${conversationId}`
            );
        }
    );

    /**
     * Leave conversation room
     */
    socket.on(
        SOCKET_EVENTS.CONVERSATION_LEAVE,
        (conversationId: string) => {

            socket.leave(conversationId);

            console.log(
                `${socket.data.user.id} left ${conversationId}`
            );
        }
    );

    /**
     * User started typing
     */
    socket.on(
        SOCKET_EVENTS.TYPING_START,
        (conversationId: string) => {

            socket.to(conversationId).emit(
                SOCKET_EVENTS.TYPING_START,
                {
                    conversationId,
                    userId: socket.data.user.id,
                }
            );
        }
    );

    /**
     * User stopped typing
     */
    socket.on(
        SOCKET_EVENTS.TYPING_STOP,
        (conversationId: string) => {

            socket.to(conversationId).emit(
                SOCKET_EVENTS.TYPING_STOP,
                {
                    conversationId,
                    userId: socket.data.user.id,
                }
            );
        }
    );

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
        console.log(
            `${socket.data.user.id} disconnected`
        );
    });
};