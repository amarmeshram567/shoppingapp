import { useMemo, useState } from "react";
import {
  BadgeDollarSign,
  Boxes,
  ChartColumn,
  ClipboardList,
  LayoutTemplate,
  Bell,
  PackageSearch,
  Percent,
  Settings,
  ShieldAlert,
  ShoppingBag,
  Users
} from "lucide-react";
import { Outlet } from "react-router-dom";
import { Sidebar, AdminHeader } from "../components/AdminUi";
import { useAdminAuth } from "../context/AdminAuthContext";
import { mapNotification } from "../lib/adminAdapters";
import { adminNotificationsApi } from "../lib/adminApi";
import { useAdminQuery } from "../hooks/useAdminQuery";
import { adminMockData } from "../lib/adminMockData";

const navigation = [
  { to: "/admin", label: "Overview", icon: ChartColumn, roles: ["super_admin", "manager", "staff"] },
  { to: "/admin/products", label: "Products", icon: ShoppingBag, roles: ["super_admin", "manager", "staff"] },
  { to: "/admin/categories", label: "Categories", icon: Boxes, roles: ["super_admin", "manager"] },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList, roles: ["super_admin", "manager", "staff"] },
  { to: "/admin/customers", label: "Customers", icon: Users, roles: ["super_admin", "manager"] },
  { to: "/admin/coupons", label: "Coupons", icon: Percent, roles: ["super_admin", "manager"] },
  { to: "/admin/inventory", label: "Inventory", icon: PackageSearch, roles: ["super_admin", "manager", "staff"] },
  { to: "/admin/reviews", label: "Reviews", icon: ShieldAlert, roles: ["super_admin", "manager", "staff"] },
  { to: "/admin/cms", label: "CMS", icon: LayoutTemplate, roles: ["super_admin", "manager"] },
  { to: "/admin/notifications", label: "Notifications", icon: Bell, roles: ["super_admin", "manager", "staff"] },
  { to: "/admin/reports", label: "Reports", icon: BadgeDollarSign, roles: ["super_admin", "manager"] },
  { to: "/admin/settings", label: "Settings", icon: Settings, roles: ["super_admin"] }
];

export const RoleGate = ({ allow, children, fallback = null }) => {
  const { user } = useAdminAuth();
  return allow.includes(user?.role) ? children : fallback;
};

const AdminLayout = () => {
  const { user, theme, toggleTheme, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState(adminMockData.notifications);

  const filteredNavigation = useMemo(
    () => navigation.filter((item) => item.roles.includes(user?.role || "staff")),
    [user?.role]
  );

  useAdminQuery(
    async () => {
      try {
        const response = await adminNotificationsApi.list();
        setNotifications((response.items || []).map(mapNotification));
      } catch {
        setNotifications(adminMockData.notifications);
      }
      return null;
    },
    [],
    null
  );

  return (
    <div className="min-h-screen bg-gradient-warm">
      <div className="flex">
        <div className="relative shrink-0">
          <Sidebar items={filteredNavigation} open={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={collapsed} />
          <button
            onClick={() => setCollapsed((value) => !value)}
            className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 rounded-full border border-border/70 bg-card/95 px-3 py-1 text-xs text-muted-foreground shadow-[var(--shadow-md)] transition hover:bg-secondary lg:block"
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>
        </div>
        <div className="min-h-screen flex-1">
          <AdminHeader
            user={user}
            theme={theme}
            toggleTheme={toggleTheme}
            notifications={notifications}
            notificationOpen={notificationOpen}
            setNotificationOpen={setNotificationOpen}
            onLogout={logout}
            onMenuOpen={() => setSidebarOpen(true)}
          />
          <main className="px-4 pb-10 sm:px-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
