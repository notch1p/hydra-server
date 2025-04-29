import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    // Redirect to login page but save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
