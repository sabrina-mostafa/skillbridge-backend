import { prisma } from "../../lib/prisma";
import { createGoogleClient } from "./google.client";

export const getAuthenticatedClient = async (userId: string) => {
  const googleAccount = await prisma.googleAccount.findUnique({
    where: { userId },
  });

  if (!googleAccount) {
    throw new Error("Google not connected");
  }

  const client = createGoogleClient();

  client.setCredentials({
    access_token: googleAccount.accessToken,
    refresh_token: googleAccount.refreshToken,
  });

  return client;
};