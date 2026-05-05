import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { adminAuthApi } from "../../lib/adminApi";
import {
  adminLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "../../lib/adminSchemas";
import { Button, Field, Surface, TextInput } from "../../components/AdminUi";
import { useAdminAuth } from "../../context/AdminAuthContext";

const AuthShell = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen bg-gradient-warm px-4 py-10">
    <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl overflow-hidden rounded-[32px] border border-border/70 bg-card/90 shadow-[var(--shadow-xl)] lg:grid-cols-[1.1fr_0.9fr]">
      <div className="hidden flex-col justify-between bg-gradient-hero p-10 lg:flex">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm text-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            ShoppingApp Enterprise Admin
          </div>
          <h1 className="mt-8 max-w-xl font-sans text-5xl font-semibold leading-tight text-foreground">
            Control growth, inventory, and customer experience from one premium workspace.
          </h1>
          <p className="mt-4 max-w-lg text-base text-muted-foreground">
            Production-ready operations tooling with secure admin access, role-aware navigation, and dashboard intelligence built for scale.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            ["Revenue Pulse", "Daily cashflow visibility"],
            ["Low Stock", "Actionable replenishment alerts"],
            ["Audit Trail", "Safer enterprise operations"]
          ].map(([label, copy]) => (
            <div key={label} className="rounded-3xl border border-border/70 bg-card/70 p-4">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="mt-2 text-sm text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center p-6 lg:p-12">
        <Surface className="w-full max-w-lg p-8 sm:p-10">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">{subtitle}</p>
          <h2 className="mt-3 font-sans text-3xl font-semibold text-foreground">{title}</h2>
          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-6 text-sm text-muted-foreground">{footer}</div> : null}
        </Surface>
      </div>
    </div>
  </div>
);

export const AdminLoginPage = () => {
  const { isAuthenticated, login } = useAdminAuth();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "admin@shoppingapp.local",
      password: "Admin@12345"
    }
  });

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      await login(values);
    } catch (error) {
      toast.error(error.message || "Unable to login");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthShell
      title="Admin login"
      subtitle="Secure access"
      footer={
        <p>
          Need help? Contact platform operations or use the{" "}
          <Link to="/admin/forgot-password" className="text-primary">
            password reset flow
          </Link>
          .
        </p>
      }
    >
      <form className="space-y-5" onSubmit={onSubmit}>
        <Field label="Admin email" error={errors.email?.message}>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <TextInput {...register("email")} placeholder="admin@shoppingapp.local" className="pl-10" />
          </div>
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <TextInput {...register("password")} type="password" className="pl-10" />
          </div>
        </Field>
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>JWT session + role validation</span>
          <Link to="/admin/forgot-password" className="text-primary">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full py-3" disabled={submitting}>
          {submitting ? "Signing in..." : "Access admin console"}
        </Button>
      </form>
    </AuthShell>
  );
};

export const AdminForgotPasswordPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" }
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const response = await adminAuthApi.forgotPassword(values);
      toast.success(response.message || "Reset flow started");
    } catch (error) {
      toast.error(error.message || "Unable to send reset link");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthShell
      title="Forgot password"
      subtitle="Account recovery"
      footer={<Link to="/admin/login" className="text-primary">Back to admin login</Link>}
    >
      <form className="space-y-5" onSubmit={onSubmit}>
        <Field label="Admin email" error={errors.email?.message}>
          <TextInput {...register("email")} placeholder="ops@shoppingapp.com" />
        </Field>
        <Button type="submit" className="w-full py-3" disabled={submitting}>
          {submitting ? "Sending..." : "Send reset instructions"}
        </Button>
      </form>
    </AuthShell>
  );
};

export const AdminResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: searchParams.get("token") || "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = handleSubmit(async ({ confirmPassword, ...values }) => {
    setSubmitting(true);
    try {
      await adminAuthApi.resetPassword(values);
      toast.success("Password reset successfully");
    } catch (error) {
      toast.error(error.message || "Unable to reset password");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthShell
      title="Reset password"
      subtitle="Secure credential update"
      footer={<Link to="/admin/login" className="text-primary">Back to admin login</Link>}
    >
      <form className="space-y-5" onSubmit={onSubmit}>
        <Field label="Reset token" error={errors.token?.message}>
          <TextInput {...register("token")} placeholder="Paste your reset token" />
        </Field>
        <Field label="New password" error={errors.password?.message}>
          <TextInput {...register("password")} type="password" />
        </Field>
        <Field label="Confirm password" error={errors.confirmPassword?.message}>
          <TextInput {...register("confirmPassword")} type="password" />
        </Field>
        <Button type="submit" className="w-full py-3" disabled={submitting}>
          {submitting ? "Updating..." : "Reset password"}
        </Button>
      </form>
    </AuthShell>
  );
};
