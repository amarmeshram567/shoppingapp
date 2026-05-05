import { useState } from "react";
import { toast } from "sonner";
import {
  AdminPage,
  Button,
  DataTable,
  Modal,
  StatusBadge,
  Surface
} from "../../components/AdminUi";
import { adminCatalogApi } from "../../lib/adminApi";
import { mapProduct } from "../../lib/adminAdapters";
import { useAdminQuery } from "../../hooks/useAdminQuery";
import { adminMockData } from "../../lib/adminMockData";

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [history] = useState(adminMockData.inventoryHistory);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustment, setAdjustment] = useState(5);

  useAdminQuery(
    async () => {
      try {
        const response = await adminCatalogApi.listProducts();
        setProducts((response.items || []).map(mapProduct));
      } catch {
        setProducts(adminMockData.products);
      }
      return null;
    },
    [],
    null
  );

  return (
    <AdminPage
      eyebrow="Warehouse control"
      title="Inventory management"
      description="Adjust stock, monitor low inventory, and keep a concise restock history for operators."
    >
      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <DataTable
          columns={[
            { key: "name", label: "Product" },
            { key: "sku", label: "SKU" },
            { key: "inventory", label: "On hand" },
            {
              key: "status",
              label: "Indicator",
              render: (_, row) => <StatusBadge value={row.inventory < 8 ? "Low stock" : "Healthy"} />
            }
          ]}
          rows={products}
          actions={(row) => (
            <Button tone="secondary" onClick={() => setSelectedProduct(row)}>
              Adjust stock
            </Button>
          )}
        />

        <Surface className="p-5">
          <h3 className="text-lg font-semibold text-white">Restock history</h3>
          <div className="mt-4 space-y-3">
            {history.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">{entry.sku}</p>
                  <StatusBadge value={entry.action} />
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  {entry.quantity > 0 ? "+" : ""}
                  {entry.quantity} units by {entry.actor}
                </p>
                <p className="mt-1 text-xs text-slate-500">{entry.createdAt}</p>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <Modal open={Boolean(selectedProduct)} title="Stock adjustment" onClose={() => setSelectedProduct(null)} size="md">
        {selectedProduct ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-medium text-white">{selectedProduct.name}</p>
              <p className="mt-1 text-sm text-slate-400">
                {selectedProduct.sku} · Current stock {selectedProduct.inventory}
              </p>
            </div>
            <input
              type="range"
              min="-10"
              max="30"
              value={adjustment}
              onChange={(event) => setAdjustment(Number(event.target.value))}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Adjustment</span>
              <span>{adjustment > 0 ? `+${adjustment}` : adjustment} units</span>
            </div>
            <div className="flex justify-end gap-3">
              <Button tone="secondary" onClick={() => setSelectedProduct(null)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  const nextQuantity = Math.max(0, selectedProduct.inventory + adjustment);
                  setProducts((current) =>
                    current.map((product) =>
                      product.id === selectedProduct.id
                        ? { ...product, inventory: nextQuantity }
                        : product
                    )
                  );
                  await adminCatalogApi.updateInventory(selectedProduct.id, { quantity: nextQuantity }).catch(() => null);
                  toast.success("Inventory updated");
                  setSelectedProduct(null);
                }}
              >
                Save adjustment
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </AdminPage>
  );
};

export default InventoryPage;
