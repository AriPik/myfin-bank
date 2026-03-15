import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Sidebar from "../../components/common/Sidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import transactionService from "../../services/transactionService";
import accountService from "../../services/accountService";
import { setAccounts } from "../../features/account/accountSlice";
import { setTransactions } from "../../features/transaction/transactionSlice";
import {
  formatCurrency,
  formatDate,
} from "../../utils/formatCurrency";
import { FiArrowUp, FiArrowDown, FiRefreshCw, FiTrendingUp, FiRepeat, FiDollarSign, FiBarChart2, FiBookOpen } from "react-icons/fi";

const categoryIcons = {
  DEPOSIT: <FiArrowUp />,
  WITHDRAW: <FiArrowDown />,
  TRANSFER: <FiRefreshCw />,
  FD_INVESTMENT: <FiTrendingUp />,
  RD_INSTALLMENT: <FiRepeat />,
  LOAN_EMI: <FiDollarSign />,
};

const Passbook = () => {
  const dispatch = useDispatch();
  const { accounts } = useSelector((state) => state.account);
  const { transactions } = useSelector(
    (state) => state.transaction
  );
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions(selectedAccount);
    }
  }, [selectedAccount]);

  const fetchAccounts = async () => {
    try {
      const data = await accountService.getMyAccounts();
      dispatch(setAccounts(data.accounts));
      const active = data.accounts.find(
        (a) => a.status === "ACTIVE"
      );
      if (active) setSelectedAccount(active.accountNumber);
    } catch (error) {
      toast.error("Failed to load accounts");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async (accountNumber) => {
    setIsLoading(true);
    try {
      const data =
        await transactionService.getPassbook(accountNumber);
      dispatch(setTransactions(data.transactions));
    } catch (error) {
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions =
    filter === "ALL"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  const totalCredits = transactions
    .filter((t) => t.type === "CREDIT")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = transactions
    .filter((t) => t.type === "DEBIT")
    .reduce((sum, t) => sum + t.amount, 0);

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
            <FiBookOpen/> Passbook
          </h4>
          <p style={{ color: "var(--text-light)", margin: 0 }}>
            View all your transactions
          </p>
        </motion.div>

        {/* Account Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="myfin-card mb-4"
        >
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <div style={{ fontWeight: "600" }}>
              Select Account:
            </div>
            {accounts
              .filter((a) => a.status === "ACTIVE")
              .map((account) => (
                <button
                  key={account.accountNumber}
                  onClick={() => {
                    setSelectedAccount(account.accountNumber);
                  }}
                  style={{
                    background:
                      selectedAccount === account.accountNumber
                        ? "var(--secondary)"
                        : "var(--background)",
                    color:
                      selectedAccount === account.accountNumber
                        ? "white"
                        : "var(--text)",
                    border: "2px solid",
                    borderColor:
                      selectedAccount === account.accountNumber
                        ? "var(--secondary)"
                        : "var(--border)",
                    borderRadius: "10px",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                    transition: "all 0.3s ease",
                  }}
                >
                  {account.accountNumber} (
                  {account.accountType})
                </button>
              ))}
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="d-flex gap-3 mb-4 flex-wrap"
        >
          {[
            {
              label: "Total Credits",
              value: formatCurrency(totalCredits),
              color: "var(--success)",
              icon: <FiArrowUp />,
            },
            {
              label: "Total Debits",
              value: formatCurrency(totalDebits),
              color: "var(--danger)",
              icon: <FiArrowDown />,
            },
            {
              label: "Transactions",
              value: transactions.length,
              color: "var(--secondary)",
              icon: <FiBarChart2 />,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="myfin-card"
              style={{
                flex: 1,
                minWidth: "150px",
                borderLeft: `4px solid ${stat.color}`,
              }}
            >
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-light)",
                }}
              >
                {stat.icon} {stat.label}
              </div>
              <div
                style={{
                  fontWeight: "800",
                  fontSize: "1.25rem",
                  color: stat.color,
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="d-flex gap-2 mb-3"
        >
          {["ALL", "CREDIT", "DEBIT"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background:
                  filter === f
                    ? "var(--secondary)"
                    : "var(--card)",
                color:
                  filter === f ? "white" : "var(--text)",
                border: "2px solid",
                borderColor:
                  filter === f
                    ? "var(--secondary)"
                    : "var(--border)",
                borderRadius: "8px",
                padding: "0.4rem 1rem",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.875rem",
                transition: "all 0.3s ease",
              }}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="myfin-card"
          style={{ padding: 0, overflow: "hidden" }}
        >
          <table
            className="table myfin-table mb-0"
            style={{ margin: 0 }}
          >
            <thead>
              <tr>
                <th style={{ padding: "1rem" }}>
                  Transaction ID
                </th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Balance After</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "var(--text-light)",
                    }}
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn, index) => (
                  <motion.tr
                    key={txn.txnId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    style={{ cursor: "default" }}
                  >
                    <td
                      style={{
                        padding: "1rem",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        color: "var(--text-light)",
                      }}
                    >
                      {txn.txnId}
                    </td>
                    <td>
                      <span>
                        {categoryIcons[txn.transactionCategory]}{" "}
                        {txn.transactionCategory}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          background:
                            txn.type === "CREDIT"
                              ? "rgba(16,185,129,0.1)"
                              : "rgba(239,68,68,0.1)",
                          color:
                            txn.type === "CREDIT"
                              ? "var(--success)"
                              : "var(--danger)",
                          borderRadius: "20px",
                          padding: "0.2rem 0.75rem",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                        }}
                      >
                        {txn.type}
                      </span>
                    </td>
                    <td
                      style={{
                        fontWeight: "700",
                        color:
                          txn.type === "CREDIT"
                            ? "var(--success)"
                            : "var(--danger)",
                      }}
                    >
                      {txn.type === "CREDIT" ? "+" : "-"}
                      {formatCurrency(txn.amount)}
                    </td>
                    <td style={{ fontWeight: "600" }}>
                      {formatCurrency(txn.balanceAfterTxn)}
                    </td>
                    <td
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-light)",
                      }}
                    >
                      {formatDate(txn.date)}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
};

export default Passbook;