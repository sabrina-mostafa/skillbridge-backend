import { UserRoles } from "../constants/userRoles";
import { UserStatus } from "../constants/userStatus";

declare module "socket.io" {
    interface Socket {
        data: {
            user: {
                id: string;
                name: string;
                email: string;
                image: string;
                emailVerified: boolean;
                role: UserRoles;
                status: UserStatus;
                profileCompleted: boolean;
            };
        };
    }
}