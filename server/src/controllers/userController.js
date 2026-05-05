import { User } from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { isValidObjectId } from "../utils/validators.js";

export const getProfile = asyncHandler(async (req, res) => {
  await req.user.populate("wishlist", "name slug image price originalPrice inStock");

  res.status(HTTP_STATUS.OK).json({
    user: sanitizeUser(req.user)
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, avatar } = req.body;

  if (firstName !== undefined) req.user.firstName = firstName.trim();
  if (lastName !== undefined) req.user.lastName = lastName.trim();
  if (avatar !== undefined) req.user.avatar = avatar.trim();
  req.user.name = `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim();

  await req.user.save();
  await req.user.populate("wishlist", "name slug image price originalPrice inStock");

  res.status(HTTP_STATUS.OK).json({
    message: "Profile updated",
    user: sanitizeUser(req.user)
  });
});

export const getWishlist = asyncHandler(async (req, res) => {
  await req.user.populate("wishlist", "name slug image price originalPrice image inStock");

  res.status(HTTP_STATUS.OK).json({
    wishlist: req.user.wishlist
  });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!isValidObjectId(productId)) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error("Invalid product id");
  }

  const exists = req.user.wishlist.some((id) => id.toString() === productId);

  if (exists) {
    req.user.wishlist = req.user.wishlist.filter((id) => id.toString() !== productId);
  } else {
    req.user.wishlist.push(productId);
  }

  await req.user.save();
  await req.user.populate("wishlist", "name slug image price originalPrice inStock");

  res.status(HTTP_STATUS.OK).json({
    message: exists ? "Removed from wishlist" : "Added to wishlist",
    wishlist: req.user.wishlist
  });
});

export const addAddress = asyncHandler(async (req, res) => {
  const { fullName, addressLine1, city, postalCode, country, isDefault = false } = req.body;

  if (!fullName || !addressLine1 || !city || !postalCode || !country) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error("Missing required address fields");
  }

  if (isDefault) {
    req.user.addresses = req.user.addresses.map((address) => ({
      ...address.toObject(),
      isDefault: false
    }));
  }

  req.user.addresses.push(req.body);
  await req.user.save();

  res.status(HTTP_STATUS.CREATED).json({
    message: "Address added",
    addresses: req.user.addresses
  });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const address = req.user.addresses.id(req.params.addressId);

  if (!address) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error("Address not found");
  }

  if (req.body.isDefault) {
    req.user.addresses.forEach((item) => {
      item.isDefault = false;
    });
  }

  Object.assign(address, req.body);
  await req.user.save();

  res.status(HTTP_STATUS.OK).json({
    message: "Address updated",
    addresses: req.user.addresses
  });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const address = req.user.addresses.id(req.params.addressId);

  if (!address) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error("Address not found");
  }

  address.deleteOne();
  await req.user.save();

  res.status(HTTP_STATUS.OK).json({
    message: "Address deleted",
    addresses: req.user.addresses
  });
});

export const addPaymentMethod = asyncHandler(async (req, res) => {
  const { brand, last4, expiryMonth, expiryYear, isDefault = false } = req.body;

  if (!brand || !last4 || !expiryMonth || !expiryYear) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error("Missing required payment method fields");
  }

  if (isDefault) {
    req.user.paymentMethods = req.user.paymentMethods.map((method) => ({
      ...method.toObject(),
      isDefault: false
    }));
  }

  req.user.paymentMethods.push(req.body);
  await req.user.save();

  res.status(HTTP_STATUS.CREATED).json({
    message: "Payment method added",
    paymentMethods: req.user.paymentMethods
  });
});

export const deletePaymentMethod = asyncHandler(async (req, res) => {
  const paymentMethod = req.user.paymentMethods.id(req.params.paymentMethodId);

  if (!paymentMethod) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error("Payment method not found");
  }

  paymentMethod.deleteOne();
  await req.user.save();

  res.status(HTTP_STATUS.OK).json({
    message: "Payment method deleted",
    paymentMethods: req.user.paymentMethods
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  res.status(HTTP_STATUS.OK).json({ users });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").populate("wishlist");

  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error("User not found");
  }

  res.status(HTTP_STATUS.OK).json({ user });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error("User not found");
  }

  user.role = req.body.role === "admin" ? "admin" : "user";
  await user.save();

  res.status(HTTP_STATUS.OK).json({
    message: "User role updated",
    user: sanitizeUser(user)
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error("User not found");
  }

  await user.deleteOne();
  res.status(HTTP_STATUS.OK).json({ message: "User deleted" });
});
