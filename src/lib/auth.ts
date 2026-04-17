import { betterAuth, User } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASS,
    },
});

const emailVerificationTemplate = (user: User, verificationUrl: string) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      }
      .header {
        background: #4f46e5;
        color: #ffffff;
        padding: 20px;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
      }
      .content {
        padding: 30px;
        color: #333333;
        line-height: 1.6;
        font-size: 15px;
      }
      .button {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 20px;
        background: #4f46e5;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #888888;
        background: #f9fafb;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        SkillBridge
      </div>
      <div class="content">
        <p>Hello ${user.name || "there"},</p>

        <p>Thank you for signing up for <strong>SkillBridge</strong>. To get started, please verify your email address by clicking the button below:</p>

        <p style="text-align: center;">
          <a href="${verificationUrl}" class="button">Verify Email</a>
        </p>

        <p>If the button doesn't work, you can also copy and paste the link below into your browser:</p>

        <p style="word-break: break-all;">
          ${verificationUrl}
        </p>

        <p>If you did not create an account, you can safely ignore this email.</p>

        <p>Best regards,<br/>SkillBridge Team</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} SkillBridge. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "STUDENT",
            },
            status: {
                type: "string",
                required: false,
                defaultValue: "ACTIVE",
            },
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true, //sends email only when user registers/signup
        sendVerificationEmail: async ({ user, url, token, }, request) => {
            try {
                console.log("******************* email sent")
                console.log({ user, url, token });

                const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}`

                const info = await transporter.sendMail({
                    from: '"Skill Bridge Team" <skillbridge@sk.com>', // sender address
                    to: user.email, // list of recipients
                    subject: "Please verify your email!", // subject line
                    html: emailVerificationTemplate(user, verificationUrl), // HTML body
                });

                console.log("Message sent: %s", info.messageId);
                // Preview URL is only available when using an Ethereal test account
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            } catch (err) {
                console.error("Error while sending mail:", err);
                throw err;
            }
        },
    },
});