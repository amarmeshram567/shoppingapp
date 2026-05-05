import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  AdminPage,
  Button,
  DataTable,
  Field,
  Modal,
  Select,
  TextInput,
  formatMoney
} from "../../components/AdminUi";
import { adminCouponsApi } from "../../lib/adminApi";
import { mapCoupon } from "../../lib/adminAdapters";
import { useAdminQuery } from "../../hooks/useAdminQuery";
import { adminMockData } from "../../lib/adminMockData";
import { couponSchema } from "../../lib/adminSchemas";

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      type: "percentage",
      value: 10,
      minOrderValue: 50,
      usageLimit: 100,
      expiresAt: "2026-06-30"
    }
  });

  useAdminQuery(
    async () => {
      try {
        const response = await adminCouponsApi.list();
        setCoupons((response.coupons || []).map(mapCoupon));
      } catch {
        setCoupons(adminMockData.coupons);
      }
      return null;
    },
    [],
    null
  );

  const openEditor = (coupon = null) => {
    setEditingCoupon(coupon);
    reset(coupon || {
      code: "",
      type: "percentage",
      value: 10,
      minOrderValue: 50,
      usageLimit: 100,
      expiresAt: "2026-06-30"
    });
    setOpen(true);
  };

  return (
    <AdminPage
      eyebrow="Promotions"
      title="Coupon management"
      description="Manage discount campaigns, monitor usage, and keep promotion rules transparent."
      actions={<Button onClick={() => openEditor()}>Create coupon</Button>}
    >
      <DataTable
        columns={[
          { key: "code", label: "Code" },
          { key: "type", label: "Type" },
          { key: "value", label: "Value", render: (value, row) => row.type === "percentage" ? `${value}%` : formatMoney(value) },
          { key: "used", label: "Used" },
          { key: "usageLimit", label: "Usage limit" },
          { key: "expiresAt", label: "Expires" }
        ]}
        rows={coupons}
        actions={(row) => (
          <div className="flex justify-end gap-2">
            <Button tone="secondary" onClick={() => openEditor(row)}>
              Edit
            </Button>
            <Button
              tone="danger"
              onClick={async () => {
                setCoupons((current) => current.filter((coupon) => coupon.id !== row.id));
                await adminCouponsApi.remove(row.id).catch(() => null);
                toast.success("Coupon deleted");
              }}
            >
              Delete
            </Button>
          </div>
        )}
      />

      <Modal open={open} title={editingCoupon ? "Edit coupon" : "Create coupon"} onClose={() => setOpen(false)}>
        <form
          className="grid gap-5 md:grid-cols-2"
          onSubmit={handleSubmit(async (values) => {
            if (editingCoupon) {
              setCoupons((current) =>
                current.map((coupon) => (coupon.id === editingCoupon.id ? { ...coupon, ...values } : coupon))
              );
              await adminCouponsApi.update(editingCoupon.id, {
                code: values.code,
                discountType: values.type,
                discountValue: values.value,
                minimumOrderAmount: values.minOrderValue,
                usageLimit: values.usageLimit,
                expiresAt: values.expiresAt,
                description: values.description,
                maxDiscountAmount: values.maxDiscountAmount
              }).catch(() => null);
              toast.success("Coupon updated");
            } else {
              const payload = { ...values, id: crypto.randomUUID(), used: 0 };
              setCoupons((current) => [payload, ...current]);
              await adminCouponsApi.create({
                code: values.code,
                discountType: values.type,
                discountValue: values.value,
                minimumOrderAmount: values.minOrderValue,
                usageLimit: values.usageLimit,
                expiresAt: values.expiresAt,
                description: values.description,
                maxDiscountAmount: values.maxDiscountAmount
              }).catch(() => null);
              toast.success("Coupon created");
            }

            setOpen(false);
          })}
        >
          <Field label="Code" error={errors.code?.message}>
            <TextInput {...register("code")} />
          </Field>
          <Field label="Type" error={errors.type?.message}>
            <Select {...register("type")}>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed amount</option>
            </Select>
          </Field>
          <Field label="Value" error={errors.value?.message}>
            <TextInput type="number" {...register("value")} />
          </Field>
          <Field label="Minimum order value" error={errors.minOrderValue?.message}>
            <TextInput type="number" {...register("minOrderValue")} />
          </Field>
          <Field label="Usage limit" error={errors.usageLimit?.message}>
            <TextInput type="number" {...register("usageLimit")} />
          </Field>
          <Field label="Expiry date" error={errors.expiresAt?.message}>
            <TextInput type="date" {...register("expiresAt")} />
          </Field>
          <Field label="Description" error={errors.description?.message}>
            <TextInput {...register("description")} />
          </Field>
          <Field label="Max discount amount" error={errors.maxDiscountAmount?.message}>
            <TextInput type="number" {...register("maxDiscountAmount")} />
          </Field>
          <div className="md:col-span-2 flex justify-end gap-3">
            <Button tone="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save coupon"}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminPage>
  );
};

export default CouponsPage;
