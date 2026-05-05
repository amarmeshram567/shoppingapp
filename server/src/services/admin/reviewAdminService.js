import { reviewRepository } from "../../repositories/reviewRepository.js";
import { Product } from "../../models/Product.js";
import { getPagination } from "../../utils/pagination.js";
import { REVIEW_STATUS } from "../../constants/review.js";

export const reviewAdminService = {
  async listReviews(query) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};
    if (query.status) filter.status = query.status;
    const [items, total] = await Promise.all([
      reviewRepository.findMany(filter, { skip, limit }),
      reviewRepository.count(filter)
    ]);

    return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
  },

  async moderateReview(id, status) {
    const review = await reviewRepository.updateById(id, { status });
    if (!review) throw new Error("Review not found");

    if (status === REVIEW_STATUS.APPROVED) {
      const stats = await import("../../models/Review.js").then(({ Review }) =>
        Review.aggregate([
          { $match: { product: review.product, status: REVIEW_STATUS.APPROVED } },
          { $group: { _id: "$product", avgRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } }
        ])
      );

      await Product.findByIdAndUpdate(review.product, {
        rating: Number((stats[0]?.avgRating || 0).toFixed(1)),
        reviews: stats[0]?.totalReviews || 0
      });
    }

    return review;
  },

  async deleteReview(id) {
    return reviewRepository.deleteById(id);
  }
};
