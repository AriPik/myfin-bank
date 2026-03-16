import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { logout } from "../../features/auth/authSlice";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import {
  FiHome, FiCreditCard, FiBookOpen, FiSend,
  FiDollarSign, FiTrendingUp, FiRefreshCw,
  FiUsers, FiMessageSquare, FiUser, FiBarChart2,
  FiLogOut, FiX, FiMenu, FiBriefcase
} from "react-icons/fi";

const customerLinks = [
  { path: "/customer/dashboard", icon: <FiHome />, label: "Dashboard" },
  { path: "/customer/accounts", icon: <FiCreditCard />, label: "Accounts" },
  { path: "/customer/passbook", icon: <FiBookOpen />, label: "Passbook" },
  { path: "/customer/transfer", icon: <FiSend />, label: "Transfer" },
  { path: "/customer/loans", icon: <FiBriefcase />, label: "Loans" },
  { path: "/customer/fixed-deposit", icon: <FiTrendingUp />, label: "Fixed Deposit" },
  { path: "/customer/recurring-deposit", icon: <FiRefreshCw />, label: "Recurring Deposit" },
  { path: "/customer/beneficiaries", icon: <FiUsers />, label: "Beneficiaries" },
  { path: "/customer/support", icon: <FiMessageSquare />, label: "Support" },
  { path: "/customer/profile", icon: <FiUser />, label: "Profile" },
];

const adminLinks = [
  { path: "/admin/dashboard", icon: <FiHome />, label: "Dashboard" },
  { path: "/admin/customers", icon: <FiUsers />, label: "Customers" },
  { path: "/admin/accounts", icon: <FiCreditCard />, label: "Accounts" },
  { path: "/admin/loans", icon: <FiBriefcase />, label: "Loans" },
  { path: "/admin/support", icon: <FiMessageSquare />, label: "Support" },
  { path: "/admin/reports", icon: <FiBarChart2 />, label: "Reports" },
];

const Sidebar = ({ isOpen, onToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const links = isAdmin ? adminLinks : customerLinks;

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate(isAdmin ? "/login/admin" : "/login/customer");
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="sidebar-overlay"
        />
      )}

      <motion.div
        className={`myfin-sidebar ${isOpen ? "open" : ""}`}
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              background:
                "linear-gradient(135deg, #f59e0b, #d97706)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "1.2rem",
              flexShrink: 0,
            }}
          >
            M
          </div>
          <div>
            <div
              style={{
                color: "white",
                fontWeight: "700",
                fontSize: "1rem",
              }}
            >
              MyFin Bank
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.75rem",
              }}
            >
              {isAdmin ? "Admin Portal" : "Customer Portal"}
            </div>
          </div>
        </div>

        {/* User Info */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                background:
                  "linear-gradient(135deg, #1e40af, #3b82f6)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "700",
                fontSize: "1rem",
                flexShrink: 0,
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: "0.875rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.name}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.75rem",
                }}
              >
                {isAdmin ? user?.adminId : user?.customerId}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav
          style={{
            padding: "1rem 0",
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => {
                if (window.innerWidth <= 768) {
                  onToggle();
                }
              }}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span style={{ fontSize: "1.1rem", display: "flex", alignItems: "center" }}>
                {link.icon}
              </span>
              <span style={{ fontSize: "0.9rem" }}>
                {link.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div
          style={{
            padding: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            flexShrink: 0,
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              borderRadius: "10px",
              padding: "0.6rem",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "rgba(239, 68, 68, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "rgba(239, 68, 68, 0.15)";
            }}
          >
            <FiLogOut style={{ fontSize: "1rem" }} /> Logout
          </button>
        </div>
      </motion.div>

      {/* Floating mobile menu button */}
      <button
        onClick={onToggle}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, var(--secondary), var(--primary))",
          border: "none",
          color: "white",
          fontSize: "1.5rem",
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          zIndex: 200,
          display: "none",
        }}
        className="mobile-menu-btn"
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </button>
    </>
  );
};

export default Sidebar;
