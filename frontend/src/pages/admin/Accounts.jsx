import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Sidebar from "../../components/common/Sidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import accountService from "../../services/accountService";
import { formatCurrency, formatDateOnly } from "../../utils/formatCurrency";
import { FiCreditCard, FiCheckCircle, FiXCircle, FiCheck } from "react-icons/fi";
const AdminAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await accountService.getAllAccounts();
      setAccounts(data.accounts);
    } catch (error) {
      toast.error("Failed to load accounts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (accountNumber) => {
    try {
      await accountService.approveAccount(accountNumber);
      toast.success("Account approved successfully!");
      fetchAccounts();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to approve account"
      );
    }
  };

  const handleReject = async (accountNumber) => {
    try {
      await accountService.rejectAccount(accountNumber);
      toast.success("Account rejected!");
      fetchAccounts();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to reject account"
      );
    }
  };

  const handleActivate = async (accountNumber) => {
    try {
      await accountService.activateAccount(accountNumber);
      toast.success("Account activated!");
      fetchAccounts();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to activate account"
      );
    }
  };

  const handleDeactivate = async (accountNumber) => {
    try {
      await accountService.deactivateAccount(accountNumber);
      toast.success("Account deactivated!");
      fetchAccounts();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to deactivate account"
      );
    }
  };

  const getStatusColor = (status) => {
    const map = {
      ACTIVE: "var(--success)",
      REQUESTED: "var(--accent)",
      REJECTED: "var(--danger)",
      DEACTIVATED: "var(--text-light)",
      AT_RISK: "#f97316",
    };
    return map[status] || "var(--text-light)";
  };

  const filteredAccounts = accounts.filter((a) => {
    const matchesSearch =
      a.accountNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      a.customerId
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          className="mb-4"
        >
          <h4
            style={{
              fontWeight: "800",
              color: "var(--text)",
              marginBottom: "0.25rem",
            }}
          >
            <FiCreditCard/> Account Management
          </h4>
          <p style={{ color: "var(--text-light)", margin: 0 }}>
            Manage all customer accounts
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="d-flex gap-3 mb-4 flex-wrap"
        >
          {[
            {
              label: "Total",
              value: accounts.length,
              color: "var(--secondary)",
            },
            {
              label: "Active",
              value: accounts.filter(
                (a) => a.status === "ACTIVE"
              ).length,
              color: "var(--success)",
            },
            {
              label: "Requested",
              value: accounts.filter(
                (a) => a.status === "REQUESTED"
              ).length,
              color: "var(--accent)",
            },
            {
              label: "AT Risk",
              value: accounts.filter(
                (a) => a.status === "AT_RISK"
              ).length,
              color: "#f97316",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="myfin-card"
              style={{
                flex: 1,
                minWidth: "100px",
                borderLeft: `4px solid ${stat.color}`,
                padding: "0.75rem 1rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-light)",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontWeight: "800",
                  fontSize: "1.5rem",
                  color: stat.color,
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Search + Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="myfin-card mb-3"
          style={{ padding: "1rem" }}
        >
          <div className="d-flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Search by account number or customer ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="myfin-input"
              style={{ flex: 1, minWidth: "200px" }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="myfin-input"
              style={{ width: "auto" }}
            >
              <option value="ALL">All Status</option>
              <option value="REQUESTED">Requested</option>
              <option value="ACTIVE">Active</option>
              <option value="AT_RISK">AT Risk</option>
              <option value="DEACTIVATED">Deactivated</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </motion.div>

        {/* Accounts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="myfin-card"
          style={{ padding: 0, overflow: "hidden" }}
        >
          <table className="table myfin-table mb-0">
            <thead>
              <tr>
                <th style={{ padding: "1rem" }}>
                  Account Number
                </th>
                <th>Customer ID</th>
                <th>Type</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "var(--text-light)",
                    }}
                  >
                    No accounts found
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account) => (
                  <tr key={account.accountNumber}>
                    <td
                      style={{
                        padding: "0.75rem 1rem",
                        fontWeight: "600",
                        fontSize: "0.875rem",
                      }}
                    >
                      {account.accountNumber}
                      {account.approvedByName && (
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: "var(--success)",
                            fontWeight: "400",
                          }}
                        >
                          <FiCheckCircle style={{ color: "var(--success)", marginRight: "4px" }} /> {account.approvedByName}
                        </div>
                      )}
                      {account.rejectedByName && (
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: "var(--danger)",
                            fontWeight: "400",
                          }}
                        >
                          <FiXCircle style={{ color: "var(--danger)", marginRight: "4px" }} /> {account.rejectedByName}
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-light)",
                      }}
                    >
                      {account.customerId}
                    </td>
                    <td>
                      <span
                        style={{
                          background:
                            account.accountType === "SAVINGS"
                              ? "rgba(30,64,175,0.1)"
                              : "rgba(15,23,42,0.1)",
                          color:
                            account.accountType === "SAVINGS"
                              ? "var(--secondary)"
                              : "var(--text)",
                          borderRadius: "6px",
                          padding: "0.2rem 0.6rem",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                      >
                        {account.accountType}
                      </span>
                    </td>
                    <td style={{ fontWeight: "700" }}>
                      {formatCurrency(account.balance)}
                    </td>
                    <td>
                      <span
                        style={{
                          background: `${getStatusColor(account.status)}20`,
                          color: getStatusColor(account.status),
                          border: `1px solid ${getStatusColor(account.status)}40`,
                          borderRadius: "20px",
                          padding: "0.2rem 0.6rem",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                      >
                        {account.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                        {account.status === "REQUESTED" && (
                          <>
                            <button
                              onClick={() => handleApprove(account.accountNumber)}
                              style={{
                                background: "rgba(16,185,129,0.1)",
                                border: "1px solid rgba(16,185,129,0.3)",
                                color: "var(--success)",
                                borderRadius: "6px",
                                padding: "0.3rem 0.6rem",
                                cursor: "pointer",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                              }}
                            >
                              <FiCheck style={{ marginRight: "4px" }} /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(account.accountNumber)}
                              style={{
                                background: "rgba(239,68,68,0.1)",
                                border: "1px solid rgba(239,68,68,0.3)",
                                color: "var(--danger)",
                                borderRadius: "6px",
                                padding: "0.3rem 0.6rem",
                                cursor: "pointer",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                              }}
                            >
                              <FiXCircle/> Reject
                            </button>
                          </>
                        )}
                        {account.status === "ACTIVE" && (
                          <button
                            onClick={() => handleDeactivate(account.accountNumber)}
                            style={{
                              background: "rgba(239,68,68,0.1)",
                              border: "1px solid rgba(239,68,68,0.3)",
                              color: "var(--danger)",
                              borderRadius: "6px",
                              padding: "0.3rem 0.6rem",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                            }}
                          >
                            Deactivate
                          </button>
                        )}
                        {account.status === "DEACTIVATED" && (
                          <button
                            onClick={() => handleActivate(account.accountNumber)}
                            style={{
                              background: "rgba(16,185,129,0.1)",
                              border: "1px solid rgba(16,185,129,0.3)",
                              color: "var(--success)",
                              borderRadius: "6px",
                              padding: "0.3rem 0.6rem",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                            }}
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAccounts;