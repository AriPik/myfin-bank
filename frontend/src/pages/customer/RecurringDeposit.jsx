import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Sidebar from "../../components/common/Sidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import rdService from "../../services/rdService";
import accountService from "../../services/accountService";
import { setAccounts } from "../../features/account/accountSlice";
import {
  formatCurrency,
  formatDateOnly,
} from "../../utils/formatCurrency";
import { FiRefreshCw, FiBarChart2 } from "react-icons/fi";
const rdSchema = Yup.object({
  accountNumber: Yup.string().required(
    "Please select an account"
  ),
  monthlyAmount: Yup.number()
    .min(100, "Minimum monthly amount is ₹100")
    .required("Monthly amount is required"),
  interestRate: Yup.number()
    .min(1, "Interest rate must be at least 1%")
    .max(15, "Interest rate cannot exceed 15%")
    .required("Interest rate is required"),
  tenureMonths: Yup.number()
    .min(3, "Minimum tenure is 3 months")
    .max(120, "Maximum tenure is 120 months")
    .required("Tenure is required"),
});

const RecurringDeposit = () => {
  const dispatch = useDispatch();
  const { accounts } = useSelector((state) => state.account);
  const [rds, setRDs] = useState([]);
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
      const rdData = await rdService.getMyRDs();
      setRDs(rdData.rds);
    } catch (error) {
      toast.error("Failed to load RDs");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMaturity = (monthly, rate, months) => {
    const totalDeposited = monthly * months;
    const maturity =
      totalDeposited +
      (monthly * months * rate * months) / (100 * 12);
    return Math.round(maturity * 100) / 100;
  };
  const getRDInterestRate = (tenure) => {
    if (!tenure || tenure <= 0) return "";
    if (tenure <= 3) return 2.5;
    if (tenure <= 6) return 3.5;
    if (tenure <= 12) return 5.0;
    return 6.0;
  };
  const handlePreview = (values) => {
    if (
      values.monthlyAmount &&
      values.interestRate &&
      values.tenureMonths
    ) {
      const maturityAmount = calculateMaturity(
        Number(values.monthlyAmount),
        Number(values.interestRate),
        Number(values.tenureMonths)
      );
      const totalDeposited =
        Number(values.monthlyAmount) *
        Number(values.tenureMonths);
      setMaturityPreview({
        maturityAmount,
        totalDeposited,
        interest: maturityAmount - totalDeposited,
      });
    }
  };

  const handleOpenRD = async (values, { resetForm }) => {
    try {
      await rdService.openRD({
        accountNumber: values.accountNumber,
        monthlyAmount: Number(values.monthlyAmount),
        interestRate: Number(values.interestRate),
        tenureMonths: Number(values.tenureMonths),
      });
      toast.success(
        "Recurring deposit opened! First installment deducted."
      );
      setShowForm(false);
      setMaturityPreview(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to open RD"
      );
    }
  };

  const handlePayInstallment = async (rdId) => {
    try {
      await rdService.payInstallment(rdId);
      toast.success("Installment paid successfully!");
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to pay installment"
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
              <FiRefreshCw /> Recurring Deposits
            </h4>
            <p
              style={{ color: "var(--text-light)", margin: 0 }}
            >
              Save regularly with recurring deposits
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(!showForm)}
            className="btn-myfin-primary"
          >
            {showForm ? "✕ Cancel" : "+ Open RD"}
          </motion.button>
        </motion.div>

        {/* RD Form */}
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
              📋 Open Recurring Deposit
            </h5>
            <Formik
              initialValues={{
                accountNumber: "",
                monthlyAmount: "",
                interestRate: "",
                tenureMonths: "",
              }}
              validationSchema={rdSchema}
              onSubmit={handleOpenRD}
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
                        Monthly Amount (₹)
                      </label>
                      <Field
                        name="monthlyAmount"
                        type="number"
                        placeholder="Min ₹100"
                        className="myfin-input w-100"
                        onBlur={() => handlePreview(values)}
                      />
                      <ErrorMessage
                        name="monthlyAmount"
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
                      <Field name="interestRate">
                        {({ field, form }) => (
                          <input
                            {...field}
                            type="number"
                            readOnly
                            className="myfin-input w-100"
                            style={{ background: "var(--background)", cursor: "not-allowed", opacity: 0.8 }}
                            value={getRDInterestRate(values.tenureMonths) || ""}
                            onChange={() => { }}
                            placeholder="Auto-filled based on tenure"
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
                      <Field name="tenureMonths">
                        {({ field, form }) => (
                          <input
                            {...field}
                            type="number"
                            className="myfin-input w-100"
                            placeholder="Min 3 months"
                            onChange={(e) => {
                              form.setFieldValue("tenureMonths", e.target.value);
                              const rate = getRDInterestRate(Number(e.target.value));
                              form.setFieldValue("interestRate", rate);
                            }}
                            onBlur={() => handlePreview({
                              ...values,
                              interestRate: getRDInterestRate(Number(values.tenureMonths))
                            })}
                          />
                        )}
                      </Field>
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
                        <FiBarChart2 /> Maturity Preview
                      </div>
                      <div className="row text-center">
                        {[
                          {
                            label: "Total Deposited",
                            value: formatCurrency(
                              maturityPreview.totalDeposited
                            ),
                            color: "var(--text)",
                          },
                          {
                            label: "Interest Earned",
                            value: formatCurrency(
                              maturityPreview.interest
                            ),
                            color: "var(--secondary)",
                          },
                          {
                            label: "Maturity Amount",
                            value: formatCurrency(
                              maturityPreview.maturityAmount
                            ),
                            color: "var(--success)",
                          },
                        ].map((item, index) => (
                          <div key={index} className="col-4">
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
                                fontSize: "1rem",
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
                    {isSubmitting ? "Opening..." : "Open RD"}
                  </motion.button>
                </Form>
              )}
            </Formik>
          </motion.div>
        )}

        {/* RDs List */}
        {rds.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="myfin-card text-center"
            style={{ padding: "3rem" }}
          >
            <div style={{ fontSize: "3rem", display: "flex", justifyContent: "center" }}><FiRefreshCw /></div>
            <h5 style={{ marginTop: "1rem" }}>
              No Recurring Deposits yet
            </h5>
            <p style={{ color: "var(--text-light)" }}>
              Start saving regularly with an RD
            </p>
          </motion.div>
        ) : (
          <div className="row">
            {rds.map((rd, index) => (
              <div key={rd.rdId} className="col-md-6 mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="myfin-card"
                  style={{
                    borderTop: `4px solid ${getStatusColor(rd.status)}`,
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <div style={{ fontWeight: "700" }}>
                        {rd.rdId}
                      </div>
                      <div
                        style={{
                          color: "var(--text-light)",
                          fontSize: "0.8rem",
                        }}
                      >
                        {rd.accountNumber}
                      </div>
                    </div>
                    <span
                      style={{
                        background: `${getStatusColor(rd.status)}20`,
                        color: getStatusColor(rd.status),
                        border: `1px solid ${getStatusColor(rd.status)}40`,
                        borderRadius: "20px",
                        padding: "0.25rem 0.75rem",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                      }}
                    >
                      {rd.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div
                      className="d-flex justify-content-between"
                      style={{
                        fontSize: "0.8rem",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <span style={{ color: "var(--text-light)" }}>
                        Progress
                      </span>
                      <span style={{ fontWeight: "600" }}>
                        {rd.paidInstallments}/{rd.tenureMonths}{" "}
                        installments
                      </span>
                    </div>
                    <div
                      style={{
                        height: "8px",
                        background: "var(--border)",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(rd.paidInstallments / rd.tenureMonths) * 100}%`,
                        }}
                        transition={{ duration: 1, delay: 0.5 }}
                        style={{
                          height: "100%",
                          background: getStatusColor(rd.status),
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  </div>

                  <div className="row">
                    {[
                      {
                        label: "Monthly Amount",
                        value: formatCurrency(rd.monthlyAmount),
                      },
                      {
                        label: "Interest Rate",
                        value: `${rd.interestRate}%`,
                      },
                      {
                        label: "Start Date",
                        value: formatDateOnly(rd.startDate),
                      },
                      {
                        label: "Maturity Date",
                        value: formatDateOnly(rd.maturityDate),
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

                  {rd.status === "ACTIVE" &&
                    rd.paidInstallments < rd.tenureMonths && (
                      <button
                        onClick={() =>
                          handlePayInstallment(rd.rdId)
                        }
                        className="btn-myfin-primary w-100"
                        style={{
                          marginTop: "0.75rem",
                          padding: "0.5rem",
                          fontSize: "0.875rem",
                        }}
                      >
                        Pay Next Installment (
                        {formatCurrency(rd.monthlyAmount)})
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

export default RecurringDeposit;