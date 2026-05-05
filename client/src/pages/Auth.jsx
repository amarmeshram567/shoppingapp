import { SignIn, SignUp, useAuth, useClerk } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import AnnouncementBar from "../components/layout/AnnouncementBar";
import here from "../assets/hero-1.jpg";
import { useAppContext } from "../context/AppContext";

const Auth = ({ mode }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { isAuthenticated, authSyncStatus, authSyncError, syncClerkAuth } = useAppContext();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";

  useEffect(() => {
    if (isLoaded && isSignedIn && !isAuthenticated && authSyncStatus === "idle") {
      syncClerkAuth();
    }
  }, [authSyncStatus, isAuthenticated, isLoaded, isSignedIn, syncClerkAuth]);

  const titles = {
    login: ["Welcome back", "Sign in to your account"],
    register: ["Create an account", "Join the Lior community"],
    forgot: ["Reset password", "Use Clerk sign in to recover access"]
  };

  const clerkAppearance = {
    elements: {
      rootBox: "w-full",
      card: "shadow-none border border-border bg-card w-full",
      headerTitle: "hidden",
      headerSubtitle: "hidden",
      socialButtonsBlockButton: "rounded-full border-border",
      formButtonPrimary: "bg-foreground text-background hover:bg-primary rounded-full",
      footerActionLink: "text-foreground",
      formFieldInput: "rounded-lg border-border bg-background",
      formFieldLabel: "text-muted-foreground uppercase tracking-widest text-xs",
      identityPreviewText: "text-foreground"
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-foreground">
        Loading authentication...
      </div>
    );
  }

  if (isSignedIn && !isAuthenticated) {
    if (authSyncStatus === "error") {
      return (
        <div className="min-h-screen grid place-items-center bg-background px-6 text-foreground">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center">
            <h1 className="font-display text-3xl">Sign in needs one more step</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {authSyncError || "The app could not finish creating your session."}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => syncClerkAuth()}
                className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-smooth hover:bg-primary"
              >
                Retry sign in
              </button>
              <button
                onClick={() => signOut({ redirectUrl: "/login" })}
                className="rounded-full border border-border px-5 py-3 text-sm font-medium transition-smooth hover:bg-secondary"
              >
                Start over
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen grid place-items-center bg-background text-foreground">
        Finishing sign in...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <div className="flex-1 grid lg:grid-cols-2">
        <div className="hidden lg:block relative">
          <img src={here} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/40 to-transparent" />
          <Link to="/" className="absolute top-8 left-8 font-display text-3xl text-background">
            Lior
          </Link>
          <div className="absolute bottom-12 left-12 text-background">
            <p className="font-display text-3xl leading-tight">
              "Considered objects, considered service."
            </p>
            <p className="text-sm opacity-70 mt-3">- The Lior Manifesto</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-center p-8 lg:p-16"
        >
          <div className="w-full max-w-md">
            <Link to="/" className="lg:hidden block font-display text-3xl text-center mb-10">
              Lior<span className="text-accent">.</span>
            </Link>
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">
              {titles[mode][1]}
            </p>
            <h1 className="font-display text-4xl mb-8">{titles[mode][0]}</h1>
            {mode === "login" ? (
              <SignIn
                routing="hash"
                signUpUrl="/register"
                forceRedirectUrl="/dashboard"
                appearance={clerkAppearance}
              />
            ) : mode === "register" ? (
              <SignUp
                routing="hash"
                signInUrl="/login"
                forceRedirectUrl="/dashboard"
                appearance={clerkAppearance}
              />
            ) : (
              <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
                Password recovery now runs through Clerk.
                <div className="mt-4">
                  <Link to="/login" className="text-foreground story-link">
                    Open sign in and use the forgot password flow
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const Login = () => <Auth mode="login" />;
export const Register = () => <Auth mode="register" />;
export const ForgotPassword = () => <Auth mode="forgot" />;
