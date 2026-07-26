import { prisma } from "../../lib/prisma";
import { createGoogleClient } from "./google.client";

export const getAuthenticatedClient = async (userId: string) => {
  const googleAccount = await prisma.account.findFirst({
    where: {
      userId,
      providerId: "google",
    },
  });

  console.log("ggl;", googleAccount?.scope);

  if (!googleAccount) {
    throw new Error("Google not connected");
  }

  const client = createGoogleClient();

  client.setCredentials({
    access_token: googleAccount.accessToken,
    refresh_token: googleAccount.refreshToken,
  });

  console.log({
  providerId: googleAccount.providerId,
  scope: googleAccount.scope,
});

  return client;
};