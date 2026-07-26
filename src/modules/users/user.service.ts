import { USER_ROLES } from './../../constants/userRoles';
import { UserRoles } from "../../constants/userRoles";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { auth } from '../../lib/auth';
import { env } from '../../config/env';



const APP_URL = env.APP_URL;


const updateUserRole = async (
    userId: string,
    payload: { role: UserRoles },
) => {

    if (payload.role === USER_ROLES.ADMIN) {
        throw new AppError(404, "Role can't be Admin, Admins are feed");
    }

    const existing = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!existing) {
        throw new AppError(404, "User not found");
    }

    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            role: payload.role
        }
    });

    return user;
};

const updateProfileImage = async (
    userId: string,
    payload: { image: string },
) => {

    if (!payload.image) {
        throw new AppError(404, "Image not found");
    }

    const existing = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!existing) {
        throw new AppError(404, "User not found");
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            image: payload.image
        }
    });

    return updatedUser;
};

const resendVerificationEmail = async (email: string ) => {

    if (!email) {
        throw new AppError(404, "Email is required");
    }

    const existing = await prisma.user.findUnique({
        where: { email },
    });
    if (!existing) {
        throw new AppError(404, "User not found");
    }
    if (existing.emailVerified) {
        throw new AppError(400, "Email is already verified");
    }

    await auth.api.sendVerificationEmail({
        body: {
            email,
            callbackURL: `${APP_URL}/onboarding`,
        },
    });

    return {
        message: "Verification email sent successfully",
    };
};



export const UserService = {
    updateUserRole,
    updateProfileImage,
    resendVerificationEmail,

}