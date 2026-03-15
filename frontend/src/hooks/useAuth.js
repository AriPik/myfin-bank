import { useSelector } from "react-redux";

const useAuth = () => {
  const { user, token } = useSelector((state) => state.auth);

  const isAuthenticated = !!token;
  const isCustomer = user?.role === "CUSTOMER";
  const isAdmin =
    user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  return {
    user,
    token,
    isAuthenticated,
    isCustomer,
    isAdmin,
    isSuperAdmin,
  };
};

export default useAuth;