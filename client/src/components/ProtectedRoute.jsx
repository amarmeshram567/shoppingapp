import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authSyncStatus } = useAppContext();
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded || authSyncStatus === "syncing") {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-border border-t-foreground" />
      </div>
    );
  }

  if (authSyncStatus === "error") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (isSignedIn && !isAuthenticated) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-border border-t-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
