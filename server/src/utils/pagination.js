import { clampNumber } from "./validators.js";

export const getPagination = (query) => {
  const page = clampNumber(query.page, 1, 100000, 1);
  const limit = clampNumber(query.limit, 1, 100, 12);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
