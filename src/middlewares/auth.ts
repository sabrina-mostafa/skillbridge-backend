import { Request, Response, NextFunction } from 'express';
import { auth as betterAuth } from "../lib/auth";
import { UserRoles } from '../constants/userRoles';
import { UserStatus } from '../constants/userStatus';
import { Status } from '../../generated/prisma/enums';
import { AppError } from '../errors/AppError';

const auth = (...roles: UserRoles[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log("auth middleware!!!!");

        console.log("Req headers", req.headers);
        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers as any,
            });

            if (!session) {
                throw new AppError(401, "You are not authorized!");
            }

            if (!session.user.emailVerified) {
                throw new AppError(403, "Please verify your email to proceed!");
            }
            console.log(session);

            req.user = {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                emailVerified: session.user.emailVerified,
                role: session.user.role as UserRoles,
                status: session.user.status as UserStatus
            };

            if (roles.length && !roles.includes(req.user.role)) {
                throw new AppError(
                    403,
                    "You don't have permission to access this resource!"
                );
            }

            // STATUS CHECK
            if (req.user.status === Status.BLOCKED) {
                throw new AppError(
                    403,
                    "Your account is BLOCKED. Contact admin."
                );
            }
            next();

        } catch (err) {
            next(err);
        }
    }
}

export default auth;