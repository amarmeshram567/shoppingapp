import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AdminPage,
  Button,
  DataTable,
  Drawer,
  Field,
  Modal,
  Pagination,
  SearchBar,
  Select,
  StatusBadge,
  Surface,
  TextArea,
  TextInput,
  formatMoney
} from "../../components/AdminUi";
import { RoleGate } from "../../layout/AdminLayout";
import { adminCatalogApi } from "../../lib/adminApi";
import { mapCategory, mapProduct } from "../../lib/adminAdapters";
import { useAdminQuery } from "../../hooks/useAdminQuery";
import { adminMockData } from "../../lib/adminMockData";
import { categorySchema, productSchema } from "../../lib/adminSchemas";

const toFormData = (values, images) => {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });

  images.forEach((file) => {
    formData.append("images", file);
  });

  return formData;
};

const getCategoryList = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.categories)) {
    return response.categories;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
};

const getProductItems = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  if (Array.isArray(response?.products)) {
    return response.products;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
};

const isMongoObjectId = (value) => /^[a-f\d]{24}$/i.test(String(value || ""));

const CategoryManagerModal = ({ open, category, onClose, onSave }) => {
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
      image: "",
      description: ""
    }
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(
      category || {
        name: "",
        slug: "",
        parentId: "",
        image: "",
        description: ""
      }
    );
  }, [category, open, reset]);

  return (
    <Modal
      open={open}
      title={category ? "Edit category" : "Add category"}
      description="Create or update a product category without leaving the product flow."
      onClose={onClose}
    >
      <form
        className="grid gap-5 md:grid-cols-2"
        onSubmit={handleSubmit(async (values) => {
          await onSave(values);
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
        <div className="md:col-span-2">
          <Field label="Description" error={errors.description?.message}>
            <TextInput {...register("description")} placeholder="Optional short description" />
          </Field>
        </div>
        <div className="md:col-span-2 flex justify-end gap-3">
          <Button type="button" tone="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const ProductEditor = ({
  categories,
  initialValues,
  onSubmit,
  onClose,
  onAddCategory,
  onEditCategory,
  preferredCategoryId
}) => {
  const [previewImages, setPreviewImages] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues:
      initialValues || {
        name: "",
        brand: "",
        sku: "",
        categoryId: categories[0]?.id || "",
        price: 0,
        compareAtPrice: 0,
        inventory: 0,
        lowStockThreshold: 5,
        status: "draft",
        image: "",
        description: "<p>Describe craftsmanship, materials, and key merchandising notes.</p>"
      }
  });

  const descriptionValue = watch("description");
  const selectedCategoryId = watch("categoryId");

  useEffect(() => {
    if (!categories.length) {
      return;
    }

    if (initialValues?.id) {
      reset({
        ...initialValues,
        categoryId: initialValues.categoryId || categories[0]?.id || ""
      });
      return;
    }

    if (!selectedCategoryId) {
      setValue("categoryId", categories[0]?.id || "", {
        shouldValidate: true
      });
    }
  }, [categories, initialValues, reset, selectedCategoryId, setValue]);

  useEffect(() => {
    if (!preferredCategoryId) {
      return;
    }

    setValue("categoryId", preferredCategoryId, {
      shouldValidate: true
    });
  }, [preferredCategoryId, setValue]);

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values, previewImages.map((item) => item.file));
        onClose();
      })}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Product name" error={errors.name?.message}>
          <TextInput {...register("name")} />
        </Field>
        <Field label="SKU" error={errors.sku?.message}>
          <TextInput {...register("sku")} />
        </Field>
        <Field label="Brand" error={errors.brand?.message}>
          <TextInput {...register("brand")} />
        </Field>
        <Field label="Category" error={errors.categoryId?.message}>
          <div className="space-y-3">
            <Select {...register("categoryId")}>
              {categories.length ? (
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option value="">No categories available</option>
              )}
            </Select>
            <div className="flex flex-wrap gap-2">
              <Button type="button" tone="secondary" onClick={onAddCategory}>
                Add category
              </Button>
              <Button
                type="button"
                tone="secondary"
                onClick={() => onEditCategory(selectedCategoryId)}
                disabled={!selectedCategoryId}
              >
                Edit selected category
              </Button>
            </div>
          </div>
        </Field>
        <Field label="Status" error={errors.status?.message}>
          <Select {...register("status")}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </Select>
        </Field>
        <Field label="Price" error={errors.price?.message}>
          <TextInput type="number" step="0.01" {...register("price")} />
        </Field>
        <Field label="Compare at price" error={errors.compareAtPrice?.message}>
          <TextInput type="number" step="0.01" {...register("compareAtPrice")} />
        </Field>
        <Field label="Inventory" error={errors.inventory?.message}>
          <TextInput type="number" {...register("inventory")} />
        </Field>
        <Field label="Low stock threshold" error={errors.lowStockThreshold?.message}>
          <TextInput type="number" {...register("lowStockThreshold")} />
        </Field>
        <Field label="Variants" hint="Color / size notes">
          <TextInput placeholder="e.g. 4 variants" />
        </Field>
      </div>

      <Field label="Rich description" error={errors.description?.message}>
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-3">
          <div className="mb-3 flex flex-wrap gap-2">
            {["Bold", "Italic", "Headline", "Bullet"].map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => {
                  const templates = {
                    Bold: "<strong>Highlighted feature</strong>",
                    Italic: "<em>Editorial note</em>",
                    Headline: "<h3>Craft & Materials</h3>",
                    Bullet: "<ul><li>Premium finish</li><li>Ready for storefront</li></ul>"
                  };
                  setValue("description", `${descriptionValue}\n${templates[action]}`, {
                    shouldValidate: true
                  });
                }}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
              >
                {action}
              </button>
            ))}
          </div>
          <TextArea {...register("description")} className="min-h-[180px] bg-transparent" />
        </div>
      </Field>

      <Field label="Multiple image upload">
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-4">
          <TextInput {...register("image")} placeholder="Primary image URL fallback" className="mb-3" />
          <TextInput
            type="file"
            multiple
            accept="image/*"
            onChange={(event) => {
              const files = Array.from(event.target.files || []);
              setPreviewImages(
                files.map((file) => ({
                  file,
                  url: URL.createObjectURL(file)
                }))
              );
            }}
          />
          {previewImages.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {previewImages.map((image) => (
                <img key={image.url} src={image.url} alt={image.file.name} className="h-32 w-full rounded-2xl object-cover" />
              ))}
            </div>
          ) : null}
        </div>
      </Field>

      <div className="flex justify-end gap-3">
        <Button type="button" tone="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save product"}
        </Button>
      </div>
    </form>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [preferredCategoryId, setPreferredCategoryId] = useState("");
  const [categories, setCategories] = useState(adminMockData.categories);
  const pageSize = 6;

  useAdminQuery(
    async () => {
      try {
        const categoryResponse = await adminCatalogApi.listCategories();
        const mappedCategories = getCategoryList(categoryResponse).map((category, _, list) =>
          mapCategory(category, list)
        );
        setCategories(mappedCategories.length ? mappedCategories : adminMockData.categories);

        const firstProductResponse = await adminCatalogApi.listProducts({ page: 1, limit: 100 });
        const firstPageItems = getProductItems(firstProductResponse);
        const totalPages = Number(firstProductResponse?.totalPages || 1);

        if (totalPages > 1) {
          const remainingResponses = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, index) =>
              adminCatalogApi.listProducts({ page: index + 2, limit: 100 })
            )
          );
          const remainingItems = remainingResponses.flatMap((response) => getProductItems(response));
          setProducts([...firstPageItems, ...remainingItems].map(mapProduct));
        } else {
          setProducts(firstPageItems.map(mapProduct));
        }
      } catch {
        setCategories(adminMockData.categories);
        setProducts(adminMockData.products);
      }

      return null;
    },
    [],
    null
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    let next = products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || product.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    next = next.sort((left, right) => {
      if (sortBy === "price") {
        return right.price - left.price;
      }

      if (sortBy === "inventory") {
        return left.inventory - right.inventory;
      }

      return left.name.localeCompare(right.name);
    });

    return next;
  }, [page, products, search, sortBy, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  const openCategoryManager = (categoryId = null) => {
    setEditingCategory(
      categoryId ? categories.find((category) => String(category.id) === String(categoryId)) || null : null
    );
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (values) => {
    const requestPayload = {
      name: values.name,
      slug: values.slug,
      parent: values.parentId || null,
      image: values.image,
      description: values.description || ""
    };

    if (editingCategory) {
      const updatedCategory = {
        ...editingCategory,
        ...values
      };
      setCategories((current) =>
        current.map((category) => (category.id === editingCategory.id ? updatedCategory : category))
      );
      setProducts((current) =>
        current.map((product) =>
          product.categoryId === editingCategory.id
            ? { ...product, category: values.name }
            : product
        )
      );
      await adminCatalogApi.updateCategory(editingCategory.id, requestPayload).catch(() => null);
      setPreferredCategoryId(editingCategory.id);
      toast.success("Category updated");
    } else {
      const newCategory = {
        id: crypto.randomUUID(),
        name: values.name,
        slug: values.slug,
        parentId: values.parentId || "",
        image: values.image || "",
        description: values.description || "",
        children: []
      };
      setCategories((current) => [newCategory, ...current]);
      await adminCatalogApi.createCategory(requestPayload).catch(() => null);
      setPreferredCategoryId(newCategory.id);
      toast.success("Category created");
    }

    setCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleSaveProduct = async (values, files) => {
    try {
      const selectedCategory = categories.find((category) => category.id === values.categoryId);
      const validCategoryRef = isMongoObjectId(selectedCategory?.id) ? selectedCategory.id : undefined;
      const payload = {
        name: values.name,
        brand: values.brand,
        sku: values.sku || undefined,
        category: selectedCategory?.name || values.categoryId,
        categoryRef: validCategoryRef,
        price: values.price,
        originalPrice: values.compareAtPrice || undefined,
        stockQuantity: values.inventory,
        lowStockThreshold: values.lowStockThreshold,
        description: values.description,
        image: values.image || undefined
      };

      if (!editingProduct && !payload.image && !files.length) {
        throw new Error("Add an image URL or upload at least one product image");
      }

      if (editingProduct) {
        const response = await adminCatalogApi.updateProduct(editingProduct.id, payload);
        const savedProduct = response?.product
          ? mapProduct(response.product)
          : mapProduct({
              ...editingProduct,
              ...payload,
              _id: editingProduct.id,
              categoryRef: validCategoryRef
                ? { _id: validCategoryRef, name: selectedCategory?.name }
                : undefined
            });

        setProducts((current) =>
          current.map((product) => (product.id === editingProduct.id ? savedProduct : product))
        );
        toast.success("Product updated");
        return;
      }

      const response = await adminCatalogApi.createProduct(toFormData(payload, files));

      if (!response?.product) {
        throw new Error("Product API did not return the saved product");
      }

      setProducts((current) => [mapProduct(response.product), ...current]);
      toast.success("Product created");
    } catch (error) {
      toast.error(error.message || "Unable to save product");
      throw error;
    }
  };

  return (
    <AdminPage
      eyebrow="Catalog operations"
      title="Product management"
      description="Merchandise products with variants, inventory visibility, rich descriptions, and media management ready for scale."
      actions={
        <RoleGate
          allow={["super_admin", "manager"]}
          fallback={null}
        >
          <Button onClick={() => {
            setEditingProduct(null);
            setPreferredCategoryId("");
            setEditorOpen(true);
          }}>
            <Plus className="h-4 w-4" />
            Add product
          </Button>
        </RoleGate>
      }
    >
      <Surface className="p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            <SearchBar value={search} onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }} placeholder="Search by product name or SKU" />
            <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="max-w-[180px]">
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </Select>
            <Select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="max-w-[180px]">
              <option value="name">Sort: Name</option>
              <option value="price">Sort: Price</option>
              <option value="inventory">Sort: Inventory</option>
            </Select>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
            {filteredProducts.length} products
          </div>
        </div>
      </Surface>

      <DataTable
        columns={[
          { key: "name", label: "Product" },
          { key: "sku", label: "SKU" },
          { key: "category", label: "Category" },
          { key: "brand", label: "Brand" },
          { key: "price", label: "Price", render: (value) => formatMoney(value) },
          { key: "inventory", label: "Inventory" },
          { key: "status", label: "Status", render: (value) => <StatusBadge value={value} /> }
        ]}
        rows={paginatedProducts}
        actions={(row) => (
          <div className="flex justify-end gap-2">
            <Button
              tone="secondary"
              onClick={() => {
                setEditingProduct(row);
                setEditorOpen(true);
              }}
            >
              Edit
            </Button>
            <RoleGate allow={["super_admin", "manager"]}>
              <Button tone="danger" onClick={() => setDeletingProduct(row)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </RoleGate>
          </div>
        )}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Drawer
        open={editorOpen}
        title={editingProduct ? "Edit product" : "Add product"}
        onClose={() => {
          setEditorOpen(false);
          setPreferredCategoryId("");
        }}
      >
        <ProductEditor
          categories={categories}
          initialValues={editingProduct}
          onSubmit={handleSaveProduct}
          onClose={() => {
            setEditorOpen(false);
            setPreferredCategoryId("");
          }}
          onAddCategory={() => openCategoryManager(null)}
          onEditCategory={(categoryId) => openCategoryManager(categoryId)}
          preferredCategoryId={preferredCategoryId}
        />
      </Drawer>

      <CategoryManagerModal
        open={categoryModalOpen}
        category={editingCategory}
        onClose={() => {
          setCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
      />

      <Modal
        open={Boolean(deletingProduct)}
        title="Delete product"
        description="This action removes the product from the admin catalog UI. Connect the backend delete endpoint when you're ready for live deletion."
        onClose={() => setDeletingProduct(null)}
        size="md"
      >
        <div className="flex justify-end gap-3">
          <Button tone="secondary" onClick={() => setDeletingProduct(null)}>
            Cancel
          </Button>
          <Button
            tone="danger"
            onClick={async () => {
              const current = deletingProduct;
              setProducts((items) => items.filter((product) => product.id !== current.id));
              setDeletingProduct(null);
              await adminCatalogApi.deleteProduct(current.id).catch(() => null);
              toast.success("Product deleted");
            }}
          >
            Confirm delete
          </Button>
        </div>
      </Modal>
    </AdminPage>
  );
};

export default ProductsPage;
