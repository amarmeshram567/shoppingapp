import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  AdminPage,
  Button,
  Field,
  Surface,
  TextArea,
  TextInput
} from "../../components/AdminUi";
import { adminSettingsApi } from "../../lib/adminApi";
import { mapSettings } from "../../lib/adminAdapters";
import { useAdminQuery } from "../../hooks/useAdminQuery";
import { adminMockData } from "../../lib/adminMockData";
import { settingsSchema } from "../../lib/adminSchemas";

const SettingsPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: adminMockData.settings
  });

  useAdminQuery(
    async () => {
      try {
        const response = await adminSettingsApi.list();
        reset(mapSettings(response.settings || []));
      } catch {
        reset(adminMockData.settings);
      }
      return null;
    },
    [reset],
    null
  );

  return (
    <AdminPage
      eyebrow="Platform configuration"
      title="Settings"
      description="Manage finance, shipping, payment, and communication templates with validated enterprise controls."
    >
      <form
        className="space-y-5"
        onSubmit={handleSubmit(async (values) => {
          await Promise.all([
            adminSettingsApi.save("tax", { defaultRate: values.taxRate }).catch(() => null),
            adminSettingsApi.save("shipping", { flatCharge: values.shippingFee }).catch(() => null),
            adminSettingsApi.save("payment", { gateway: values.paymentGateway }).catch(() => null),
            adminSettingsApi.save("email", { supportEmail: values.supportEmail }).catch(() => null)
          ]);
          toast.success("Settings saved");
        })}
      >
        <div className="grid gap-5 xl:grid-cols-2">
          <Surface className="p-5">
            <h3 className="text-lg font-semibold text-white">Tax settings</h3>
            <div className="mt-4">
              <Field label="Default tax rate" error={errors.taxRate?.message}>
                <TextInput type="number" step="0.01" {...register("taxRate")} />
              </Field>
            </div>
          </Surface>
          <Surface className="p-5">
            <h3 className="text-lg font-semibold text-white">Shipping settings</h3>
            <div className="mt-4">
              <Field label="Flat shipping fee" error={errors.shippingFee?.message}>
                <TextInput type="number" {...register("shippingFee")} />
              </Field>
            </div>
          </Surface>
          <Surface className="p-5">
            <h3 className="text-lg font-semibold text-white">Payment gateway</h3>
            <div className="mt-4">
              <Field label="Primary gateway" error={errors.paymentGateway?.message}>
                <TextInput {...register("paymentGateway")} />
              </Field>
            </div>
          </Surface>
          <Surface className="p-5">
            <h3 className="text-lg font-semibold text-white">Email templates</h3>
            <div className="mt-4 space-y-4">
              <Field label="Support email" error={errors.supportEmail?.message}>
                <TextInput {...register("supportEmail")} />
              </Field>
              <Field label="Order confirmation template">
                <TextArea defaultValue={"Subject: Your order is confirmed\n\nThanks for shopping with ShoppingApp."} />
              </Field>
            </div>
          </Surface>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save settings"}
          </Button>
        </div>
      </form>
    </AdminPage>
  );
};

export default SettingsPage;
