import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RefreshCw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck
} from "lucide-react";
import { toast } from "sonner";
import Layout from "../components/layout/Layout";
import ProductCard from "../components/ProductCard";
import QuickViewModal from "../components/home/QuickViewModal";
import { ProductDetailsSkeleton } from "../components/ProductSkeletons";
import { useAppContext } from "../context/AppContext";

const emptyReviewForm = {
  rating: 5,
  title: "",
  comment: ""
};

const buildProductShareUrl = (product) => {
  if (typeof window === "undefined" || !product) return "";
  return `${window.location.origin}/product/${product.slug || product.id}`;
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, fetchProductDetails, hasInWishlist, isAuthenticated, products, submitProductReview, toggleWishlist } =
    useAppContext();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const [zoom, setZoom] = useState(false);
  const [quick, setQuick] = useState(null);
  const [reviewForm, setReviewForm] = useState(emptyReviewForm);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      setLoading(true);
      try {
        const response = await fetchProductDetails(id);
        if (!active) return;

        setProduct(response.product);
        setReviews(response.reviews);
        setColor(response.product.colors?.[0]?.name || "");
        setSize(response.product.sizes?.[0] || "");
        setImgIdx(0);
      } catch (error) {
        if (active) {
          toast.error(error.message || "Unable to load product");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProduct();
    return () => {
      active = false;
    };
  }, [id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4);
  }, [product, products]);

  const handleReviewChange = (field) => (event) => {
    setReviewForm((current) => ({
      ...current,
      [field]: field === "rating" ? Number(event.target.value) : event.target.value
    }));
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!product) return;
    if (!isAuthenticated) {
      toast.error("Please sign in to leave a review");
      return;
    }

    setSubmittingReview(true);
    try {
      const savedReview = await submitProductReview(product.id, reviewForm);
      const nextReviews = [savedReview, ...reviews.filter((item) => item.id !== savedReview.id)];
      const nextRating =
        nextReviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / Math.max(1, nextReviews.length);

      setReviews(nextReviews);
      setProduct((current) =>
        current
          ? {
              ...current,
              rating: Number(nextRating.toFixed(1)),
              reviews: nextReviews.length
            }
          : current
      );
      setReviewForm(emptyReviewForm);
      toast.success("Review saved");
    } catch (error) {
      toast.error(error.message || "Unable to save review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleShare = async () => {
    if (!product) return;

    const shareUrl = buildProductShareUrl(product);
    const sharePayload = {
      title: product.name,
      text: `Check out ${product.name}${product.brand ? ` by ${product.brand}` : ""}`,
      url: shareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(sharePayload);
        toast.success("Product shared");
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Product link copied");
        return;
      }

      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("Product link copied");
    } catch (error) {
      toast.error(error?.message || "Unable to share this product");
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to continue to checkout");
      navigate("/login");
      return;
    }

    const added = await addToCart(product, { color, size, quantity: qty });
    if (added) {
      navigate("/checkout");
    }
  };

  if (loading) {
    return (
      <Layout>
        <ProductDetailsSkeleton />
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container-luxe py-24 text-center">
          <h1 className="font-display text-4xl">Product not found</h1>
          <p className="mt-3 text-muted-foreground">This item may have been removed or renamed.</p>
          <Link to="/shop" className="mt-8 inline-block rounded-full bg-foreground px-8 py-4 font-medium text-background">
            Back to shop
          </Link>
        </div>
      </Layout>
    );
  }

  const gallery = product.images?.length ? product.images : [product.image].filter(Boolean);

  return (
    <Layout>
      <div className="container-luxe py-6">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="hover:text-primary">
            Shop
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/shop?cat=${product.category.toLowerCase()}`} className="hover:text-primary">
            {product.category}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <div className="container-luxe grid gap-10 pb-16 lg:grid-cols-2 lg:gap-16">
        <div className="grid grid-cols-[80px_1fr] gap-4">
          <div className="flex flex-col gap-3">
            {gallery.map((img, index) => (
              <button
                key={`${img}-${index}`}
                onClick={() => setImgIdx(index)}
                className={`aspect-square overflow-hidden rounded-lg border-2 ${index === imgIdx ? "border-primary" : "border-transparent"}`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          <motion.div
            key={gallery[imgIdx]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl bg-secondary"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <img
              src={gallery[imgIdx]}
              alt={product.name}
              className={`h-full w-full object-cover transition-transform duration-500 ${zoom ? "scale-150" : ""}`}
            />
          </motion.div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-accent">{product.brand}</p>
          <h1 className="mb-4 font-display text-4xl md:text-5xl">{product.name}</h1>
          <div className="mb-6 flex items-center gap-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${index < Math.round(product.rating) ? "fill-accent text-accent" : "text-muted"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} · {reviews.length || product.reviews} reviews
            </span>
          </div>

          <div className="mb-8 flex items-baseline gap-3">
            <span className="font-display text-4xl">${product.price}</span>
            {product.originalPrice ? (
              <>
                <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
                <span className="text-sm font-medium text-destructive">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              </>
            ) : null}
          </div>

          {product.colors?.length > 0 ? (
            <div className="mb-6">
              <p className="mb-3 text-sm font-medium">
                Color: <span className="text-muted-foreground">{color || "Default"}</span>
              </p>
              <div className="flex gap-2">
                {product.colors.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setColor(item.name)}
                    className={`h-10 w-10 rounded-full border-2 transition-smooth ${color === item.name ? "scale-110 border-foreground" : "border-border"}`}
                    style={{ backgroundColor: item.hex }}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {product.sizes?.length > 0 ? (
            <div className="mb-6">
              <div className="mb-3 flex justify-between">
                <p className="text-sm font-medium">Size</p>
                <button className="text-xs underline">Size guide</button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSize(item)}
                    className={`rounded-lg border py-3 text-sm font-medium transition-smooth ${size === item ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className={`text-sm font-medium ${product.inStock ? "text-success" : "text-destructive"}`}>
              {product.inStock ? "In stock" : "Out of stock"}
            </span>
          </div>

          <div className="mb-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => addToCart(product, { color, size, quantity: qty })}
              disabled={!product.inStock}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-foreground font-medium text-background transition-smooth hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingBag className="h-4 w-4" /> Add to bag
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-border transition-smooth hover:bg-secondary"
            >
              <Heart className={`h-5 w-5 ${hasInWishlist(product.id) ? "fill-destructive text-destructive" : ""}`} />
            </button>
            <button
              onClick={handleShare}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-border transition-smooth hover:bg-secondary"
              aria-label={`Share ${product.name}`}
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={handleBuyNow}
            disabled={!product.inStock}
            className="mb-8 w-full rounded-full bg-gradient-gold py-4 font-medium text-accent-foreground transition-smooth hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Buy now
          </button>

          <div className="grid grid-cols-3 gap-4 border-y border-border py-6">
            {[
              { Icon: Truck, title: "Free shipping", detail: "3-5 days" },
              { Icon: ShieldCheck, title: "Protected", detail: "secure checkout" },
              { Icon: RefreshCw, title: "30-day", detail: "returns" }
            ].map(({ Icon, title, detail }) => (
              <div key={title} className="text-center">
                <Icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                <p className="text-xs font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <div className="flex gap-6 border-b border-border">
              {["desc", "specs", "reviews"].map((item) => (
                <button
                  key={item}
                  onClick={() => setTab(item)}
                  className={`-mb-px border-b-2 py-3 text-sm font-medium uppercase tracking-widest ${tab === item ? "border-foreground" : "border-transparent text-muted-foreground"}`}
                >
                  {item === "desc" ? "Description" : item === "specs" ? "Specifications" : "Reviews"}
                </button>
              ))}
            </div>

            <div className="py-6 text-sm leading-relaxed text-muted-foreground">
              {tab === "desc" ? <p>{product.description || "No description available yet."}</p> : null}

              {tab === "specs" ? (
                product.specs?.length > 0 ? (
                  <ul className="space-y-3">
                    {product.specs.map((item) => (
                      <li key={item.label} className="flex justify-between border-b border-border pb-2">
                        <span className="font-medium text-foreground">{item.label}</span>
                        <span>{item.value}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No specifications have been added yet.</p>
                )
              ) : null}

              {tab === "reviews" ? (
                <div className="space-y-8">
                  <form onSubmit={handleReviewSubmit} className="rounded-2xl border border-border bg-card p-5">
                    <h3 className="mb-4 font-display text-2xl text-foreground">Write a review</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="text-sm">
                        <span className="mb-2 block font-medium text-foreground">Rating</span>
                        <select
                          value={reviewForm.rating}
                          onChange={handleReviewChange("rating")}
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none"
                        >
                          {[5, 4, 3, 2, 1].map((value) => (
                            <option key={value} value={value}>
                              {value} star{value > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="text-sm">
                        <span className="mb-2 block font-medium text-foreground">Title</span>
                        <input
                          value={reviewForm.title}
                          onChange={handleReviewChange("title")}
                          placeholder="Short summary"
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none"
                        />
                      </label>
                      <label className="text-sm md:col-span-2">
                        <span className="mb-2 block font-medium text-foreground">Comment</span>
                        <textarea
                          value={reviewForm.comment}
                          onChange={handleReviewChange("comment")}
                          placeholder="Share your experience"
                          rows={4}
                          className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
                        />
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="mt-4 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-smooth hover:bg-primary disabled:opacity-50"
                    >
                      {submittingReview ? "Saving..." : "Submit review"}
                    </button>
                  </form>

                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((item) => (
                        <div key={item.id} className="border-b border-border pb-6">
                          <div className="mb-2 flex justify-between">
                            <p className="font-medium text-foreground">{item.name}</p>
                            <div className="flex">
                              {Array.from({ length: item.rating }).map((_, index) => (
                                <Star key={index} className="h-3 w-3 fill-accent text-accent" />
                              ))}
                            </div>
                          </div>
                          {item.title ? <p className="mb-1 font-medium text-foreground">{item.title}</p> : null}
                          <p>{item.comment}</p>
                          {item.date ? <p className="mt-2 text-xs">{item.date}</p> : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No reviews yet. Be the first to share feedback.</p>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <section className="container-luxe py-16">
        <h2 className="mb-8 font-display text-3xl">You might also like</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} onQuickView={setQuick} />
          ))}
        </div>
      </section>

      <QuickViewModal product={quick} open={Boolean(quick)} onClose={() => setQuick(null)} />
    </Layout>
  );
};

export default ProductDetails;
