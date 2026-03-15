import { motion } from "framer-motion";
import { formatCurrency, formatDateOnly } from "../../utils/formatCurrency";

const LoanCard = ({ loan, onApprove, onReject }) => {
  const getStatusColor = (status) => {
    const map = {
      PENDING: "var(--accent)",
      ACTIVE: "var(--success)",
      REJECTED: "var(--danger)",
      CLOSED: "var(--text-light)",
    };
    return map[status] || "var(--text-light)";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="myfin-card mb-3"
      style={{
        borderLeft: `4px solid ${getStatusColor(loan.status)}`,
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <div style={{ fontWeight: "700" }}>
            {loan.loanId}
          </div>
          <div
            style={{
              color: "var(--text-light)",
              fontSize: "0.875rem",
            }}
          >
            {loan.accountNumber}
          </div>
        </div>
        <span
          style={{
            background: `${getStatusColor(loan.status)}20`,
            color: getStatusColor(loan.status),
            border: `1px solid ${getStatusColor(loan.status)}40`,
            borderRadius: "20px",
            padding: "0.25rem 0.75rem",
            fontSize: "0.8rem",
            fontWeight: "600",
          }}
        >
          {loan.status}
        </span>
      </div>

      <div className="row">
        {[
          {
            label: "Loan Amount",
            value: formatCurrency(loan.loanAmount),
          },
          {
            label: "EMI",
            value: formatCurrency(loan.emiAmount),
          },
          {
            label: "Interest Rate",
            value: `${loan.interestRate}%`,
          },
          {
            label: "Tenure",
            value: `${loan.tenureMonths} months`,
          },
        ].map((item, index) => (
          <div key={index} className="col-6 mb-2">
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-light)",
              }}
            >
              {item.label}
            </div>
            <div style={{ fontWeight: "700" }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {loan.approvedByName && (
        <div
          style={{
            fontSize: "0.8rem",
            color: "var(--success)",
            marginBottom: "0.5rem",
          }}
        >
          ✅ Approved by {loan.approvedByName}
        </div>
      )}

      {loan.rejectedByName && (
        <div
          style={{
            fontSize: "0.8rem",
            color: "var(--danger)",
            marginBottom: "0.5rem",
          }}
        >
          ❌ Rejected by {loan.rejectedByName}
        </div>
      )}

      {loan.status === "PENDING" && (
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={() => onApprove(loan.loanId)}
            style={{
              flex: 1,
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.3)",
              color: "var(--success)",
              borderRadius: "8px",
              padding: "0.5rem",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.875rem",
            }}
          >
            ✓ Approve
          </button>
          <button
            onClick={() => onReject(loan.loanId)}
            style={{
              flex: 1,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "var(--danger)",
              borderRadius: "8px",
              padding: "0.5rem",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.875rem",
            }}
          >
            ✗ Reject
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default LoanCard;