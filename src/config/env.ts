import dotenv from "dotenv";
import { z } from "zod";

// Load .env into process.env
dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),

  PORT: z.string().default("5000"),

  BETTER_AUTH_SECRET: z.string().min(10),
  BETTER_AUTH_URL: z.string().url(),

  APP_EMAIL: z.string().email(),
  APP_PASS: z.string().min(1),

  APP_URL: z.string().url(),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.string().url(),

  ADMIN1_USER_EMAIL: z.string().email(),
  ADMIN1_USER_PASSWORD: z.string().min(6),
});

export const env = envSchema.parse(process.env);