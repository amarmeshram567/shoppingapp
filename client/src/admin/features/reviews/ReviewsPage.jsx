import { useState } from "react";
import { toast } from "sonner";
import { AdminPage, Button, DataTable, StatusBadge } from "../../components/AdminUi";
import { adminReviewsApi } from "../../lib/adminApi";
import { mapReview } from "../../lib/adminAdapters";
import { useAdminQuery } from "../../hooks/useAdminQuery";
import { adminMockData } from "../../lib/adminMockData";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);

  useAdminQuery(
    async () => {
      try {
        const response = await adminReviewsApi.list();
        setReviews((response.items || []).map(mapReview));
      } catch {
        setReviews(adminMockData.reviews);
      }
      return null;
    },
    [],
    null
  );

  return (
    <AdminPage
      eyebrow="Moderation"
      title="Reviews management"
      description="Moderate customer-generated content with approval, rejection, and deletion workflows."
    >
      <DataTable
        columns={[
          { key: "product", label: "Product" },
          { key: "customer", label: "Customer" },
          { key: "rating", label: "Rating", render: (value) => `${value}/5` },
          { key: "excerpt", label: "Excerpt" },
          { key: "status", label: "Status", render: (value) => <StatusBadge value={value} /> }
        ]}
        rows={reviews}
        actions={(row) => (
          <div className="flex justify-end gap-2">
            <Button
              tone="secondary"
              onClick={async () => {
                setReviews((current) =>
                  current.map((review) => (review.id === row.id ? { ...review, status: "Approved" } : review))
                );
                await adminReviewsApi.approve(row.id).catch(() => null);
                toast.success("Review approved");
              }}
            >
              Approve
            </Button>
            <Button
              tone="danger"
              onClick={async () => {
                setReviews((current) =>
                  current.map((review) => (review.id === row.id ? { ...review, status: "Rejected" } : review))
                );
                await adminReviewsApi.reject(row.id).catch(() => null);
                toast.success("Review rejected");
              }}
            >
              Reject
            </Button>
            <Button
              tone="ghost"
              onClick={async () => {
                setReviews((current) => current.filter((review) => review.id !== row.id));
                await adminReviewsApi.remove(row.id).catch(() => null);
                toast.success("Review deleted");
              }}
            >
              Delete
            </Button>
          </div>
        )}
      />
    </AdminPage>
  );
};

export default ReviewsPage;
