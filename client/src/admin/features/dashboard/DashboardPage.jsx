import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { RevenueChart, SalesChart } from "../../components/AdminCharts";
import {
  AdminPage,
  DataTable,
  EmptyState,
  SkeletonBlock,
  StatCard,
  StatusBadge,
  Surface,
  formatMoney
} from "../../components/AdminUi";
import { useAdminQuery } from "../../hooks/useAdminQuery";
import { adminDashboardApi } from "../../lib/adminApi";
import { mapDashboard } from "../../lib/adminAdapters";
import { adminMockData } from "../../lib/adminMockData";

const DashboardPage = () => {
  const { data, loading } = useAdminQuery(
    async () => {
      try {
        const response = await adminDashboardApi.overview();
        return mapDashboard(response);
      } catch {
        return adminMockData;
      }
    },
    [],
    adminMockData
  );

  const metrics = data?.metrics || adminMockData.metrics;
  const revenueSeries = data?.revenueSeries || adminMockData.revenueSeries;
  const salesSeries = data?.salesSeries || adminMockData.salesSeries;
  const recentOrders = data?.recentOrders || adminMockData.recentOrders;
  const lowStock = data?.lowStock || adminMockData.lowStock;

  return (
    <AdminPage
      eyebrow="Executive overview"
      title="Operations command center"
      description="Track commercial health, identify bottlenecks, and respond to alerts before they affect customers."
    >
      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-40" />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total revenue" value={formatMoney(metrics.totalRevenue)} delta={metrics.revenueDelta} icon={DollarSign} accent="from-emerald-500/30" />
          <StatCard title="Orders" value={metrics.totalOrders} delta={metrics.orderDelta} icon={ShoppingCart} accent="from-sky-500/30" />
          <StatCard title="Customers" value={metrics.totalCustomers} delta={metrics.customerDelta} icon={Users} accent="from-fuchsia-500/25" />
          <StatCard title="Products" value={metrics.totalProducts} delta={metrics.productDelta} icon={Package} accent="from-amber-500/25" />
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <RevenueChart data={revenueSeries} />
        <SalesChart data={salesSeries} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.55fr_0.95fr]">
        <DataTable
          columns={[
            { key: "id", label: "Order" },
            { key: "customer", label: "Customer" },
            {
              key: "total",
              label: "Total",
              render: (value) => formatMoney(value)
            },
            {
              key: "status",
              label: "Status",
              render: (value) => <StatusBadge value={value} />
            },
            { key: "date", label: "Date" }
          ]}
          rows={recentOrders}
        />
        <Surface className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Low stock alerts</h3>
              <p className="text-sm text-slate-400">Products nearing replenishment threshold</p>
            </div>
            <StatusBadge value={`${lowStock.length} alerts`} />
          </div>
          {lowStock.length ? (
            <div className="space-y-3">
              {lowStock.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{item.sku}</p>
                    </div>
                    <StatusBadge value={`${item.stock} left`} />
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-400"
                      style={{ width: `${Math.min(100, (item.stock / item.threshold) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Threshold: {item.threshold} units</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No low stock alerts" description="Inventory levels are healthy across the catalog." />
          )}
        </Surface>
      </div>
    </AdminPage>
  );
};

export default DashboardPage;
