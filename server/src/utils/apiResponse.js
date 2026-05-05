export const apiSuccess = (res, payload = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    ...payload
  });
};
