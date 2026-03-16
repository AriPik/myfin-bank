import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import accountService from "../../services/accountService";
import transactionService from "../../services/transactionService";
import loanService from "../../services/loanService";
import { setAccounts } from "../../features/account/accountSlice";
import { formatCurrency, formatDate } from "../../utils/formatCurrency";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { FiCreditCard, FiTag, FiPackage, FiBriefcase, FiBookOpen, FiDollarSign, FiTrendingUp, FiRefreshCw, FiMessageSquare, FiArrowUp, FiArrowDown, FiSend, FiPlusCircle, FiFileText, FiClock,FiCalendar } from "react-icons/fi";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { accounts } = useSelector((state) => state.account);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const accountData = await accountService.getMyAccounts();
      dispatch(setAccounts(accountData.accounts));

      if (accountData.accounts.length > 0) {
        const activeAccount = accountData.accounts.find(
          (a) => a.status === "ACTIVE"
        );
        if (activeAccount) {
          const txnData = await transactionService.getPassbook(
            activeAccount.accountNumber
          );
          setTransactions(txnData.transactions.slice(0, 5));
        }
      }

      const loanData = await loanService.getMyLoans();
      setLoans(
        loanData.loans.filter((l) => l.status === "ACTIVE")
      );
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const totalBalance = accounts
    .filter((a) => a.status === "ACTIVE")
    .reduce((sum, a) => sum + a.balance, 0);

  const activeAccounts = accounts.filter(
    (a) => a.status === "ACTIVE"
  ).length;

  const pendingAccounts = accounts.filter(
    (a) => a.status === "REQUESTED"
  ).length;

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
              Good {getGreeting()}, {user?.name?.split(" ")[0]}!
              👋
            </h4>
            <p style={{ color: "var(--text-light)", margin: 0 }}>
              Here's your financial overview
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
            <FiCalendar /> {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <Row className="mb-4">
          {[
            {
              title: "Total Balance",
              value: formatCurrency(totalBalance),
              icon: <FiTag />,
              color: "var(--secondary)",
              delay: 0,
            },
            {
              title: "Active Accounts",
              value: activeAccounts,
              icon: <FiCreditCard />,
              color: "var(--success)",
              delay: 0.1,
            },
            {
              title: "Active Loans",
              value: loans.length,
              icon: <FiBriefcase />,
              color: "var(--accent)",
              delay: 0.2,
            },
            {
              title: "Pending Requests",
              value: pendingAccounts,
              icon: <FiClock />,
              color: "#8b5cf6",
              delay: 0.3,
            },
          ].map((stat, index) => (
            <Col key={index} xs={12} sm={6} xl={3} className="mb-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stat.delay }}
                className="stats-card"
                style={{ borderLeftColor: stat.color }}
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
                        fontSize: "1.5rem",
                      }}
                    >
                      {stat.value}
                    </h3>
                  </div>
                  <span style={{ fontSize: "2rem" }}>
                    {stat.icon}
                  </span>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>

        <Row className="align-items-stretch">
          {/* Accounts */}
          <Col lg={6} className="mb-4" style={{ display: "flex", flexDirection: "column" }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="myfin-card"
              style={{ height: "100%", maxHeight: "400px", overflowY: "auto" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5
                  style={{
                    fontWeight: "700",
                    margin: 0,
                    color: "var(--text)",
                  }}
                >
                  <FiCreditCard /> My Accounts
                </h5>
                <button
                  onClick={() => navigate("/customer/accounts")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--secondary)",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  View All →
                </button>
              </div>

              {accounts.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "var(--text-light)",
                  }}
                >
                  <div style={{ fontSize: "2rem" }}><FiCreditCard /></div>
                  <p>No accounts yet</p>
                  <button
                    onClick={() =>
                      navigate("/customer/accounts")
                    }
                    className="btn-myfin-primary"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Open Account
                  </button>
                </div>
              ) : (
                accounts.map((account) => (
                  <div
                    key={account.accountNumber}
                    style={{
                      background: "var(--background)",
                      borderRadius: "12px",
                      padding: "1rem",
                      marginBottom: "0.75rem",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div
                          style={{
                            fontWeight: "600",
                            fontSize: "0.875rem",
                          }}
                        >
                          {account.accountNumber}
                        </div>
                        <div
                          style={{
                            color: "var(--text-light)",
                            fontSize: "0.8rem",
                          }}
                        >
                          {account.accountType}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontWeight: "700",
                            color: "var(--secondary)",
                          }}
                        >
                          {formatCurrency(account.balance)}
                        </div>
                        <span
                          className={`badge-${account.status.toLowerCase()}`}
                          style={{ fontSize: "0.7rem" }}
                        >
                          {account.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </Col>

          {/* Recent Transactions */}
          <Col lg={6} className="mb-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="myfin-card"
              style={{ height: "100%", maxHeight: "400px", overflowY: "auto" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5
                  style={{
                    fontWeight: "700",
                    margin: 0,
                    color: "var(--text)",
                  }}
                >
                  <FiBookOpen /> Recent Transactions
                </h5>
                <button
                  onClick={() => navigate("/customer/passbook")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--secondary)",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  View All →
                </button>
              </div>

              {transactions.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "var(--text-light)",
                  }}
                >
                  <div style={{ fontSize: "2rem" }}><FiBookOpen /></div>
                  <p>No transactions yet</p>
                </div>
              ) : (
                transactions.map((txn) => (
                  <div
                    key={txn.txnId}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.75rem 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background:
                            txn.type === "CREDIT"
                              ? "rgba(16,185,129,0.1)"
                              : "rgba(239,68,68,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1rem",
                          flexShrink: 0,
                        }}
                      >
                        {txn.type === "CREDIT" ? <FiArrowUp /> : <FiArrowDown />}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: "600",
                            fontSize: "0.8rem",
                          }}
                        >
                          {txn.transactionCategory}
                        </div>
                        <div
                          style={{
                            color: "var(--text-light)",
                            fontSize: "0.75rem",
                          }}
                        >
                          {formatDate(txn.date)}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontWeight: "700",
                        color:
                          txn.type === "CREDIT"
                            ? "var(--success)"
                            : "var(--danger)",
                        fontSize: "0.9rem",
                      }}
                    >
                      {txn.type === "CREDIT" ? "+" : "-"}
                      {formatCurrency(txn.amount)}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </Col>
        </Row>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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
                icon: <FiPlusCircle />,
                label: "Deposit",
                path: "/customer/accounts",
                color: "#10b981",
              },
              {
                icon: <FiSend />,
                label: "Transfer",
                path: "/customer/transfer",
                color: "#3b82f6",
              },
              {
                icon: <FiFileText />,
                label: "Apply Loan",
                path: "/customer/loans",
                color: "#f59e0b",
              },
              {
                icon: <FiTrendingUp />,
                label: "Fixed Deposit",
                path: "/customer/fixed-deposit",
                color: "#8b5cf6",
              },
              {
                icon: <FiRefreshCw />,
                label: "Recurring Deposit",
                path: "/customer/recurring-deposit",
                color: "#ec4899",
              },
              {
                icon: <FiMessageSquare />,
                label: "Support",
                path: "/customer/support",
                color: "#06b6d4",
              },
            ].map((action, index) => (
              <Col key={index} xs={4} md={2} className="mb-3">
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
                    transition: "all 0.3s ease",
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

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
};

export default Dashboard;