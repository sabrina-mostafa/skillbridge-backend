import { ExtendedError, Socket } from "socket.io";

import { auth, auth as betterAuth } from "../../lib/auth";
import { Status } from "../../../generated/prisma/enums";

import { UserRoles } from "../../constants/userRoles";
import { UserStatus } from "../../constants/userStatus";
import { AppError } from "../../errors/AppError";


export const socketAuth = async (
    socket: Socket,
    next: (err?: ExtendedError) => void
) => {
    try {
        const session = await auth.api.getSession({
            headers: socket.handshake.headers as any,
        });
        console.log(socket.handshake.headers);

        if (!session) {
            return next(new AppError(401, "Unauthorized"));
        }

        if (!session.user.emailVerified) {
            return next(
                new AppError(
                    403,
                    "Please verify your email."
                )
            );
        }

        if (session.user.status === Status.BLOCKED) {
            return next(
                new AppError(
                    403,
                    "Account blocked."
                )
            );
        }

        socket.data.user = {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image as string,
            emailVerified: session.user.emailVerified,
            role: session.user.role as UserRoles,
            status: session.user.status as UserStatus,
            profileCompleted:
                session.user.profileCompleted as boolean,
        };

        next();
    } catch (error) {
        next(new AppError(401, "Unauthorized"));
    }
};