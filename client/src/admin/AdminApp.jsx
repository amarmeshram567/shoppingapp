import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Shield } from "lucide-react";
import AdminLayout from "./layout/AdminLayout";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";
import { AdminForgotPasswordPage, AdminLoginPage, AdminResetPasswordPage } from "./features/auth/AdminAuthPages";

const DashboardPage = lazy(() => import("./features/dashboard/DashboardPage"));
const ProductsPage = lazy(() => import("./features/catalog/ProductsPage"));
const CategoriesPage = lazy(() => import("./features/catalog/CategoriesPage"));
const OrdersPage = lazy(() => import("./features/orders/OrdersPage"));
const CustomersPage = lazy(() => import("./features/customers/CustomersPage"));
const CouponsPage = lazy(() => import("./features/coupons/CouponsPage"));
const InventoryPage = lazy(() => import("./features/inventory/InventoryPage"));
const ReviewsPage = lazy(() => import("./features/reviews/ReviewsPage"));
const CmsPage = lazy(() => import("./features/cms/CmsPage"));
const NotificationsPage = lazy(() => import("./features/notifications/NotificationsPage"));
const ReportsPage = lazy(() => import("./features/reports/ReportsPage"));
const SettingsPage = lazy(() => import("./features/settings/SettingsPage"));

const SuspenseScreen = () => (
  <div className="grid min-h-screen place-items-center bg-gradient-warm">
    <div className="flex items-center gap-3 rounded-3xl border border-border/70 bg-card/90 px-6 py-4 text-foreground">
      <Shield className="h-5 w-5 text-primary" />
      Loading admin workspace...
    </div>
  </div>
);

const ProtectedAdminRoute = () => {
  const { isAuthenticated, checkingAuth } = useAdminAuth();

  if (checkingAuth) {
    return <SuspenseScreen />;
  }

  return isAuthenticated ? <AdminLayout /> : <Navigate to="/admin/login" replace />;
};

const AdminRoutes = () => (
  <Suspense fallback={<SuspenseScreen />}>
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route path="forgot-password" element={<AdminForgotPasswordPage />} />
      <Route path="reset-password" element={<AdminResetPasswordPage />} />
      <Route element={<ProtectedAdminRoute />}>
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="cms" element={<CmsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  </Suspense>
);

const AdminApp = () => (
  <AdminAuthProvider>
    <AdminRoutes />
  </AdminAuthProvider>
);

export default AdminApp;
