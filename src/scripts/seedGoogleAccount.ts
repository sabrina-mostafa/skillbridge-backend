import { Status } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";


export async function seedGoogleAccount() {
    // 1. find admin or tutor user
    const user = await prisma.user.findFirst({
        where: {
            role: "TUTOR", // or ADMIN depending on your test
            status: Status.ACTIVE
        }
    });

    if (!user) {
        console.log("No user found for Google seed");
        return;
    }

    console.log("UserName:", user.name)
    console.log("UsrId:", user?.id)

    // 2. create or update google account
    await prisma.googleAccount.upsert({
        where: {
            userId: user.id,
        },
        update: {
            accessToken: "fake-access-token",
            refreshToken: "fake-refresh-token",
            expiryDate: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
        create: {
            userId: user.id,
            accessToken: "fake-access-token",
            refreshToken: "fake-refresh-token",
            expiryDate: new Date(Date.now() + 60 * 60 * 1000),
        },
    });

    console.log("GoogleAccount seeded for user:", user.id);
}


// seedGoogleAccount();