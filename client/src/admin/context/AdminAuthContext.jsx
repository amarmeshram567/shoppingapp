import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { adminAuthApi } from "../lib/adminApi";
import { adminStorage } from "../lib/adminStorage";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(adminStorage.getUser());
  const [token, setToken] = useState(adminStorage.getToken());
  const [checkingAuth, setCheckingAuth] = useState(Boolean(adminStorage.getToken()));
  const [theme, setTheme] = useState(adminStorage.getTheme());
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    adminStorage.setTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!token) {
      setCheckingAuth(false);
      return;
    }

    let active = true;

    adminAuthApi
      .me()
      .then((response) => {
        if (!active) {
          return;
        }

        setUser(response.user);
        adminStorage.setUser(response.user);
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        if (error.statusCode === 401 || error.statusCode === 403) {
          adminStorage.clearAuth();
          setToken(null);
          setUser(null);
          return;
        }

        setUser((current) => current || adminStorage.getUser());
      })
      .finally(() => {
        if (active) {
          setCheckingAuth(false);
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  const login = async (credentials) => {
    const response = await adminAuthApi.login(credentials);
    adminStorage.setToken(response.token);
    adminStorage.setUser(response.user);
    setToken(response.token);
    setUser(response.user);
    toast.success("Welcome back to the admin console");
    navigate("/admin");
    return response;
  };

  const logout = async () => {
    try {
      await adminAuthApi.logout();
    } catch {
      // Client cleanup still happens even if server logout fails.
    }

    adminStorage.clearAuth();
    setToken(null);
    setUser(null);
    toast.success("Signed out");
    navigate("/admin/login");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      checkingAuth,
      isAuthenticated: Boolean(user && token),
      theme,
      setTheme,
      toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
      login,
      logout
    }),
    [checkingAuth, theme, token, user]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }

  return context;
};
