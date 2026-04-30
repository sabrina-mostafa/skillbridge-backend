import { env } from "../config/env";
import { USER_ROLES } from "../constants/userRoles";
import { prisma } from "../lib/prisma";


// we are using fetch API to make an API call to create the admin user
// we are doing this because better-auth does not allow us to create only users directly using prisma client

// if we try to create a user directly using prisma client, then we will also have to create Account, Session, VerificationToken entries and other related data(of User) manually
// so, to avoid that, we are making an API call to the sign-up endpoint to create only the admin user without creating Account, Session, VerificationToken entries manually


export async function seedAdmin() {
    try {
        console.log("Seeding admin user...");

        const AUTH_URL = env.BETTER_AUTH_URL;
        if (!AUTH_URL) {
            throw new Error("BETTER_AUTH_URL is not defined in env");
        }

        const adminEmail = env.ADMIN1_USER_EMAIL;
        const adminPassword = env.ADMIN1_USER_PASSWORD;

        if (!adminEmail || !adminPassword) {
            throw new Error("Admin email or password missing in env");
        }

        // 1. Check if admin already exists
        const existingAdmin = await prisma.user.findUnique({
            where: {
                email: adminEmail
            }
        })
        if (existingAdmin) {
            console.log("Admin user already exists. Skipping seeding.");
            return;
        }

        const adminData1 = {
            name: "Admin User1",
            email: adminEmail,
            role: USER_ROLES.ADMIN,
            password: adminPassword,

            // here we can not set emailVerified to true directly because better-auth handles email verification internally
            // so, after creating the user via API call, we will UPDATE the emailVerified field to true
        }

        // 2. API call to create admin user  ; it must be run when the server is running
        const response = await fetch(`${AUTH_URL}/api/auth/sign-up/email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": env.APP_URL!
            },
            body: JSON.stringify(adminData1)
        });

        // if the admin user is not created successfully
        if (!response.ok) {
            throw new Error("Failed to create admin via auth API");
        }

        console.log("Admin created successfully via API");
        const data = await response.json();
        console.log("Admin created:", data);

        // 3. We have to verify the email manually here so that the admin CAN LOGIN DIRECTLY without verifying email
        await prisma.user.update({
            where: {
                email: adminData1.email
            },
            data: {
                emailVerified: true
            }
        });
        console.log("Admin email verified");
        console.log("Admin seeding completed successfully");

    } catch (err) {
        console.error("Error seeding admin user:", err);
    }
}


// seedAdmin();