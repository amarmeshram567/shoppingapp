import { User } from "../models/User.js";
import { clerkClient, getAuth } from "@clerk/express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { generateToken, setAuthCookie } from "../utils/generateToken.js";
import { verifyGoogleIdToken } from "../utils/googleAuth.js";
import { normalizeEmail, requireFields } from "../utils/validators.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { env } from "../config/env.js";

const issueAuthResponse = async (res, user, statusCode, message) => {
  user.lastLoginAt = new Date();
  await user.save();

  const token = generateToken(user._id.toString());
  setAuthCookie(res, token);

  res.status(statusCode).json({
    message,
    token,
    user: sanitizeUser(user)
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  requireFields(req.body, ["email", "password"]);

  const firstName = req.body.firstName?.trim() || "";
  const lastName = req.body.lastName?.trim() || "";
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;

  if (password.length < 6) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error("Password must be at least 6 characters");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(HTTP_STATUS.CONFLICT);
    throw new Error("User already exists");
  }

  const user = await User.create({
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    email,
    password,
    provider: "local"
  });

  await issueAuthResponse(res, user, HTTP_STATUS.CREATED, "Account created");
});

export const loginUser = asyncHandler(async (req, res) => {
  requireFields(req.body, ["email", "password"]);

  const email = normalizeEmail(req.body.email);
  const password = req.body.password;


  const user = await User.findOne({ email });

  console.log(user)

  if (!user || !(await user.matchPassword(password))) {
    res.status(HTTP_STATUS.UNAUTHORIZED);
    throw new Error("Invalid email or password");
  }

  await issueAuthResponse(res, user, HTTP_STATUS.OK, "Login successful");
});

export const googleLogin = asyncHandler(async (req, res) => {
  requireFields(req.body, ["credential"]);

  const payload = await verifyGoogleIdToken(req.body.credential);
  const email = normalizeEmail(payload?.email || "");

  if (!email) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error("Google account email not found");
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      firstName: payload.given_name || "",
      lastName: payload.family_name || "",
      name: payload.name || "",
      email,
      avatar: payload.picture || "",
      provider: "google",
      googleId: payload.sub
    });
  } else {
    user.avatar = payload.picture || user.avatar;
    user.provider = "google";
    user.googleId = payload.sub;
    user.name = payload.name || user.name;
    user.firstName = payload.given_name || user.firstName;
    user.lastName = payload.family_name || user.lastName;
  }

  await issueAuthResponse(res, user, HTTP_STATUS.OK, "Google login successful");
});

export const syncClerkUser = asyncHandler(async (req, res) => {
  const auth = getAuth(req);

  if (!auth.isAuthenticated || !auth.userId) {
    res.status(HTTP_STATUS.UNAUTHORIZED);
    throw new Error("Clerk session is required");
  }

  const clerkUser = await clerkClient.users.getUser(auth.userId);
  const primaryEmail =
    clerkUser.emailAddresses.find(
      (emailAddress) => emailAddress.id === clerkUser.primaryEmailAddressId
    ) || clerkUser.emailAddresses[0];
  const email = normalizeEmail(primaryEmail?.emailAddress || "");

  if (!email) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error("Clerk account email not found");
  }

  let user = await User.findOne({
    $or: [{ clerkId: clerkUser.id }, { email }]
  });

  const payload = {
    firstName: clerkUser.firstName || user?.firstName || "",
    lastName: clerkUser.lastName || user?.lastName || "",
    name:
      `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
      clerkUser.username ||
      user?.name ||
      email,
    email,
    avatar: clerkUser.imageUrl || user?.avatar || "",
    provider: "clerk",
    clerkId: clerkUser.id
  };

  if (!user) {
    user = await User.create(payload);
  } else {
    user.firstName = payload.firstName;
    user.lastName = payload.lastName;
    user.name = payload.name;
    user.email = payload.email;
    user.avatar = payload.avatar;
    user.provider = payload.provider;
    user.clerkId = payload.clerkId;
  }

  await issueAuthResponse(res, user, HTTP_STATUS.OK, "Clerk authentication successful");
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  await req.user.populate("wishlist", "name slug image price originalPrice inStock");

  res.status(HTTP_STATUS.OK).json({
    user: sanitizeUser(req.user)
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax"
  });
  res.status(HTTP_STATUS.OK).json({
    message: "Logged out"
  });
});
