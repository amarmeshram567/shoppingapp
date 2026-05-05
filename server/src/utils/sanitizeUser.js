export const sanitizeUser = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  provider: user.provider,
  role: user.role,
  wishlist: user.wishlist || [],
  addresses: user.addresses || [],
  paymentMethods: user.paymentMethods || [],
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});
