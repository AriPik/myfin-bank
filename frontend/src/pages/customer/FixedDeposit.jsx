import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Sidebar from "../../components/common/Sidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import fdService from "../../services/fdService";
import accountService from "../../services/accountService";
import { setAccounts } from "../../features/account/accountSlice";
import {
  formatCurrency,
  formatDateOnly,
} from "../../utils/formatCurrency";
import { FiTrendingUp, FiBarChart2 } from "react-icons/fi";

const fdSchema = Yup.object({
  accountNumber: Yup.string().required(
    "Please select an account"
  ),
  amount: Yup.number()
    .min(1000, "Minimum FD amount is ₹1,000")
    .required("Amount is required"),
  interestRate: Yup.number()
    .min(1, "Interest rate must be at least 1%")
    .max(15, "Interest rate cannot exceed 15%")
    .required("Interest rate is required"),
  tenureMonths: Yup.number()
    .min(1, "Minimum tenure is 1 month")
    .max(120, "Maximum tenure is 120 months")
    .required("Tenure is required"),
});

const FixedDeposit = () => {
  const dispatch = useDispatch();
  const { accounts } = useSelector((state) => state.account);
  const [fds, setFDs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [maturityPreview, setMaturityPreview] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const accountData = await accountService.getMyAccounts();
      dispatch(setAccounts(accountData.accounts));
      const fdData = await fdService.getMyFDs();
      setFDs(fdData.fds);
    } catch (error) {
      toast.error("Failed to load FDs");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMaturity = (amount, rate, months) => {
    const maturity =
      amount + (amount * rate * months) / (100 * 12);
    return Math.round(maturity * 100) / 100;
  };

  const handlePreview = (values) => {
    if (values.amount && values.interestRate && values.tenureMonths) {
      const maturityAmount = calculateMaturity(
        Number(values.amount),
        Number(values.interestRate),
        Number(values.tenureMonths)
      );
      setMaturityPreview({
        maturityAmount,
        interest: maturityAmount - Number(values.amount),
      });
    }
  };

  const handleOpenFD = async (values, { resetForm }) => {
    try {
      await fdService.openFD({
        accountNumber: values.accountNumber,
        amount: Number(values.amount),
        interestRate: Number(values.interestRate),
        tenureMonths: Number(values.tenureMonths),
      });
      toast.success("Fixed deposit opened successfully!");
      setShowForm(false);
      setMaturityPreview(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to open FD"
      );
    }
  };

  const handleLiquidate = async (fdId) => {
    if (
      !window.confirm(
        "Premature liquidation will incur a penalty. Are you sure?"
      )
    )
      return;
    try {
      const data = await fdService.liquidateFD(fdId);
      toast.success(
        `FD liquidated! ₹${data.creditAmount} credited to your account.`
      );
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to liquidate FD"
      );
    }
  };

  const activeAccounts = accounts.filter(
    (a) => a.status === "ACTIVE"
  );

  const getStatusColor = (status) => {
    const map = {
      ACTIVE: "var(--success)",
      MATURED: "var(--secondary)",
      BROKEN: "var(--danger)",
    };
    return map[status] || "var(--text-light)";
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
              <FiTrendingUp/> Fixed Deposits
            </h4>
            <p
              style={{ color: "var(--text-light)", margin: 0 }}
            >
              Grow your savings with fixed deposits
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(!showForm)}
            className="btn-myfin-primary"
          >
            {showForm ? "✕ Cancel" : "+ Open FD"}
          </motion.button>
        </motion.div>

        {/* FD Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="myfin-card mb-4"
          >
            <h5
              style={{
                fontWeight: "700",
                marginBottom: "1.5rem",
              }}
            >
              📋 Open Fixed Deposit
            </h5>
            <Formik
              initialValues={{
                accountNumber: "",
                amount: "",
                interestRate: "",
                tenureMonths: "",
              }}
              validationSchema={fdSchema}
              onSubmit={handleOpenFD}
            >
              {({ isSubmitting, values }) => (
                <Form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label
                        style={{
                          fontWeight: "600",
                          marginBottom: "0.5rem",
                          display: "block",
                        }}
                      >
                        Account
                      </label>
                      <Field
                        name="accountNumber"
                        as="select"
                        className="myfin-input w-100"
                      >
                        <option value="">
                          Select account
                        </option>
                        {activeAccounts.map((a) => (
                          <option
                            key={a.accountNumber}
                            value={a.accountNumber}
                          >
                            {a.accountNumber} 
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="accountNumber"
                        component="div"
                        style={{
                          color: "var(--danger)",
                          fontSize: "0.8rem",
                          marginTop: "0.25rem",
                        }}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label
                        style={{
                          fontWeight: "600",
                          marginBottom: "0.5rem",
                          display: "block",
                        }}
                      >
                        Amount (₹)
                      </label>
                      <Field
                        name="amount"
                        type="number"
                        placeholder="Min ₹1,000"
                        className="myfin-input w-100"
                        onBlur={() => handlePreview(values)}
                      />
                      <ErrorMessage
                        name="amount"
                        component="div"
                        style={{
                          color: "var(--danger)",
                          fontSize: "0.8rem",
                          marginTop: "0.25rem",
                        }}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label
                        style={{
                          fontWeight: "600",
                          marginBottom: "0.5rem",
                          display: "block",
                        }}
                      >
                        Interest Rate (% per annum)
                      </label>
                      <Field
                        name="interestRate"
                        type="number"
                        placeholder="e.g. 7"
                        className="myfin-input w-100"
                        onBlur={() => handlePreview(values)}
                      />
                      <ErrorMessage
                        name="interestRate"
                        component="div"
                        style={{
                          color: "var(--danger)",
                          fontSize: "0.8rem",
                          marginTop: "0.25rem",
                        }}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label
                        style={{
                          fontWeight: "600",
                          marginBottom: "0.5rem",
                          display: "block",
                        }}
                      >
                        Tenure (Months)
                      </label>
                      <Field
                        name="tenureMonths"
                        type="number"
                        placeholder="e.g. 12"
                        className="myfin-input w-100"
                        onBlur={() => handlePreview(values)}
                      />
                      <ErrorMessage
                        name="tenureMonths"
                        component="div"
                        style={{
                          color: "var(--danger)",
                          fontSize: "0.8rem",
                          marginTop: "0.25rem",
                        }}
                      />
                    </div>
                  </div>

                  {/* Maturity Preview */}
                  {maturityPreview && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        background:
                          "linear-gradient(135deg, #10b98115, #34d39915)",
                        border: "1px solid #10b98130",
                        borderRadius: "12px",
                        padding: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "700",
                          marginBottom: "0.75rem",
                          color: "var(--success)",
                        }}
                      >
                        <FiBarChart2/> Maturity Preview
                      </div>
                      <div className="row text-center">
                        {[
                          {
                            label: "Maturity Amount",
                            value: formatCurrency(
                              maturityPreview.maturityAmount
                            ),
                            color: "var(--success)",
                          },
                          {
                            label: "Interest Earned",
                            value: formatCurrency(
                              maturityPreview.interest
                            ),
                            color: "var(--secondary)",
                          },
                        ].map((item, index) => (
                          <div key={index} className="col-6">
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "var(--text-light)",
                              }}
                            >
                              {item.label}
                            </div>
                            <div
                              style={{
                                fontWeight: "800",
                                color: item.color,
                                fontSize: "1.25rem",
                              }}
                            >
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-myfin-primary"
                    style={{ padding: "0.75rem 2rem" }}
                  >
                    {isSubmitting ? "Opening..." : "Open FD"}
                  </motion.button>
                </Form>
              )}
            </Formik>
          </motion.div>
        )}

        {/* FDs List */}
        {fds.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="myfin-card text-center"
            style={{ padding: "3rem" }}
          >
            <div style={{ fontSize: "3rem", display: "flex", justifyContent: "center" }}><FiTrendingUp /></div>
            <h5 style={{ marginTop: "1rem" }}>
              No Fixed Deposits yet
            </h5>
            <p style={{ color: "var(--text-light)" }}>
              Open your first FD to start earning interest
            </p>
          </motion.div>
        ) : (
          <div className="row">
            {fds.map((fd, index) => (
              <div key={fd.fdId} className="col-md-6 mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="myfin-card"
                  style={{
                    borderTop: `4px solid ${getStatusColor(fd.status)}`,
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <div style={{ fontWeight: "700" }}>
                        {fd.fdId}
                      </div>
                      <div
                        style={{
                          color: "var(--text-light)",
                          fontSize: "0.8rem",
                        }}
                      >
                        {fd.accountNumber}
                      </div>
                    </div>
                    <span
                      style={{
                        background: `${getStatusColor(fd.status)}20`,
                        color: getStatusColor(fd.status),
                        border: `1px solid ${getStatusColor(fd.status)}40`,
                        borderRadius: "20px",
                        padding: "0.25rem 0.75rem",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                      }}
                    >
                      {fd.status}
                    </span>
                  </div>

                  <div className="row">
                    {[
                      {
                        label: "Principal",
                        value: formatCurrency(fd.amount),
                      },
                      {
                        label: "Maturity Amount",
                        value: formatCurrency(fd.maturityAmount),
                      },
                      {
                        label: "Interest Rate",
                        value: `${fd.interestRate}%`,
                      },
                      {
                        label: "Tenure",
                        value: `${fd.tenureMonths} months`,
                      },
                      {
                        label: "Start Date",
                        value: formatDateOnly(fd.startDate),
                      },
                      {
                        label: "Maturity Date",
                        value: formatDateOnly(fd.maturityDate),
                      },
                    ].map((item, i) => (
                      <div key={i} className="col-6 mb-2">
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-light)",
                          }}
                        >
                          {item.label}
                        </div>
                        <div
                          style={{
                            fontWeight: "700",
                            fontSize: "0.875rem",
                          }}
                        >
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {fd.status === "ACTIVE" && (
                    <button
                      onClick={() => handleLiquidate(fd.fdId)}
                      style={{
                        marginTop: "0.75rem",
                        background: "none",
                        border: "1px solid var(--danger)",
                        color: "var(--danger)",
                        borderRadius: "8px",
                        padding: "0.4rem 1rem",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.875rem",
                        width: "100%",
                      }}
                    >
                      ⚠️ Premature Liquidation
                    </button>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FixedDeposit;