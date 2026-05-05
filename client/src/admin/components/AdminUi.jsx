import { Fragment } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  X
} from "lucide-react";

export const cx = (...classes) => classes.filter(Boolean).join(" ");

export const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value || 0);

export const AdminPage = ({ eyebrow, title, description, actions, children }) => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 font-sans text-3xl font-semibold text-foreground">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
    {children}
  </div>
);

export const Surface = ({ className, children }) => (
  <div
    className={cx(
      "rounded-[28px] border border-border/70 bg-card/90 shadow-[var(--shadow-lg)] backdrop-blur-xl",
      className
    )}
  >
    {children}
  </div>
);

export const Button = ({
  children,
  className,
  tone = "primary",
  type = "button",
  ...props
}) => {
  const tones = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-muted border border-border/70",
    ghost: "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
    danger: "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
  };

  return (
    <button
      type={type}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const StatCard = ({ title, value, delta, icon: Icon, accent = "from-primary/25" }) => (
  <Surface className="overflow-hidden p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-4 text-3xl font-semibold text-foreground">{value}</p>
        <p className="mt-2 text-sm text-primary">{delta}</p>
      </div>
      <div className={cx("rounded-2xl bg-gradient-to-br p-3", accent, "to-accent/20")}>
        <Icon className="h-5 w-5 text-foreground" />
      </div>
    </div>
  </Surface>
);

export const StatusBadge = ({ value }) => {
  const normalized = String(value || "").toLowerCase();
  const tones = {
    active: "bg-success/15 text-success",
    approved: "bg-success/15 text-success",
    paid: "bg-success/15 text-success",
    delivered: "bg-success/15 text-success",
    packed: "bg-primary/15 text-primary",
    processing: "bg-primary/15 text-primary",
    draft: "bg-accent/20 text-accent-foreground",
    pending: "bg-accent/20 text-accent-foreground",
    archived: "bg-muted text-muted-foreground",
    rejected: "bg-destructive/10 text-destructive",
    "refund requested": "bg-destructive/10 text-destructive",
    published: "bg-primary/10 text-primary"
  };

  return (
    <span className={cx("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", tones[normalized] || "bg-secondary text-secondary-foreground")}>
      {value}
    </span>
  );
};

export const DataTable = ({ columns, rows, actions, emptyText = "No records found." }) => (
  <Surface className="overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border/60">
        <thead className="bg-secondary/60">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground"
              >
                {column.label}
              </th>
            ))}
            {actions ? (
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Actions
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {rows.length ? (
            rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-secondary/40">
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4 text-sm text-foreground">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {actions ? <td className="px-5 py-4 text-right">{actions(row)}</td> : null}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-5 py-12 text-center text-sm text-muted-foreground"
              >
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </Surface>
);

export const Field = ({ label, hint, error, children }) => (
  <label className="block space-y-2">
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </div>
    {children}
    {error ? <p className="text-xs text-destructive">{error}</p> : null}
  </label>
);

export const TextInput = ({ className, ...props }) => (
  <input
    className={cx(
      "w-full rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:bg-card",
      className
    )}
    {...props}
  />
);

export const TextArea = ({ className, ...props }) => (
  <textarea
    className={cx(
      "min-h-[120px] w-full rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:bg-card",
      className
    )}
    {...props}
  />
);

export const Select = ({ className, children, ...props }) => (
  <select
    className={cx(
      "w-full rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/60",
      className
    )}
    {...props}
  >
    {children}
  </select>
);

export const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <div className="relative w-full max-w-sm">
    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <TextInput value={value} onChange={onChange} placeholder={placeholder} className="pl-10" />
  </div>
);

export const Modal = ({ open, title, description, children, onClose, size = "lg" }) => {
  const sizes = {
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl"
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={cx("w-full", sizes[size])}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
          >
            <Surface className="p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                  {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
                </div>
                <button onClick={onClose} className="rounded-xl p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {children}
            </Surface>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export const Drawer = ({ open, title, children, onClose }) => (
  <AnimatePresence>
    {open ? (
      <motion.div className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div
          className="absolute right-0 top-0 h-full w-full max-w-2xl"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
        >
          <Surface className="h-full overflow-y-auto rounded-none border-l border-border/80 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">{title}</h3>
              <button onClick={onClose} className="rounded-xl p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </Surface>
        </motion.div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);

export const SkeletonBlock = ({ className }) => <div className={cx("skeleton rounded-2xl", className)} />;

export const EmptyState = ({ title, description, action }) => (
  <Surface className="p-8 text-center">
    <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
    <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
    <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
    {action ? <div className="mt-5">{action}</div> : null}
  </Surface>
);

export const ErrorState = ({ message, retry }) => (
  <Surface className="p-8 text-center">
    <p className="text-sm text-destructive">{message}</p>
    {retry ? (
      <Button tone="secondary" className="mt-4" onClick={retry}>
        Try again
      </Button>
    ) : null}
  </Surface>
);

export const Pagination = ({ page, totalPages, onPageChange }) => (
  <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/80 px-4 py-3 text-sm text-muted-foreground">
    <span>
      Page {page} of {totalPages}
    </span>
    <div className="flex gap-2">
      <Button tone="secondary" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1}>
        Previous
      </Button>
      <Button tone="secondary" onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>
        Next
      </Button>
    </div>
  </div>
);

export const Breadcrumbs = () => {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <Link to="/admin" className="transition hover:text-foreground">
        Admin
      </Link>
      {parts.slice(1).map((part, index) => {
        const href = `/${parts.slice(0, index + 2).join("/")}`;
        const label = part
          .split("-")
          .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
          .join(" ");

        return (
          <Fragment key={href}>
            <ChevronRight className="h-4 w-4" />
            <Link to={href} className="transition hover:text-foreground">
              {label}
            </Link>
          </Fragment>
        );
      })}
    </div>
  );
};

export const AdminHeader = ({
  user,
  theme,
  toggleTheme,
  notifications,
  notificationOpen,
  setNotificationOpen,
  onLogout,
  onMenuOpen
}) => (
  <header className="sticky top-0 z-30 mb-6 border-b border-border/60 bg-background/80 px-4 py-4 backdrop-blur-xl sm:px-6">
    <div className="flex items-center gap-3">
      <button
        className="inline-flex rounded-2xl border border-border/70 bg-card/80 p-2.5 text-muted-foreground transition hover:bg-secondary lg:hidden"
        onClick={onMenuOpen}
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <Breadcrumbs />
      </div>
      <div className="relative hidden min-w-[280px] xl:block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <TextInput placeholder="Search orders, products, customers" className="pl-10" />
      </div>
      <button
        onClick={toggleTheme}
        className="rounded-2xl border border-border/70 bg-card/80 p-2.5 text-muted-foreground transition hover:bg-secondary"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
      <div className="relative">
        <button
          onClick={() => setNotificationOpen((value) => !value)}
        className="rounded-2xl border border-border/70 bg-card/80 p-2.5 text-muted-foreground transition hover:bg-secondary"
        >
          <Bell className="h-4 w-4" />
        </button>
        {notifications.some((notification) => !notification.read) ? (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
        ) : null}
        <AnimatePresence>
          {notificationOpen ? (
            <motion.div
              className="absolute right-0 top-14 w-[360px] max-w-[90vw]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
            >
              <Surface className="overflow-hidden p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">Notifications</p>
                  <span className="text-xs text-muted-foreground">{notifications.length} alerts</span>
                </div>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="rounded-2xl border border-border/70 bg-secondary/40 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-foreground">{notification.title}</p>
                        <StatusBadge value={notification.level} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </Surface>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="hidden rounded-2xl border border-border/70 bg-card/80 px-4 py-2 text-right sm:block">
        <p className="text-sm font-medium text-foreground">{user?.name || "Admin User"}</p>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{user?.role?.replace("_", " ") || "super_admin"}</p>
      </div>
      <Button tone="secondary" onClick={onLogout} className="hidden sm:inline-flex">
        Logout
      </Button>
    </div>
  </header>
);

export const Sidebar = ({ items, open, onClose, collapsed }) => {
  const content = (
    <div className="flex h-full min-h-0 flex-col rounded-none border-r border-border/60 bg-gradient-warm px-4 py-6">
      <Link to="/admin" className="mb-8 shrink-0 flex items-center gap-3 px-2">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-glow">
          SA
        </div>
        {!collapsed ? (
          <div>
            <p className="text-base font-semibold text-foreground">ShoppingApp Admin</p>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Enterprise Console</p>
          </div>
        ) : null}
      </Link>
      <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              cx(
                "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition",
                isActive
                  ? "bg-primary/10 text-foreground shadow-[var(--shadow-md)]"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed ? <span>{item.label}</span> : null}
          </NavLink>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      <aside className={cx("hidden h-screen overflow-hidden lg:block", collapsed ? "w-[92px]" : "w-[280px]")}>{content}</aside>
      <AnimatePresence>
        {open ? (
          <motion.div className="fixed inset-0 z-40 bg-foreground/30 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="h-full w-[88vw] max-w-[320px] overflow-hidden" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}>
              {content}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};
