import { Request, Response, NextFunction } from 'express';
import { auth as betterAuth } from "../lib/auth";
import { UserRoles } from '../constants/userRoles';
import { UserStatus } from '../constants/userStatus';
import { Status } from '../../generated/prisma/enums';

const auth = (...roles: UserRoles[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log("auth middleware!!!!");

        console.log("Req headers", req.headers);
        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers as any,
            });

            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized!"
                });
            }

            if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Please verify your email to proceed!"
                });
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
                return res.status(403).json({
                    success: false,
                    message: "You don't have permission to access this resource!"
                });
            }

            // STATUS CHECK
            if (req.user.status === Status.BLOCKED) {
                return res.status(403).json({
                    message: "Your account is BLOCKED. Contact admin.",
                });
            }
            next();

        } catch (err) {
            next(err);
        }
    }
}

export default auth;