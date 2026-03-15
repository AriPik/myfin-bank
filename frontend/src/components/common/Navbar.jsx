import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { logout } from "../../features/auth/authSlice";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const Navbar = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAdmin } = useAuth();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate(isAdmin ? "/login/admin" : "/login/customer");
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "var(--card)",
        borderBottom: "1px solid var(--border)",
        padding: "0.75rem 1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "var(--shadow)",
      }}
    >
      {/* Left — Menu toggle for mobile */}
      <button
        onClick={onMenuToggle}
        className="d-md-none"
        style={{
          background: "none",
          border: "none",
          fontSize: "1.5rem",
          cursor: "pointer",
          color: "var(--text)",
        }}
      >
        ☰
      </button>

      {/* Center — Bank name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontWeight: "700",
          color: "var(--text)",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            background:
              "linear-gradient(135deg, #f59e0b, #d97706)",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "0.875rem",
            color: "white",
          }}
        >
          M
        </div>
        MyFin Bank
      </div>

      {/* Right — User info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontWeight: "600",
              fontSize: "0.875rem",
              color: "var(--text)",
            }}
          >
            {user?.name}
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-light)",
            }}
          >
            {isAdmin ? user?.adminId : user?.customerId}
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "var(--danger)",
            borderRadius: "8px",
            padding: "0.4rem 0.75rem",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "0.8rem",
          }}
        >
          Logout
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;