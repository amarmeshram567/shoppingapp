import { useState } from "react";
import { toast } from "sonner";
import {
  AdminPage,
  Button,
  DataTable,
  Drawer,
  StatusBadge,
  Surface,
  formatMoney
} from "../../components/AdminUi";
import { adminCustomersApi } from "../../lib/adminApi";
import { adminOrdersApi } from "../../lib/adminApi";
import { enrichCustomersWithHistory, mapCustomer, mapOrder } from "../../lib/adminAdapters";
import { useAdminQuery } from "../../hooks/useAdminQuery";
import { adminMockData } from "../../lib/adminMockData";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);

  useAdminQuery(
    async () => {
      try {
        const [customerResponse, orderResponse] = await Promise.all([
          adminCustomersApi.list(),
          adminOrdersApi.list()
        ]);
        const mappedCustomers = (customerResponse.items || []).map(mapCustomer);
        setCustomers(enrichCustomersWithHistory(mappedCustomers, orderResponse.items || []));
      } catch {
        setCustomers(adminMockData.customers);
      }
      return null;
    },
    [],
    null
  );

  return (
    <AdminPage
      eyebrow="CRM"
      title="Customer management"
      description="Review customer value, inspect order history, and handle account blocks responsibly."
    >
      <DataTable
        columns={[
          { key: "name", label: "Customer" },
          { key: "email", label: "Email" },
          { key: "segment", label: "Segment" },
          { key: "orders", label: "Orders" },
          { key: "spent", label: "Lifetime value", render: (value) => formatMoney(value) },
          { key: "blocked", label: "Status", render: (value) => <StatusBadge value={value ? "Blocked" : "Active"} /> }
        ]}
        rows={customers}
        actions={(row) => (
          <div className="flex justify-end gap-2">
            <Button
              tone="secondary"
              onClick={async () => {
                setSelectedCustomer(row);
                try {
                  const response = await adminCustomersApi.history(row.id);
                  setCustomerOrders((response.orders || []).map(mapOrder));
                } catch {
                  setCustomerOrders(adminMockData.orders.filter((order) => order.customer === row.name));
                }
              }}
            >
              Details
            </Button>
            <Button
              tone={row.blocked ? "secondary" : "danger"}
              onClick={async () => {
                setCustomers((current) =>
                  current.map((customer) =>
                    customer.id === row.id ? { ...customer, blocked: !customer.blocked } : customer
                  )
                );
                if (row.blocked) {
                  await adminCustomersApi.unblock(row.id).catch(() => null);
                  toast.success("Customer unblocked");
                } else {
                  await adminCustomersApi.block(row.id).catch(() => null);
                  toast.success("Customer blocked");
                }
              }}
            >
              {row.blocked ? "Unblock" : "Block"}
            </Button>
          </div>
        )}
      />

      <Drawer open={Boolean(selectedCustomer)} title={selectedCustomer?.name || "Customer detail"} onClose={() => setSelectedCustomer(null)}>
        {selectedCustomer ? (
          <div className="space-y-5">
            <Surface className="p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Customer profile</p>
                  <p className="mt-2 text-xl font-semibold text-white">{selectedCustomer.name}</p>
                  <p className="text-sm text-slate-400">{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Commercial value</p>
                  <p className="mt-2 text-white">{formatMoney(selectedCustomer.spent)}</p>
                  <p className="text-sm text-slate-400">{selectedCustomer.orders} orders</p>
                </div>
              </div>
            </Surface>
            <Surface className="p-5">
              <h3 className="text-lg font-semibold text-white">Order history</h3>
              <div className="mt-4 space-y-3">
                {customerOrders
                  .map((order) => (
                    <div key={order.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">{order.id}</p>
                          <p className="text-xs text-slate-500">{order.createdAt}</p>
                        </div>
                        <StatusBadge value={order.status} />
                      </div>
                      <p className="mt-2 text-sm text-slate-400">{formatMoney(order.total)}</p>
                    </div>
                  ))}
              </div>
            </Surface>
          </div>
        ) : null}
      </Drawer>
    </AdminPage>
  );
};

export default CustomersPage;
