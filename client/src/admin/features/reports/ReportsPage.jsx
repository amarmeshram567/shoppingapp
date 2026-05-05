import { useState } from "react";
import { Download } from "lucide-react";
import { RevenueChart, SalesChart } from "../../components/AdminCharts";
import { AdminPage, Button, Surface } from "../../components/AdminUi";
import { adminReportsApi } from "../../lib/adminApi";
import { mapRevenueReport, mapUserGrowthReport } from "../../lib/adminAdapters";
import { useAdminQuery } from "../../hooks/useAdminQuery";
import { adminMockData } from "../../lib/adminMockData";

const ReportsPage = () => {
  const [reportData, setReportData] = useState({
    revenueSeries: adminMockData.revenueSeries,
    salesSeries: adminMockData.salesSeries,
    topProducts: adminMockData.reports.topProducts,
    userGrowth: adminMockData.reports.userGrowth
  });

  useAdminQuery(
    async () => {
      try {
        const [revenue, sales, performance, users] = await Promise.all([
          adminReportsApi.revenue(),
          adminReportsApi.sales(),
          adminReportsApi.productPerformance(),
          adminReportsApi.userGrowth()
        ]);

        setReportData({
          revenueSeries: mapRevenueReport(revenue.report || []),
          salesSeries: (sales.report || []).slice(0, 8).map((item) => ({
            label: String(item._id || "Product").slice(-6),
            sales: item.unitsSold
          })),
          topProducts: (performance.report || []).map((item) => ({
            label: item.name,
            value: Math.round(item.revenueScore || 0)
          })),
          userGrowth: mapUserGrowthReport(users.report || [])
        });
      } catch {
        setReportData({
          revenueSeries: adminMockData.revenueSeries,
          salesSeries: adminMockData.salesSeries,
          topProducts: adminMockData.reports.topProducts,
          userGrowth: adminMockData.reports.userGrowth
        });
      }
      return null;
    },
    [],
    null
  );

  return (
    <AdminPage
      eyebrow="Business intelligence"
      title="Reports and analytics"
      description="Monitor revenue, sales composition, and product performance with export-ready reporting surfaces."
      actions={
        <div className="flex gap-3">
          <Button tone="secondary">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button>
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      }
    >
      <div className="grid gap-5 xl:grid-cols-2">
        <RevenueChart data={reportData.revenueSeries} />
        <SalesChart data={reportData.salesSeries} />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Surface className="p-5">
          <h3 className="text-lg font-semibold text-white">Product performance</h3>
          <div className="mt-5 space-y-4">
            {reportData.topProducts.map((product) => (
              <div key={product.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-300">{product.label}</span>
                  <span className="text-slate-500">{product.value} score</span>
                </div>
                <div className="h-2 rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${Math.min(100, product.value)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Surface>
        <Surface className="p-5">
          <h3 className="text-lg font-semibold text-white">Customer growth</h3>
          <div className="mt-5 grid gap-3">
            {reportData.userGrowth.map((row) => (
              <div key={row.month} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="text-sm text-slate-300">{row.month}</span>
                <span className="text-sm font-medium text-white">{row.users} customers</span>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </AdminPage>
  );
};

export default ReportsPage;
