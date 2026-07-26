import { createServer, Server as HttpServer } from "http";
import { Server } from "socket.io";

import { env } from "../config/env";
import { socketAuth } from "./middleware/socketAuth";
import { registerSocketEvents, SOCKET_EVENTS } from "./socket.events";
import { Presence } from "./presence";


const FRONTEND_URL = env.APP_URL;

let io: Server;

export const initializeSocket = (
    httpServer: HttpServer
) => {
    io = new Server(httpServer, {
        cors: {
            origin: FRONTEND_URL,
            credentials: true,
        },
    });

    io.use(socketAuth);

    io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
        console.log(`🟢 Socket connected: ${socket.id}`);
        console.log({
            socket: socket.id,
            user: socket.data.user,
        });

        const userId = socket.data.user.id;
        Presence.add(userId, socket.id);

        // Join personal room
        socket.join(userId);

        // online indicator
        socket.emit(
            SOCKET_EVENTS.PRESENCE_INIT,
            Presence.getOnlineUsers()
        );

        console.log(
            `${userId} joined personal room`
        );

        socket.broadcast.emit(
            SOCKET_EVENTS.USER_ONLINE, {
            userId,
        });

        registerSocketEvents(io, socket);

        socket.on(SOCKET_EVENTS.DISCONNECT, () => {

            const userId = socket.data.user.id;

            Presence.remove(userId, socket.id);

            if (!Presence.isOnline(userId)) {
                socket.broadcast.emit(
                    SOCKET_EVENTS.USER_OFFLINE,
                    {
                        userId,
                    }
                );
            }
            console.log(`🔴 ${userId} disconnected`);
            console.log(`🔴 Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};


export const getIO = () => {
    if (!io) {
        throw new Error(
            "Socket.IO has not been initialized."
        );
    }

    return io;
};

export { createServer };