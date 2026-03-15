import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, isCustomer, isAdmin } = useAuth();

  if (!isAuthenticated) {
    if (role === "ADMIN") {
      return <Navigate to="/login/admin" replace />;
    }
    return <Navigate to="/login/customer" replace />;
  }

  if (role === "CUSTOMER" && !isCustomer) {
    return <Navigate to="/login/customer" replace />;
  }

  if (role === "ADMIN" && !isAdmin) {
    return <Navigate to="/login/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;