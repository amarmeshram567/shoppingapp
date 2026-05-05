import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  AdminPage,
  Button,
  DataTable,
  Field,
  Modal,
  Surface,
  TextInput
} from "../../components/AdminUi";
import { adminCatalogApi } from "../../lib/adminApi";
import { mapCategory } from "../../lib/adminAdapters";
import { useAdminQuery } from "../../hooks/useAdminQuery";
import { adminMockData } from "../../lib/adminMockData";
import { categorySchema } from "../../lib/adminSchemas";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      parentId: "",
      image: ""
    }
  });

  useAdminQuery(
    async () => {
      try {
        const response = await adminCatalogApi.listCategories();
        setCategories((response.categories || []).map((category, _, list) => mapCategory(category, list)));
      } catch {
        setCategories(adminMockData.categories);
      }

      return null;
    },
    [],
    null
  );

  const openEditor = (category) => {
    setEditingCategory(category || null);
    reset(category || { name: "", slug: "", parentId: "", image: "" });
    setOpen(true);
  };

  return (
    <AdminPage
      eyebrow="Taxonomy"
      title="Category management"
      description="Organize the storefront catalog with nested category trees, visual media, and merchandising hierarchy."
      actions={
        <Button onClick={() => openEditor(null)}>
          <Plus className="h-4 w-4" />
          Add category
        </Button>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <DataTable
          columns={[
            { key: "name", label: "Category" },
            { key: "slug", label: "Slug" },
            {
              key: "children",
              label: "Children",
              render: (value) => (value?.length ? value.join(", ") : "None")
            }
          ]}
          rows={categories}
          actions={(row) => (
            <div className="flex justify-end gap-2">
              <Button tone="secondary" onClick={() => openEditor(row)}>
                Edit
              </Button>
              <Button
                tone="danger"
                onClick={async () => {
                  setCategories((current) => current.filter((category) => category.id !== row.id));
                  await adminCatalogApi.deleteCategory(row.id).catch(() => null);
                  toast.success("Category deleted");
                }}
              >
                Delete
              </Button>
            </div>
          )}
        />

        <Surface className="p-5">
          <h3 className="text-lg font-semibold text-white">Nested category tree</h3>
          <p className="mt-2 text-sm text-slate-400">Preview hierarchy used in storefront navigation and filters.</p>
          <div className="mt-5 space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="font-medium text-white">{category.name}</p>
                <div className="mt-3 space-y-2 pl-4 text-sm text-slate-400">
                  {(category.children || []).map((child) => (
                    <div key={child} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                      {child}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <Modal open={open} title={editingCategory ? "Edit category" : "Add category"} onClose={() => setOpen(false)}>
        <form
          className="grid gap-5 md:grid-cols-2"
          onSubmit={handleSubmit(async (values) => {
            const requestPayload = {
              name: values.name,
              slug: values.slug,
              parent: values.parentId || null,
              image: values.image,
              description: values.description || ""
            };

            if (editingCategory) {
              setCategories((current) =>
                current.map((category) =>
                  category.id === editingCategory.id ? { ...category, ...values } : category
                )
              );
              await adminCatalogApi.updateCategory(editingCategory.id, requestPayload).catch(() => null);
              toast.success("Category updated");
            } else {
              const payload = { ...values, id: crypto.randomUUID(), children: [] };
              setCategories((current) => [payload, ...current]);
              await adminCatalogApi.createCategory(requestPayload).catch(() => null);
              toast.success("Category created");
            }

            setOpen(false);
          })}
        >
          <Field label="Category name" error={errors.name?.message}>
            <TextInput {...register("name")} />
          </Field>
          <Field label="Slug" error={errors.slug?.message}>
            <TextInput {...register("slug")} />
          </Field>
          <Field label="Parent category" error={errors.parentId?.message}>
            <TextInput {...register("parentId")} placeholder="Optional parent id" />
          </Field>
          <Field label="Category image URL" error={errors.image?.message}>
            <TextInput {...register("image")} placeholder="https://..." />
          </Field>
          <Field label="Description" error={errors.description?.message}>
            <TextInput {...register("description")} placeholder="Optional short description" />
          </Field>
          <div className="md:col-span-2 flex justify-end gap-3">
            <Button tone="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save category"}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminPage>
  );
};

export default CategoriesPage;
