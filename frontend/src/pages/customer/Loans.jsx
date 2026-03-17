import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Sidebar from "../../components/common/Sidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import loanService from "../../services/loanService";
import accountService from "../../services/accountService";
import { setAccounts } from "../../features/account/accountSlice";
import { formatCurrency, formatDateOnly } from "../../utils/formatCurrency";
import { FiDollarSign, FiBarChart2, FiCheckCircle, FiXCircle, FiBriefcase } from "react-icons/fi";

const loanSchema = Yup.object({
  accountNumber: Yup.string().required(
    "Please select an account"
  ),
  loanAmount: Yup.number()
    .min(1000, "Minimum loan amount is ₹1,000")
    .required("Loan amount is required"),
  interestRate: Yup.number()
    .min(1, "Interest rate must be at least 1%")
    .max(30, "Interest rate cannot exceed 30%")
    .required("Interest rate is required"),
  tenureMonths: Yup.number()
    .min(1, "Minimum tenure is 1 month")
    .max(360, "Maximum tenure is 360 months")
    .required("Tenure is required"),
});

const Loans = () => {
  const dispatch = useDispatch();
  const { accounts } = useSelector((state) => state.account);
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [emiPreview, setEmiPreview] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [payments, setPayments] = useState([]);
  const [showPayments, setShowPayments] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const accountData = await accountService.getMyAccounts();
      dispatch(setAccounts(accountData.accounts));
      const loanData = await loanService.getMyLoans();
      setLoans(loanData.loans);
    } catch (error) {
      toast.error("Failed to load loans");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEMI = (principal, annualRate, tenureMonths) => {
    const monthlyRate = annualRate / 100 / 12;
    if (monthlyRate === 0) return principal / tenureMonths;
    const emi =
      (principal *
        monthlyRate *
        Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    return Math.round(emi * 100) / 100;
  };
  const getLoanInterestRate = (amount) => {
    if (!amount || amount <= 0) return "";
    if (amount <= 50000) return 6.0;
    if (amount <= 150000) return 8.5;
    return 12.0;
  };
  const handlePreviewEMI = (values) => {
    if (
      values.loanAmount &&
      values.interestRate &&
      values.tenureMonths
    ) {
      const emi = calculateEMI(
        Number(values.loanAmount),
        Number(values.interestRate),
        Number(values.tenureMonths)
      );
      const totalPayment = emi * Number(values.tenureMonths);
      const totalInterest =
        totalPayment - Number(values.loanAmount);
      setEmiPreview({
        emi,
        totalPayment,
        totalInterest,
      });
    }
  };

  const handleApplyLoan = async (values, { resetForm }) => {
    try {
      await loanService.applyLoan({
        accountNumber: values.accountNumber,
        loanAmount: Number(values.loanAmount),
        interestRate: Number(values.interestRate),
        tenureMonths: Number(values.tenureMonths),
      });
      toast.success(
        "Loan application submitted! Awaiting admin approval."
      );
      setShowForm(false);
      setEmiPreview(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Loan application failed"
      );
    }
  };

  const handleViewPayments = async (loan) => {
    setSelectedLoan(loan);
    try {
      const data = await loanService.getLoanPayments(
        loan.loanId
      );
      setPayments(data.payments);
      setShowPayments(true);
    } catch (error) {
      toast.error("Failed to load payments");
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

  const activeAccounts = accounts.filter(
    (a) => a.status === "ACTIVE"
  );

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
              <FiBriefcase /> Loans
            </h4>
            <p
              style={{ color: "var(--text-light)", margin: 0 }}
            >
              Apply and manage your loans
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(!showForm)}
            className="btn-myfin-primary"
          >
            {showForm ? "✕ Cancel" : "+ Apply for Loan"}
          </motion.button>
        </motion.div>

        {/* Loan Application Form */}
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
              Loan Application
            </h5>

            <Formik
              initialValues={{
                accountNumber: "",
                loanAmount: "",
                interestRate: "",
                tenureMonths: "",
              }}
              validationSchema={loanSchema}
              onSubmit={handleApplyLoan}
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
                        Loan Amount (₹)
                      </label>
                      <Field name="loanAmount">
                        {({ field, form }) => (
                          <input
                            {...field}
                            type="number"
                            className="myfin-input w-100"
                            placeholder="Enter loan amount"
                            onChange={(e) => {
                              form.setFieldValue("loanAmount", e.target.value);
                              const rate = getLoanInterestRate(Number(e.target.value));
                              form.setFieldValue("interestRate", rate);
                            }}
                            onBlur={() => handlePreviewEMI({
                              ...values,
                              interestRate: getLoanInterestRate(Number(values.loanAmount))
                            })}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="loanAmount"
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
                        Interest Rate (% per annum) - Auto
                      </label>
                      <Field name="interestRate">
                        {({ field, form }) => (
                          <input
                            {...field}
                            type="number"
                            readOnly
                            className="myfin-input w-100"
                            style={{ background: "var(--background)", cursor: "not-allowed", opacity: 0.8 }}
                            value={getLoanInterestRate(values.loanAmount) || ""}
                            onChange={() => { }}
                            placeholder="Auto-filled based on amount"
                          />
                        )}
                      </Field>
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
                        onBlur={() => handlePreviewEMI(values)}
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

                  {/* EMI Preview */}
                  {emiPreview && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        background:
                          "linear-gradient(135deg, #1e40af15, #3b82f615)",
                        border: "1px solid #3b82f630",
                        borderRadius: "12px",
                        padding: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "700",
                          marginBottom: "0.75rem",
                          color: "var(--secondary)",
                        }}
                      >
                        <FiBarChart2 /> EMI Preview
                      </div>
                      <div className="row text-center">
                        {[
                          {
                            label: "Monthly EMI",
                            value: formatCurrency(
                              emiPreview.emi
                            ),
                            color: "var(--secondary)",
                          },
                          {
                            label: "Total Payment",
                            value: formatCurrency(
                              emiPreview.totalPayment
                            ),
                            color: "var(--text)",
                          },
                          {
                            label: "Total Interest",
                            value: formatCurrency(
                              emiPreview.totalInterest
                            ),
                            color: "var(--danger)",
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="col-4"
                          >
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
                                fontSize: "1.1rem",
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
                    {isSubmitting
                      ? "Submitting..."
                      : "Submit Application"}
                  </motion.button>
                </Form>
              )}
            </Formik>
          </motion.div>
        )}

        {/* Loans List */}
        {loans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="myfin-card text-center"
            style={{ padding: "3rem" }}
          >
            <div style={{ fontSize: "3rem", display: "flex", justifyContent: "center" }}><FiBriefcase /></div>
            <h5 style={{ marginTop: "1rem" }}>No loans yet</h5>
            <p style={{ color: "var(--text-light)" }}>
              Apply for your first loan
            </p>
          </motion.div>
        ) : (
          loans.map((loan, index) => (
            <motion.div
              key={loan.loanId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="myfin-card mb-3"
            >
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "1rem",
                    }}
                  >
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

              <div className="row mt-3">
                {[
                  {
                    label: "Loan Amount",
                    value: formatCurrency(loan.loanAmount),
                  },
                  {
                    label: "EMI Amount",
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
                  {
                    label: "Remaining",
                    value: formatCurrency(
                      loan.remainingBalance
                    ),
                  },
                  loan.startDate && {
                    label: "Start Date",
                    value: formatDateOnly(loan.startDate),
                  },
                ]
                  .filter(Boolean)
                  .map((item, i) => (
                    <div key={i} className="col-6 col-md-4 mb-2">
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
                          fontSize: "0.9rem",
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Approved/Rejected By */}
              {loan.approvedByName && (
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--success)",
                    marginTop: "0.5rem",
                  }}
                >
                  <FiCheckCircle style={{ color: "var(--success)", marginRight: "4px" }} /> Approved by {loan.approvedByName}  (
                  {loan.approvedBy})
                </div>
              )}
              {loan.rejectedByName && (
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--danger)",
                    marginTop: "0.5rem",
                  }}
                >
                  <FiXCircle style={{ color: "var(--danger)", marginRight: "4px" }} /> Rejected by {loan.rejectedByName} (
                  {loan.rejectedBy})
                </div>
              )}

              {/* View Payments */}
              {loan.status === "ACTIVE" && (
                <button
                  onClick={() => handleViewPayments(loan)}
                  style={{
                    marginTop: "0.75rem",
                    background: "none",
                    border: "1px solid var(--secondary)",
                    color: "var(--secondary)",
                    borderRadius: "8px",
                    padding: "0.4rem 1rem",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                  }}
                >
                  View EMI Schedule →
                </button>
              )}
            </motion.div>
          ))
        )}

        {/* EMI Payments Modal */}
        {showPayments && selectedLoan && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
            onClick={() => setShowPayments(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "var(--card)",
                borderRadius: "16px",
                padding: "1.5rem",
                width: "100%",
                maxWidth: "500px",
                maxHeight: "80vh",
                overflow: "auto",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 style={{ fontWeight: "700", margin: 0 }}>
                  EMI Schedule — {selectedLoan.loanId}
                </h5>
                <button
                  onClick={() => setShowPayments(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: "var(--text-light)",
                  }}
                >
                  ✕
                </button>
              </div>

              {payments.map((payment) => (
                <div
                  key={payment.paymentId}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem",
                    background:
                      payment.status === "PAID"
                        ? "rgba(16,185,129,0.05)"
                        : "var(--background)",
                    borderRadius: "8px",
                    marginBottom: "0.5rem",
                    border: "1px solid",
                    borderColor:
                      payment.status === "PAID"
                        ? "rgba(16,185,129,0.2)"
                        : "var(--border)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "600" }}>
                      EMI #{payment.emiNumber}
                    </div>
                    {payment.paymentDate === "PAID" && payment.paymentDate && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-light)",
                        }}
                      >
                        Paid on{" "}
                        {formatDateOnly(payment.paymentDate)}
                      </div>
                    )}
                  </div>
                  <div className="text-end">
                    <div style={{ fontWeight: "700" }}>
                      {formatCurrency(payment.amount)}
                    </div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color:
                          payment.status === "PAID"
                            ? "var(--success)"
                            : "var(--accent)",
                        fontWeight: "600",
                      }}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loans;