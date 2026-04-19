import { User } from "better-auth/types";
import { UserRoles } from "../../constants/userRoles";
import { UserStatus } from "../../constants/userStatus";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                emailVerified: boolean;
                role: UserRoles;
                status: UserStatus;
            };
        }
    }
}