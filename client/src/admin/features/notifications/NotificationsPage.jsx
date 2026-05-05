import { useState } from "react";
import { toast } from "sonner";
import { AdminPage, Button, EmptyState, Surface, StatusBadge } from "../../components/AdminUi";
import { adminNotificationsApi } from "../../lib/adminApi";
import { mapNotification } from "../../lib/adminAdapters";
import { useAdminQuery } from "../../hooks/useAdminQuery";
import { adminMockData } from "../../lib/adminMockData";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

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
    <AdminPage
      eyebrow="Alert center"
      title="Notifications"
      description="Respond to operational alerts, mark messages as read, and keep teams focused on action-oriented updates."
      actions={
        <div className="flex gap-3">
          <Button
            tone="secondary"
            onClick={async () => {
              setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
              toast.success("All notifications marked as read");
            }}
          >
            Mark all as read
          </Button>
          <Button
            onClick={async () => {
              const response = await adminNotificationsApi.generate().catch(() => null);
              if (response?.notifications) {
                setNotifications((current) => [...response.notifications.map(mapNotification), ...current]);
              }
              toast.success("Notifications refreshed");
            }}
          >
            Generate alerts
          </Button>
        </div>
      }
    >
      {notifications.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {notifications.map((notification) => (
            <Surface key={notification.id} className="p-5">
              <div className="flex items-center justify-between gap-3">
                <StatusBadge value={notification.level} />
                <span className="text-xs text-slate-500">{notification.time}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{notification.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{notification.body}</p>
              <div className="mt-5 flex gap-2">
                <Button
                  tone="secondary"
                  onClick={async () => {
                    setNotifications((current) =>
                      current.map((item) => (item.id === notification.id ? { ...item, read: true } : item))
                    );
                    await adminNotificationsApi.markRead(notification.id).catch(() => null);
                    toast.success("Notification updated");
                  }}
                >
                  Mark as read
                </Button>
                <Button
                  tone="ghost"
                  onClick={() => {
                    setNotifications((current) => current.filter((item) => item.id !== notification.id));
                  }}
                >
                  Clear
                </Button>
              </div>
            </Surface>
          ))}
        </div>
      ) : (
        <EmptyState title="All clear" description="There are no active alerts right now." />
      )}
    </AdminPage>
  );
};

export default NotificationsPage;
