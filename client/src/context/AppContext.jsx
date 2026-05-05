import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { toast } from "sonner";
import { storeApi } from "../lib/storeApi";
import {
  normalizeCart,
  normalizeOrder,
  normalizeProduct,
  normalizeReview,
  normalizeUser,
  normalizeWishlistProducts
} from "../lib/storeAdapters";

export const AppContext = createContext();

const readStoredUser = () => {
  try {
    const rawUser = localStorage.getItem("lior_user");
    return rawUser ? normalizeUser(JSON.parse(rawUser)) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const AppContextProvider = ({ children }) => {
  const { getToken, isLoaded: clerkLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const clerkSyncAttemptedRef = useRef(false);
  const logoutInProgressRef = useRef(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("lior_token"));
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [filters, setFilters] = useState({
    brands: [],
    categories: [],
    minPrice: 0,
    maxPrice: 1500
  });
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState({
    items: [],
    summary: { subtotal: 0, shippingFee: 0, tax: 0, total: 0 }
  });
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(() => readStoredUser());
  const [loadingStore, setLoadingStore] = useState(true);
  const [authSyncStatus, setAuthSyncStatus] = useState("idle");
  const [authSyncError, setAuthSyncError] = useState("");

  const isAuthenticated = Boolean(authToken);

  const resetLocalAuthState = () => {
    clerkSyncAttemptedRef.current = false;
    localStorage.removeItem("lior_token");
    localStorage.removeItem("lior_user");
    setAuthToken(null);
    setProfile(null);
  };

  const syncClerkAuth = async () => {
    if (!clerkLoaded || !isSignedIn || logoutInProgressRef.current || authToken) {
      return false;
    }

    setAuthSyncStatus("syncing");
    setAuthSyncError("");
    clerkSyncAttemptedRef.current = true;

    try {
      const clerkToken = await getToken();

      if (!clerkToken) {
        clerkSyncAttemptedRef.current = false;
        setAuthSyncStatus("error");
        setAuthSyncError("Clerk session token is missing.");
        return false;
      }

      const response = await storeApi.authenticateWithClerk(clerkToken);
      setAuthenticatedUser(response.token, response.user);
      setAuthSyncStatus("success");
      return true;
    } catch (error) {
      clerkSyncAttemptedRef.current = false;
      setAuthSyncStatus("error");
      setAuthSyncError(error.message || "Unable to complete sign in.");
      toast.error(error.message || "Unable to sync Clerk session");
      return false;
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const syncAuthToken = () => setAuthToken(localStorage.getItem("lior_token"));

    window.addEventListener("storage", syncAuthToken);
    window.addEventListener("lior-auth-changed", syncAuthToken);

    return () => {
      window.removeEventListener("storage", syncAuthToken);
      window.removeEventListener("lior-auth-changed", syncAuthToken);
    };
  }, []);

  useEffect(() => {
    if (!clerkLoaded) {
      return;
    }

    let active = true;

    const syncClerkSession = async () => {
      if (!isSignedIn) {
        logoutInProgressRef.current = false;
        clerkSyncAttemptedRef.current = false;
        setAuthSyncStatus("idle");
        setAuthSyncError("");
        localStorage.removeItem("lior_token");
        localStorage.removeItem("lior_user");
        if (!active) return;
        setAuthToken(null);
        setProfile(null);
        return;
      }

      if (logoutInProgressRef.current || authToken || clerkSyncAttemptedRef.current) {
        return;
      }

      await syncClerkAuth();
    };

    syncClerkSession();

    return () => {
      active = false;
    };
  }, [authToken, clerkLoaded, isSignedIn]);

  useEffect(() => {
    let active = true;

    const loadStore = async () => {
      setLoadingStore(true);

      try {
        const [productRes, featuredRes, filtersRes] = await Promise.all([
          storeApi.products({ limit: 50 }),
          storeApi.featuredProducts({ limit: 8 }),
          storeApi.productFilters()
        ]);

        if (!active) return;

        setProducts((productRes.products || []).map(normalizeProduct));
        setFeaturedProducts((featuredRes.products || []).map(normalizeProduct));
        setFilters({
          brands: filtersRes.brands || [],
          categories: filtersRes.categories || [],
          minPrice: filtersRes.minPrice || 0,
          maxPrice: filtersRes.maxPrice || 1500
        });

        if (authToken) {
          try {
            const [meRes, wishlistRes, cartRes, ordersRes] = await Promise.all([
              storeApi.me(),
              storeApi.wishlist(),
              storeApi.cart(),
              storeApi.myOrders()
            ]);

            if (!active) return;

            const nextProfile = normalizeUser(meRes.user);
            setProfile(nextProfile);
            localStorage.setItem("lior_user", JSON.stringify(nextProfile));
            setWishlist(normalizeWishlistProducts(wishlistRes.wishlist || []));
            setCart(normalizeCart(cartRes.cart));
            setOrders((ordersRes.orders || []).map(normalizeOrder));
          } catch (error) {
            if (!active) return;

            if (error.statusCode === 401 || error.statusCode === 403) {
              resetLocalAuthState();
              setAuthSyncStatus(isSignedIn ? "idle" : "error");
              setAuthSyncError(isSignedIn ? "" : "Your session expired. Please sign in again.");
              setWishlist([]);
              setCart({
                items: [],
                summary: { subtotal: 0, shippingFee: 0, tax: 0, total: 0 }
              });
              setOrders([]);
            } else {
              setProfile((current) => current || readStoredUser());
            }
          }
        } else {
          setProfile(null);
          localStorage.removeItem("lior_user");
          setWishlist([]);
          setCart({
            items: [],
            summary: { subtotal: 0, shippingFee: 0, tax: 0, total: 0 }
          });
          setOrders([]);
        }
      } catch (error) {
        if (active) {
          console.error(error);
        }
      } finally {
        if (active) {
          setLoadingStore(false);
        }
      }
    };

    loadStore();

    return () => {
      active = false;
    };
  }, [authToken]);

  const toggleTheme = () => setTheme((current) => (current === "light" ? "dark" : "light"));

  const setAuthenticatedUser = (token, user) => {
    clerkSyncAttemptedRef.current = true;
    setAuthSyncError("");
    const nextUser = normalizeUser(user);
    localStorage.setItem("lior_token", token);
    localStorage.setItem("lior_user", JSON.stringify(nextUser));
    setAuthToken(token);
    setProfile(nextUser);
    window.dispatchEvent(new Event("lior-auth-changed"));
  };

  const logout = async () => {
    logoutInProgressRef.current = true;

    try {
      await storeApi.logout();
    } catch (error) {
      console.error(error);
    } finally {
      clerkSyncAttemptedRef.current = true;
      setAuthSyncStatus("idle");
      setAuthSyncError("");
      localStorage.removeItem("lior_token");
      localStorage.removeItem("lior_user");
      setAuthToken(null);
      setProfile(null);
      setWishlist([]);
      setOrders([]);
      setCart({
        items: [],
        summary: { subtotal: 0, shippingFee: 0, tax: 0, total: 0 }
      });
      window.dispatchEvent(new Event("lior-auth-changed"));
    }

    if (clerkLoaded && isSignedIn) {
      try {
        await signOut({ redirectUrl: "/login" });
      } catch (error) {
        console.error(error);
        logoutInProgressRef.current = false;
      }
      return;
    }

    logoutInProgressRef.current = false;
  };

  const refreshProfile = async () => {
    if (!authToken) return null;
    const response = await storeApi.me();
    const nextProfile = normalizeUser(response.user);
    setProfile(nextProfile);
    localStorage.setItem("lior_user", JSON.stringify(nextProfile));
    return nextProfile;
  };

  const saveProfile = async (payload) => {
    const response = await storeApi.updateProfile(payload);
    const nextProfile = normalizeUser(response.user);
    setProfile(nextProfile);
    localStorage.setItem("lior_user", JSON.stringify(nextProfile));
    return nextProfile;
  };

  const saveAddress = async (payload, addressId) => {
    const response = addressId
      ? await storeApi.updateAddress(addressId, payload)
      : await storeApi.addAddress(payload);

    setProfile((current) => {
      if (!current) return current;
      const nextProfile = {
        ...current,
        addresses: response.addresses || []
      };
      localStorage.setItem("lior_user", JSON.stringify(nextProfile));
      return nextProfile;
    });

    return response.addresses || [];
  };

  const removeAddress = async (addressId) => {
    const response = await storeApi.deleteAddress(addressId);
    setProfile((current) => {
      if (!current) return current;
      const nextProfile = {
        ...current,
        addresses: response.addresses || []
      };
      localStorage.setItem("lior_user", JSON.stringify(nextProfile));
      return nextProfile;
    });

    return response.addresses || [];
  };

  const savePaymentMethod = async (payload) => {
    const response = await storeApi.addPaymentMethod(payload);
    setProfile((current) => {
      if (!current) return current;
      const nextProfile = {
        ...current,
        paymentMethods: response.paymentMethods || []
      };
      localStorage.setItem("lior_user", JSON.stringify(nextProfile));
      return nextProfile;
    });

    return response.paymentMethods || [];
  };

  const removePaymentMethod = async (paymentMethodId) => {
    const response = await storeApi.deletePaymentMethod(paymentMethodId);
    setProfile((current) => {
      if (!current) return current;
      const nextProfile = {
        ...current,
        paymentMethods: response.paymentMethods || []
      };
      localStorage.setItem("lior_user", JSON.stringify(nextProfile));
      return nextProfile;
    });

    return response.paymentMethods || [];
  };

  const addToCart = async (product, options = {}) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to use cart");
      return false;
    }

    try {
      const response = await storeApi.addCartItem({
        productId: product.id,
        quantity: options.quantity ?? 1,
        color: options.color ?? "",
        size: options.size ?? ""
      });
      setCart(normalizeCart(response.cart));
      toast.success("Added to cart", { description: product.name });
      return true;
    } catch (error) {
      toast.error(error.message || "Unable to add item");
      return false;
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      const response = await storeApi.removeCartItem(itemId);
      setCart(normalizeCart(response.cart));
      toast.success("Removed from cart");
    } catch (error) {
      toast.error(error.message || "Unable to remove item");
    }
  };

  const updateQty = async (itemId, quantity) => {
    try {
      const response = await storeApi.updateCartItem(itemId, { quantity: Math.max(1, quantity) });
      setCart(normalizeCart(response.cart));
      toast.success("Quantity updated");
    } catch (error) {
      toast.error(error.message || "Unable to update quantity");
    }
  };

  const clear = async () => {
    try {
      const response = await storeApi.clearCart();
      setCart(normalizeCart(response.cart));
      toast.success("Cart cleared");
    } catch (error) {
      toast.error(error.message || "Unable to clear cart");
    }
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to use wishlist");
      return;
    }

    try {
      const response = await storeApi.toggleWishlist(product.id);
      setWishlist(normalizeWishlistProducts(response.wishlist || []));
      toast.success(response.message || "Wishlist updated", { description: product.name });
    } catch (error) {
      toast.error(error.message || "Unable to update wishlist");
    }
  };

  const hasInWishlist = (id) => wishlist.some((item) => item.id === id);

  const removeFromWishlist = async (id) => {
    const product = wishlist.find((item) => item.id === id);
    if (product) {
      await toggleWishlist(product);
    }
  };

  const validateCoupon = (code, subtotal) => storeApi.validateCoupon({ code, subtotal });

  const placeOrder = async (payload) => {
    const response = await storeApi.createOrder(payload);
    setOrders((current) => [normalizeOrder(response.order), ...current]);
    const cartRes = await storeApi.cart();
    setCart(normalizeCart(cartRes.cart));
    return response.order;
  };

  const refreshOrders = async () => {
    if (!isAuthenticated) return;
    const response = await storeApi.myOrders();
    setOrders((response.orders || []).map(normalizeOrder));
  };

  const fetchProductDetails = async (idOrSlug) => {
    const response = await storeApi.productDetail(idOrSlug);
    return {
      product: normalizeProduct(response.product),
      reviews: (response.reviews || []).map(normalizeReview)
    };
  };

  const submitProductReview = async (productId, payload) => {
    const response = await storeApi.addReview(productId, payload);
    return normalizeReview(response.review);
  };
  const categories = useMemo(() => {
    const counts = new Map();
    products.forEach((product) => {
      counts.set(product.category, (counts.get(product.category) || 0) + 1);
    });

    return filters.categories.map((category) => {
      const sample = products.find((product) => product.category === category);
      return {
        id: category.toLowerCase(),
        name: category,
        count: counts.get(category) || 0,
        image: sample?.image || ""
      };
    });
  }, [filters.categories, products]);

  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.summary?.subtotal || 0;
  const ids = wishlist.map((item) => item.id);

  const value = {
    items: cart.items,
    count,
    subtotal,
    cartSummary: cart.summary,
    theme,
    toggleTheme,
    addToCart,
    removeCartItem,
    updateQty,
    clear,
    ids,
    toggleWishlist,
    hasInWishlist,
    removeFromWishlist,
    validateCoupon,
    placeOrder,
    refreshOrders,
    refreshProfile,
    saveProfile,
    saveAddress,
    removeAddress,
    savePaymentMethod,
    removePaymentMethod,
    fetchProductDetails,
    submitProductReview,
    setAuthenticatedUser,
    logout,
    products,
    featuredProducts,
    categories,
    brands: filters.brands,
    priceRange: { min: filters.minPrice, max: filters.maxPrice },
    wishlist,
    orders,
    profile,
    isAuthenticated,
    loadingStore,
    authSyncStatus,
    authSyncError,
    syncClerkAuth
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
