const TOKEN_KEY = "shoppingapp_admin_token";
const USER_KEY = "shoppingapp_admin_user";
const THEME_KEY = "shoppingapp_admin_theme";

export const adminStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  getUser: () => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(USER_KEY),
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getTheme: () => localStorage.getItem(THEME_KEY) || "light",
  setTheme: (theme) => localStorage.setItem(THEME_KEY, theme)
};
