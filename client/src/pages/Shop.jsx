import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, Grid3X3, List, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import ProductCard from "../components/ProductCard";
import QuickViewModal from "../components/home/QuickViewModal";
import { ProductCardSkeletonGrid, ProductListSkeleton } from "../components/ProductSkeletons";
import { useAppContext } from "../context/AppContext";

const sortOptions = ["Featured", "Newest", "Price: Low to High", "Price: High to Low", "Top rated"];

const Shop = () => {
  const { brands, categories, products, priceRange, loadingStore } = useAppContext();
  const [params] = useSearchParams();
  const initialQ = params.get("q") || "";
  const initialCat = params.get("cat") || "";

  const [view, setView] = useState("grid");
  const [sort, setSort] = useState(sortOptions[0]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [cat, setCat] = useState(initialCat);
  const [brandSel, setBrandSel] = useState([]);
  const [price, setPrice] = useState([priceRange.min, priceRange.max || 1500]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [q] = useState(initialQ);
  const [quick, setQuick] = useState(null);

  useEffect(() => {
    setPrice([priceRange.min, priceRange.max || 1500]);
  }, [priceRange.max, priceRange.min]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (q) {
      list = list.filter((product) =>
        (product.name + product.brand + product.category + (product.tags || []).join(" "))
          .toLowerCase()
          .includes(q.toLowerCase())
      );
    }
    if (cat) list = list.filter((product) => product.category.toLowerCase() === cat.toLowerCase());
    if (brandSel.length) list = list.filter((product) => brandSel.includes(product.brand));
    list = list.filter((product) => product.price >= price[0] && product.price <= price[1]);
    if (minRating) list = list.filter((product) => product.rating >= minRating);
    if (inStockOnly) list = list.filter((product) => product.inStock);
    if (sort === "Price: Low to High") list.sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") list.sort((a, b) => b.price - a.price);
    if (sort === "Top rated") list.sort((a, b) => b.rating - a.rating);
    if (sort === "Newest") list.sort((a, b) => String(b.id).localeCompare(String(a.id)));
    return list;
  }, [brandSel, cat, inStockOnly, minRating, price, products, q, sort]);

  const Filters = (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4 text-sm font-medium uppercase tracking-widest">Category</h4>
        <ul className="space-y-2">
          <li>
            <button onClick={() => setCat("")} className={`text-sm hover:text-primary ${!cat ? "font-medium text-primary" : ""}`}>
              All
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => setCat(category.name.toLowerCase())}
                className={`flex w-full justify-between text-sm hover:text-primary ${cat === category.name.toLowerCase() ? "font-medium text-primary" : ""}`}
              >
                {category.name} <span className="text-xs text-muted-foreground">{category.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="mb-4 text-sm font-medium uppercase tracking-widest">Price</h4>
        <input
          type="range"
          min={priceRange.min}
          max={priceRange.max || 1500}
          step={10}
          value={price[1]}
          onChange={(event) => setPrice([priceRange.min, Number(event.target.value)])}
          className="w-full accent-primary"
        />
        <div className="mt-2 flex justify-between text-sm text-muted-foreground">
          <span>${price[0]}</span> <span>${price[1]}</span>
        </div>
      </div>
      <div>
        <h4 className="mb-4 text-sm font-medium uppercase tracking-widest">Brand</h4>
        <ul className="space-y-2">
          {brands.map((brand) => (
            <li key={brand}>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={brandSel.includes(brand)}
                  onChange={(event) =>
                    setBrandSel((current) =>
                      event.target.checked ? [...current, brand] : current.filter((item) => item !== brand)
                    )
                  }
                  className="accent-primary"
                />
                {brand}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="mb-4 text-sm font-medium uppercase tracking-widest">Rating</h4>
        <div className="flex flex-wrap gap-2">
          {[4, 4.5, 4.8].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
              className={`rounded-full border px-3 py-1.5 text-xs ${minRating === rating ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
            >
              {rating}+ ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) => setInStockOnly(event.target.checked)}
            className="accent-primary"
          />
          In stock only
        </label>
      </div>
    </div>
  );

  return (
    <Layout>
      <section className="bg-gradient-warm py-12">
        <div className="container-luxe">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">{q ? `Result for "${q}"` : "Shop"}</p>
          <h1 className="font-display text-4xl md:text-5xl">{cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : "All products"}</h1>
          <p className="mt-2 text-muted-foreground">{filtered.length} pieces</p>
        </div>
      </section>

      <div className="container-luxe grid gap-10 py-10 lg:grid-cols-[260px_1fr]">
        <aside className="sticky top-24 hidden self-start lg:block">{Filters}</aside>
        <div>
          <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
            <button onClick={() => setFilterOpen(true)} className="flex items-center gap-2 text-sm font-medium lg:hidden">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            <div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
              {filtered.length} of {products.length} products
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="cursor-pointer appearance-none rounded-full border border-border bg-card py-2 pl-3 pr-8 text-sm outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2" />
              </div>
              <div className="hidden rounded-full border border-border p-1 md:flex">
                <button onClick={() => setView("grid")} className={`rounded-full p-1.5 ${view === "grid" ? "bg-foreground text-background" : ""}`}>
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button onClick={() => setView("list")} className={`rounded-full p-1.5 ${view === "list" ? "bg-foreground text-background" : ""}`}>
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {loadingStore ? (
            view === "grid" ? (
              <ProductCardSkeletonGrid count={6} className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8" />
            ) : (
              <ProductListSkeleton count={5} />
            )
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="mb-2 font-display text-2xl">No results</p>
              <p className="text-muted-foreground">Try adjusting your filters.</p>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} onQuickView={setQuick} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map((product) => (
                <div key={product.id} className="grid grid-cols-[140px_1fr] gap-6 border-b border-border pb-6 md:grid-cols-[220px_1fr]">
                  <div className="aspect-square overflow-hidden rounded-xl bg-secondary">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">{product.brand}</p>
                    <h3 className="my-1 font-display text-2xl">{product.name}</h3>
                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-xl">${product.price}</span>
                      {product.originalPrice ? <span className="text-muted-foreground line-through">${product.originalPrice}</span> : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {filterOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] overflow-y-auto bg-background p-6 lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-2xl">Filters</h3>
                <button onClick={() => setFilterOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              {Filters}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <QuickViewModal product={quick} open={Boolean(quick)} onClose={() => setQuick(null)} />
    </Layout>
  );
};

export default Shop;
