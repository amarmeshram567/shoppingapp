export const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params
  });

  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(", ");
    const error = new Error(message || "Validation failed");
    error.statusCode = 400;
    return next(error);
  }

  req.validated = result.data;
  next();
};
