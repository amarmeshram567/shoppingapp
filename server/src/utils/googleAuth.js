import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";

const client = new OAuth2Client(env.googleClientId || undefined);

export const verifyGoogleIdToken = async (credential) => {
  if (!env.googleClientId) {
    throw new Error("GOOGLE_CLIENT_ID is not configured");
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: env.googleClientId
  });

  return ticket.getPayload();
};
