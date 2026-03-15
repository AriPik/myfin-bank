import { formatCurrency, formatDate } from "../../utils/formatCurrency";
import { FiArrowUp, FiArrowDown, FiRefreshCw, FiTrendingUp, FiRepeat, FiDollarSign, FiCreditCard } from "react-icons/fi";
const categoryIcons = {
  DEPOSIT: <FiArrowUp />,
  WITHDRAW: <FiArrowDown />,
  TRANSFER: <FiRefreshCw />,
  FD_INVESTMENT: <FiTrendingUp />,
  RD_INSTALLMENT: <FiRepeat />,
  LOAN_EMI: <FiDollarSign />,
};

const TransactionRow = ({ transaction }) => {
  const { type, transactionCategory, amount, date, description } =
    transaction;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background:
              type === "CREDIT"
                ? "rgba(16,185,129,0.1)"
                : "rgba(239,68,68,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            flexShrink: 0,
          }}
        >
          {categoryIcons[transactionCategory] || <FiCreditCard />}
        </div>
        <div>
          <div
            style={{
              fontWeight: "600",
              fontSize: "0.875rem",
            }}
          >
            {description || transactionCategory}
          </div>
          <div
            style={{
              color: "var(--text-light)",
              fontSize: "0.75rem",
            }}
          >
            {formatDate(date)}
          </div>
        </div>
      </div>
      <div
        style={{
          fontWeight: "700",
          color:
            type === "CREDIT"
              ? "var(--success)"
              : "var(--danger)",
          fontSize: "0.9rem",
        }}
      >
        {type === "CREDIT" ? "+" : "-"}
        {formatCurrency(amount)}
      </div>
    </div>
  );
};

export default TransactionRow;