import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Sidebar from "../../components/common/Sidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import loanService from "../../services/loanService";
import {
  formatCurrency,
  formatDateOnly,
} from "../../utils/formatCurrency";
import { FiDollarSign, FiCheckCircle, FiXCircle, FiCheck, FiBriefcase } from "react-icons/fi";

const AdminLoans = () => {
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setIsLoading(true);
    try {
      const data = await loanService.getAllLoans();
      setLoans(data.loans);
    } catch (error) {
      toast.error("Failed to load loans");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (loanId) => {
    try {
      await loanService.approveLoan(loanId);
      toast.success("Loan approved successfully!");
      fetchLoans();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to approve loan"
      );
    }
  };

  const handleReject = async (loanId) => {
    try {
      await loanService.rejectLoan(loanId);
      toast.success("Loan rejected!");
      fetchLoans();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to reject loan"
      );
    }
  };

  const getStatusColor = (status) => {
    const map = {
      PENDING: "var(--accent)",
      ACTIVE: "var(--success)",
      REJECTED: "var(--danger)",
      CLOSED: "var(--text-light)",
      APPROVED: "var(--success)",
    };
    return map[status] || "var(--text-light)";
  };

  const filteredLoans = loans.filter((l) => {
    const matchesSearch =
      l.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.accountNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || l.status === statusFilter;
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
            <FiBriefcase /> Loan Management
          </h4>
          <p style={{ color: "var(--text-light)", margin: 0 }}>
            Review and manage loan applications
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="d-flex gap-3 mb-4 flex-wrap"
        >
          {[
            {
              label: "Total",
              value: loans.length,
              color: "var(--secondary)",
            },
            {
              label: "Pending",
              value: loans.filter(
                (l) => l.status === "PENDING"
              ).length,
              color: "var(--accent)",
            },
            {
              label: "Active",
              value: loans.filter(
                (l) => l.status === "ACTIVE"
              ).length,
              color: "var(--success)",
            },
            {
              label: "Closed",
              value: loans.filter(
                (l) => l.status === "CLOSED"
              ).length,
              color: "var(--text-light)",
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
              placeholder="Search by loan ID or account number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="myfin-input"
              style={{ flex: 1, minWidth: "200px" }}
            />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="myfin-input"
              style={{ width: "auto" }}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="REJECTED">Rejected</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </motion.div>

        {/* Loans Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="myfin-card"
          style={{ padding: 0, overflow: "hidden" }}
        >
          <table className="table myfin-table mb-0">
            <thead>
              <tr>
                <th style={{ padding: "1rem" }}>Loan ID</th>
                <th>Account</th>
                <th>Amount</th>
                <th>EMI</th>
                <th>Rate</th>
                <th>Tenure</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "var(--text-light)",
                    }}
                  >
                    No loans found
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.loanId}>
                    <td
                      style={{
                        padding: "0.75rem 1rem",
                        fontWeight: "600",
                        fontSize: "0.875rem",
                      }}
                    >
                      {loan.loanId}
                      {loan.approvedByName && (
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: "var(--success)",
                          }}
                        >
                          <FiCheckCircle style={{ color: "var(--success)", marginRight: "4px" }} /> {loan.approvedByName}
                        </div>
                      )}
                      {loan.rejectedByName && (
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: "var(--danger)",
                          }}
                        >
                          <FiXCircle style={{ color: "var(--danger)", marginRight: "4px" }} /> {loan.rejectedByName}
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-light)",
                      }}
                    >
                      {loan.accountNumber}
                    </td>
                    <td style={{ fontWeight: "700" }}>
                      {formatCurrency(loan.loanAmount)}
                    </td>
                    <td style={{ fontWeight: "600" }}>
                      {formatCurrency(loan.emiAmount)}
                    </td>
                    <td>{loan.interestRate}%</td>
                    <td>{loan.tenureMonths}m</td>
                    <td>
                      <span
                        style={{
                          background: `${getStatusColor(loan.status)}20`,
                          color: getStatusColor(loan.status),
                          border: `1px solid ${getStatusColor(loan.status)}40`,
                          borderRadius: "20px",
                          padding: "0.2rem 0.6rem",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                      >
                        {loan.status}
                      </span>
                    </td>
                    <td>
                      {loan.status === "PENDING" && (
                        <div
                          style={{
                            display: "flex",
                            gap: "0.4rem",
                          }}
                        >
                          <button
                            onClick={() =>
                              handleApprove(loan.loanId)
                            }
                            style={{
                              background:
                                "rgba(16,185,129,0.1)",
                              border:
                                "1px solid rgba(16,185,129,0.3)",
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
                            onClick={() =>
                              handleReject(loan.loanId)
                            }
                            style={{
                              background:
                                "rgba(239,68,68,0.1)",
                              border:
                                "1px solid rgba(239,68,68,0.3)",
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
                        </div>
                      )}
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

export default AdminLoans;