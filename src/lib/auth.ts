import { betterAuth, User } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
import { env } from "../config/env";


const APP_URL = env.APP_URL;

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: env.APP_EMAIL,
    pass: env.APP_PASS,
  },
});

const emailVerificationTemplate = (user: User, verificationUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f5f7fb;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    }

    .wrapper {
      width: 100%;
      padding: 40px 0;
      background-color: #f5f7fb;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }

    .header {
      padding: 28px 30px;
      background: linear-gradient(135deg, #4f46e5, #6366f1);
      color: #ffffff;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 20px;
      letter-spacing: 0.5px;
    }

    .content {
      padding: 36px 32px;
      color: #111827;
      line-height: 1.7;
      font-size: 15px;
    }

    .title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .button-wrapper {
      text-align: center;
      margin: 32px 0;
    }

    .button {
      display: inline-block;
      padding: 14px 22px;
      background: #4f46e5;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
    }

    .button:hover {
      background: #4338ca;
    }

    .link-box {
      background: #f3f4f6;
      padding: 12px;
      border-radius: 8px;
      font-size: 13px;
      word-break: break-all;
      color: #374151;
    }

    .footer {
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      background: #fafafa;
    }

    .muted {
      color: #6b7280;
      font-size: 13px;
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="container">

      <div class="header">
        <h1>SkillBridge</h1>
      </div>

      <div class="content">

        <div class="title">
          Verify your email address
        </div>

        <p>Hi ${user.name || "there"},</p>

        <p>
          Thanks for joining <strong>SkillBridge</strong>.
          To complete your registration and activate your account,
          please verify your email address.
        </p>

        <div class="button-wrapper">
          <a href="${verificationUrl}" class="button">
            Verify Email
          </a>
        </div>

        <p class="muted">
          If the button doesn’t work, copy and paste this link into your browser:
        </p>

        <div class="link-box">
          ${verificationUrl}
        </div>

        <p style="margin-top: 24px;">
          If you didn’t create an account, you can safely ignore this email.
        </p>

        <p style="margin-top: 24px;">
          — Team SkillBridge
        </p>

      </div>

      <div class="footer">
        © ${new Date().getFullYear()} SkillBridge. All rights reserved.
      </div>

    </div>
  </div>
</body>
</html>
`;

const resetPasswordTemplate = (user: User, resetUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset your password</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f5f7fb;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    }

    .wrapper {
      width: 100%;
      padding: 40px 0;
      background-color: #f5f7fb;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }

    .header {
      padding: 28px 30px;
      background: linear-gradient(135deg, #4f46e5, #6366f1);
      color: #ffffff;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 20px;
      letter-spacing: 0.5px;
    }

    .content {
      padding: 36px 32px;
      color: #111827;
      line-height: 1.7;
      font-size: 15px;
    }

    .title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .button-wrapper {
      text-align: center;
      margin: 32px 0;
    }

    .button {
      display: inline-block;
      padding: 14px 22px;
      background: #4f46e5;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
    }

    .button:hover {
      background: #4338ca;
    }

    .link-box {
      background: #f3f4f6;
      padding: 12px;
      border-radius: 8px;
      font-size: 13px;
      word-break: break-all;
      color: #374151;
    }

    .footer {
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      background: #fafafa;
    }

    .muted {
      color: #6b7280;
      font-size: 13px;
    }

    .warning {
      margin-top: 24px;
      padding: 14px;
      border-radius: 8px;
      background: #fef3c7;
      color: #92400e;
      font-size: 13px;
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="container">

      <div class="header">
        <h1>SkillBridge</h1>
      </div>

      <div class="content">

        <div class="title">
          Reset your password
        </div>

        <p>Hi ${user.name || "there"},</p>

        <p>
          We received a request to reset the password for your
          <strong>SkillBridge</strong> account.
        </p>

        <p>
          Click the button below to create a new password.
        </p>

        <div class="button-wrapper">
          <a href="${resetUrl}" class="button">
            Reset Password
          </a>
        </div>

        <p class="muted">
          If the button doesn’t work, copy and paste this link into your browser:
        </p>

        <div class="link-box">
          ${resetUrl}
        </div>

        <div class="warning">
          For security reasons, this link will expire after a limited time.
          If you didn't request a password reset, you can safely ignore this email.
          Your password will remain unchanged.
        </div>

        <p style="margin-top: 24px;">
          Stay secure,<br />
          Team SkillBridge
        </p>

      </div>

      <div class="footer">
        © ${new Date().getFullYear()} SkillBridge. All rights reserved.
      </div>

    </div>
  </div>
</body>
</html>
`;


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [APP_URL!],

  session: {
    expiresIn: 60 * 60 * 24 * 30, // user stay logged in for 30 days
    updateAge: 60 * 60 * 24,      // refresh every day
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE",
      },
      profileCompleted: {
        type: "boolean",
        required: false,
        defaultValue: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {

      const resetUrl = new URL(url);
      resetUrl.searchParams.set("callbackURL", `${APP_URL}/reset-password`);

      await transporter.sendMail({
        from: '"SkillBridge Team" <skillbridge@sk.com>',
        to: user.email,
        subject: "Reset your SkillBridge password",
        html: resetPasswordTemplate(user, resetUrl.toString()),
      });
    },

  },
  emailVerification: {
    sendOnSignUp: true, //sends email only when user registers/signup
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token, }, request) => {
      try {
        // console.log("******************* email sent")
        // console.log({ user, url, token });

        // const verificationUrl = `${env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}`
        // console.log("verificationUrl", verificationUrl);

        const verificationUrl = new URL(url);
        verificationUrl.searchParams.set(
          "callbackURL",
          `${APP_URL}/onboarding`
          // `${APP_URL}/verify-email`
        );

        const info = await transporter.sendMail({
          from: '"Skill Bridge Team" <skillbridge@sk.com>', // sender address
          to: user.email, // list of recipients
          subject: "Please verify your email!", // subject line
          html: emailVerificationTemplate(user, verificationUrl.toString()), // HTML body
        });

        // console.log("Message sent: %s", info.messageId);
        // Preview URL is only available when using an Ethereal test account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      } catch (err) {
        // console.error("Error while sending mail:", err);
        throw err;
      }
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,

      accessType: "offline",   //  for refresh token
      prompt: "select_account consent",  // show the select google account prompt 

      scope: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/calendar",
      ],
    },
  },
  account: {
    accountLinking: {
      disableImplicitLinking: true,
    }
  },
});
