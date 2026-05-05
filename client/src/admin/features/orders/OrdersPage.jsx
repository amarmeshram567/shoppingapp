import { useMemo, useState } from "react";
import { Eye, ReceiptText } from "lucide-react";
import { toast } from "sonner";
import {
  AdminPage,
  Button,
  DataTable,
  Drawer,
  Modal,
  Pagination,
  SearchBar,
  Select,
  StatusBadge,
  Surface,
  formatMoney
} from "../../components/AdminUi";
import { adminOrdersApi } from "../../lib/adminApi";
import { mapOrder } from "../../lib/adminAdapters";
import { useAdminQuery } from "../../hooks/useAdminQuery";
import { adminMockData } from "../../lib/adminMockData";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [refundOrder, setRefundOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useAdminQuery(
    async () => {
      try {
        const response = await adminOrdersApi.list();
        setOrders((response.items || []).map(mapOrder));
      } catch {
        setOrders(adminMockData.orders);
      }
      return null;
    },
    [],
    null
  );

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

  return (
    <AdminPage
      eyebrow="Fulfillment"
      title="Order management"
      description="Review order details, manage fulfillment status, process refunds, and preview invoices from a single workflow."
    >
      <Surface className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            <SearchBar value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order id or customer" />
            <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="max-w-[220px]">
              <option value="all">All statuses</option>
              <option value="Paid">Paid</option>
              <option value="Packed">Packed</option>
              <option value="Refund Requested">Refund Requested</option>
            </Select>
          </div>
          <div className="text-sm text-slate-400">{filteredOrders.length} orders</div>
        </div>
      </Surface>

      <DataTable
        columns={[
          { key: "id", label: "Order" },
          { key: "customer", label: "Customer" },
          { key: "items", label: "Items" },
          { key: "total", label: "Total", render: (value) => formatMoney(value) },
          { key: "payment", label: "Payment" },
          { key: "status", label: "Status", render: (value) => <StatusBadge value={value} /> }
        ]}
        rows={paginatedOrders}
        actions={(row) => (
          <div className="flex justify-end gap-2">
            <Button tone="secondary" onClick={() => setSelectedOrder(row)}>
              <Eye className="h-4 w-4" />
              View
            </Button>
            <Button tone="secondary" onClick={() => {
              setSelectedOrder(row);
              setInvoiceOpen(true);
            }}>
              <ReceiptText className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Drawer open={Boolean(selectedOrder)} title={selectedOrder?.id || "Order detail"} onClose={() => setSelectedOrder(null)}>
        {selectedOrder ? (
          <div className="space-y-5">
            <Surface className="p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Customer</p>
                  <p className="mt-2 text-white">{selectedOrder.customer}</p>
                  <p className="text-sm text-slate-400">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Shipping</p>
                  <p className="mt-2 text-white">{selectedOrder.shippingAddress}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Status update</p>
                  <Select
                    value={selectedOrder.status}
                    onChange={async (event) => {
                      const status = event.target.value;
                      setOrders((current) =>
                        current.map((order) => (order.id === selectedOrder.id ? { ...order, status } : order))
                      );
                      setSelectedOrder((current) => ({ ...current, status }));
                      await adminOrdersApi.updateStatus(selectedOrder.id, { status: status.toLowerCase() }).catch(() => null);
                      toast.success("Order status updated");
                    }}
                    className="mt-2"
                  >
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                    <option>Refunded</option>
                  </Select>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Total</p>
                  <p className="mt-2 text-white">{formatMoney(selectedOrder.total)}</p>
                </div>
              </div>
            </Surface>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setInvoiceOpen(true)}>Invoice preview</Button>
              <Button tone="danger" onClick={() => setRefundOrder(selectedOrder)}>
                Refund / return
              </Button>
            </div>
          </div>
        ) : null}
      </Drawer>

      <Modal open={invoiceOpen} title="Invoice preview" onClose={() => setInvoiceOpen(false)}>
        {selectedOrder ? (
          <Surface className="border border-white/10 bg-[#0a1222] p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Invoice</p>
                <h3 className="mt-1 text-2xl font-semibold text-white">{selectedOrder.id}</h3>
              </div>
              <StatusBadge value={selectedOrder.status} />
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Bill to</p>
                <p className="mt-2 text-white">{selectedOrder.customer}</p>
                <p className="text-sm text-slate-400">{selectedOrder.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Amount</p>
                <p className="mt-2 text-white">{formatMoney(selectedOrder.total)}</p>
              </div>
            </div>
          </Surface>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(refundOrder)}
        title="Refund or return"
        description="Use this action to simulate refund handling until the finance flow is fully integrated."
        onClose={() => setRefundOrder(null)}
        size="md"
      >
        <div className="flex justify-end gap-3">
          <Button tone="secondary" onClick={() => setRefundOrder(null)}>
            Cancel
          </Button>
          <Button
            tone="danger"
            onClick={async () => {
              await adminOrdersApi.refund(refundOrder.id, { action: "refund" }).catch(() => null);
              toast.success("Refund action recorded");
              setRefundOrder(null);
            }}
          >
            Confirm refund
          </Button>
        </div>
      </Modal>
    </AdminPage>
  );
};

export default OrdersPage;
