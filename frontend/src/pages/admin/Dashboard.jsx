import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useAuth from "../../hooks/useAuth";
import axiosInstance from "../../services/axiosInstance";
import { formatCurrency } from "../../utils/formatCurrency";
import toast from "react-hot-toast";
import { FiUsers, FiCreditCard, FiFileText, FiTrendingUp, FiArrowUp, FiArrowDown, FiRefreshCw, FiMessageSquare, FiBarChart2, FiCalendar, FiBriefcase } from "react-icons/fi";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get(
        "/admin/reports/summary"
      );
      setSummary(data.summary);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="myfin-content" style={{ flex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="d-flex justify-content-between align-items-center mb-4"
        >
          <div>
            <h4
              style={{
                fontWeight: "800",
                color: "var(--text)",
                marginBottom: "0.25rem",
              }}
            >
              Welcome, {user?.name}! 👋
            </h4>
            <p
              style={{ color: "var(--text-light)", margin: 0 }}
            >
              {user?.role === "SUPER_ADMIN"
                ? "Super Admin Portal"
                : "Admin Portal"}{" "}
              — {user?.adminId}
            </p>
          </div>
          <div
            style={{
              background: "var(--card)",
              borderRadius: "12px",
              padding: "0.5rem 1rem",
              border: "1px solid var(--border)",
              fontSize: "0.875rem",
              color: "var(--text-light)",
            }}
          >
            <FiCalendar/>{" "}
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <Row className="mb-4">
          {[
            {
              title: "Total Customers",
              value: summary?.customers?.total || 0,
              sub: `${summary?.customers?.active || 0} Active`,
              icon: <FiUsers/>,
              color: "var(--secondary)",
              path: "/admin/customers",
              delay: 0,
            },
            {
              title: "Total Accounts",
              value: summary?.accounts?.total || 0,
              sub: `${summary?.accounts?.atRisk || 0} At Risk`,
              icon: <FiCreditCard />,
              color: "var(--success)",
              path: "/admin/accounts",
              delay: 0.1,
            },
            {
              title: "Active Loans",
              value: summary?.loans?.active || 0,
              sub: `${summary?.loans?.pending || 0} Pending`,
              icon: <FiFileText />,
              color: "var(--accent)",
              path: "/admin/loans",
              delay: 0.2,
            },
            {
              title: "Active FDs",
              value: summary?.fixedDeposits?.active || 0,
              sub: formatCurrency(
                summary?.fixedDeposits?.totalAmount || 0
              ),
              icon: <FiTrendingUp />,
              color: "#8b5cf6",
              path: "/admin/reports",
              delay: 0.3,
            },
          ].map((stat, index) => (
            <Col key={index} xs={12} sm={6} xl={3} className="mb-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stat.delay }}
                whileHover={{ scale: 1.02 }}
                className="stats-card"
                style={{
                  borderLeftColor: stat.color,
                  cursor: "pointer",
                }}
                onClick={() => navigate(stat.path)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p
                      style={{
                        color: "var(--text-light)",
                        fontSize: "0.875rem",
                        margin: 0,
                      }}
                    >
                      {stat.title}
                    </p>
                    <h3
                      style={{
                        fontWeight: "800",
                        color: "var(--text)",
                        margin: "0.25rem 0 0",
                        fontSize: "1.75rem",
                      }}
                    >
                      {stat.value}
                    </h3>
                    <p
                      style={{
                        color: stat.color,
                        fontSize: "0.8rem",
                        margin: 0,
                        fontWeight: "600",
                      }}
                    >
                      {stat.sub}
                    </p>
                  </div>
                  <span style={{ fontSize: "2.5rem", display: "flex", alignItems: "center" }}>
                    {stat.icon}
                  </span>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Second Row Stats */}
        <Row className="mb-4">
          {[
            {
              title: "Total Deposits",
              value: formatCurrency(
                summary?.transactions?.totalDeposits || 0
              ),
              icon: <FiArrowUp />,
              color: "var(--success)",
              delay: 0.4,
            },
            {
              title: "Total Withdrawals",
              value: formatCurrency(
                summary?.transactions?.totalWithdrawals || 0
              ),
              icon: <FiArrowDown />,
              color: "var(--danger)",
              delay: 0.5,
            },
            {
              title: "Outstanding Loans",
              value: formatCurrency(
                summary?.loans?.totalOutstanding || 0
              ),
              icon: <FiBriefcase />,
              color: "var(--accent)",
              delay: 0.6,
            },
            {
              title: "Active RDs",
              value: summary?.recurringDeposits?.active || 0,
              icon: <FiRefreshCw />,
              color: "#06b6d4",
              delay: 0.7,
            },
          ].map((stat, index) => (
            <Col key={index} xs={12} sm={6} xl={3} className="mb-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stat.delay }}
                className="myfin-card"
                style={{
                  borderLeft: `4px solid ${stat.color}`,
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p
                      style={{
                        color: "var(--text-light)",
                        fontSize: "0.875rem",
                        margin: 0,
                      }}
                    >
                      {stat.title}
                    </p>
                    <h5
                      style={{
                        fontWeight: "800",
                        color: stat.color,
                        margin: "0.25rem 0 0",
                      }}
                    >
                      {stat.value}
                    </h5>
                  </div>
                  <span style={{ fontSize: "2rem", display: "flex", alignItems: "center" }}>
                    {stat.icon}
                  </span>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="myfin-card"
        >
          <h5
            style={{
              fontWeight: "700",
              marginBottom: "1rem",
              color: "var(--text)",
            }}
          >
            ⚡ Quick Actions
          </h5>
          <Row>
            {[
              {
                icon: <FiUsers />,
                label: "Manage Customers",
                path: "/admin/customers",
                color: "#3b82f6",
              },
              {
                icon: <FiCreditCard />,
                label: "Manage Accounts",
                path: "/admin/accounts",
                color: "#10b981",
              },
              {
                icon: <FiFileText />,
                label: "Review Loans",
                path: "/admin/loans",
                color: "#f59e0b",
              },
              {
                icon: <FiMessageSquare />,
                label: "Support Tickets",
                path: "/admin/support",
                color: "#8b5cf6",
              },
              {
                icon: <FiBarChart2 />,
                label: "View Reports",
                path: "/admin/reports",
                color: "#ec4899",
              },
            ].map((action, index) => (
              <Col key={index} xs={6} md={4} lg className="mb-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(action.path)}
                  style={{
                    background: `${action.color}15`,
                    border: `1px solid ${action.color}30`,
                    borderRadius: "12px",
                    padding: "1rem 0.5rem",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: "1.75rem", display: "flex", justifyContent: "center" }}>
                    {action.icon}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: action.color,
                      marginTop: "0.25rem",
                    }}
                  >
                    {action.label}
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;