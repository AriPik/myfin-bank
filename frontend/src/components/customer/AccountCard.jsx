import { motion } from "framer-motion";
import { formatCurrency } from "../../utils/formatCurrency";

const AccountCard = ({ account, onDeposit, onWithdraw }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      style={{
        background:
          account.accountType === "SAVINGS"
            ? "linear-gradient(135deg, #1e40af, #3b82f6)"
            : "linear-gradient(135deg, #0f172a, #1e293b)",
        borderRadius: "16px",
        padding: "1.5rem",
        color: "white",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          fontSize: "0.8rem",
          opacity: 0.7,
          marginBottom: "0.25rem",
        }}
      >
        {account.accountType} ACCOUNT
      </div>
      <div
        style={{
          fontWeight: "700",
          fontSize: "1rem",
          letterSpacing: "1px",
          marginBottom: "1rem",
        }}
      >
        {account.accountNumber}
      </div>
      <div
        style={{
          fontSize: "0.8rem",
          opacity: 0.7,
        }}
      >
        Available Balance
      </div>
      <div
        style={{
          fontSize: "1.75rem",
          fontWeight: "800",
          marginBottom: "1rem",
        }}
      >
        {formatCurrency(account.balance)}
      </div>
      <span
        style={{
          background: "rgba(255,255,255,0.2)",
          borderRadius: "20px",
          padding: "0.25rem 0.75rem",
          fontSize: "0.75rem",
          fontWeight: "600",
        }}
      >
        {account.status}
      </span>

      {account.status === "ACTIVE" && (
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            marginTop: "1rem",
          }}
        >
          <button
            onClick={() => onDeposit(account)}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "white",
              borderRadius: "8px",
              padding: "0.5rem",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.875rem",
            }}
          >
            + Deposit
          </button>
          <button
            onClick={() => onWithdraw(account)}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              borderRadius: "8px",
              padding: "0.5rem",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.875rem",
            }}
          >
            - Withdraw
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default AccountCard;