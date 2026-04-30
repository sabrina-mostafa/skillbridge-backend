import { google } from "googleapis";
import type { OAuth2Client } from "google-auth-library";
import { env } from "../../config/env";

export const createGoogleClient = (): OAuth2Client => {
    return new google.auth.OAuth2(
        env.GOOGLE_CLIENT_ID!,
        env.GOOGLE_CLIENT_SECRET!,
        env.GOOGLE_REDIRECT_URI!
    );
};