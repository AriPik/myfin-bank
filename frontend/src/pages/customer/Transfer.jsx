import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Sidebar from "../../components/common/Sidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import transactionService from "../../services/transactionService";
import accountService from "../../services/accountService";
import beneficiaryService from "../../services/beneficiaryService";
import { setAccounts } from "../../features/account/accountSlice";
import { formatCurrency } from "../../utils/formatCurrency";
import { FiSend, FiUser, FiCreditCard, FiCheck,FiRefreshCw } from "react-icons/fi";

const transferSchema = Yup.object({
  senderAccountNumber: Yup.string().required(
    "Please select sender account"
  ),
  receiverAccountNumber: Yup.string()
    .required("Receiver account is required")
    .test(
      "not-same",
      "Sender and receiver cannot be same",
      function (value) {
        return value !== this.parent.senderAccountNumber;
      }
    ),
  amount: Yup.number()
    .min(1, "Amount must be greater than 0")
    .required("Amount is required"),
});

const Transfer = () => {
  const dispatch = useDispatch();
  const { accounts } = useSelector((state) => state.account);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recentTransfers, setRecentTransfers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const accountData = await accountService.getMyAccounts();
      dispatch(setAccounts(accountData.accounts));

      const beneficiaryData =
        await beneficiaryService.getMyBeneficiaries();
      setBeneficiaries(
        beneficiaryData.beneficiaries.filter(
          (b) => b.status === "ACTIVE"
        )
      );
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async (values, { resetForm }) => {
    try {
      await transactionService.transfer({
        senderAccountNumber: values.senderAccountNumber,
        receiverAccountNumber: values.receiverAccountNumber,
        amount: Number(values.amount),
      });
      toast.success(
        `₹${values.amount} transferred successfully!`
      );
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Transfer failed"
      );
    }
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
          className="mb-4"
        >
          <h4
            style={{
              fontWeight: "800",
              color: "var(--text)",
              marginBottom: "0.25rem",
            }}
          >
            <FiRefreshCw /> Fund Transfer
          </h4>
          <p style={{ color: "var(--text-light)", margin: 0 }}>
            Transfer money to any account
          </p>
        </motion.div>

        <div className="row">
          {/* Transfer Form */}
          <div className="col-lg-7 mb-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="myfin-card"
            >
              <h5
                style={{
                  fontWeight: "700",
                  marginBottom: "1.5rem",
                  color: "var(--text)",
                }}
              >
                Transfer Details
              </h5>

              <Formik
                initialValues={{
                  senderAccountNumber: "",
                  receiverAccountNumber: "",
                  amount: "",
                }}
                validationSchema={transferSchema}
                onSubmit={handleTransfer}
              >
                {({ isSubmitting, setFieldValue, values }) => (
                  <Form>
                    {/* From Account */}
                    <div className="mb-3">
                      <label
                        style={{
                          fontWeight: "600",
                          marginBottom: "0.5rem",
                          display: "block",
                        }}
                      >
                        From Account
                      </label>
                      <Field
                        name="senderAccountNumber"
                        as="select"
                        className="myfin-input w-100"
                      >
                        <option value="">
                          Select your account
                        </option>
                        {activeAccounts.map((account) => (
                          <option
                            key={account.accountNumber}
                            value={account.accountNumber}
                          >
                            {account.accountNumber} 
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="senderAccountNumber"
                        component="div"
                        style={{
                          color: "var(--danger)",
                          fontSize: "0.8rem",
                          marginTop: "0.25rem",
                        }}
                      />
                    </div>

                    {/* To Account */}
                    <div className="mb-3">
                      <label
                        style={{
                          fontWeight: "600",
                          marginBottom: "0.5rem",
                          display: "block",
                        }}
                      >
                        To Account
                      </label>
                      <Field
                        name="receiverAccountNumber"
                        type="text"
                        placeholder="Enter account number"
                        className="myfin-input w-100"
                      />
                      <ErrorMessage
                        name="receiverAccountNumber"
                        component="div"
                        style={{
                          color: "var(--danger)",
                          fontSize: "0.8rem",
                          marginTop: "0.25rem",
                        }}
                      />
                    </div>

                    {/* Beneficiaries Quick Select */}
                    {beneficiaries.length > 0 && (
                      <div className="mb-3">
                        <label
                          style={{
                            fontWeight: "600",
                            marginBottom: "0.5rem",
                            display: "block",
                            fontSize: "0.875rem",
                            color: "var(--text-light)",
                          }}
                        >
                          Or select from beneficiaries:
                        </label>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                          }}
                        >
                          {beneficiaries.map((b) => (
                            <button
                              key={b.beneficiaryId}
                              type="button"
                              onClick={() =>
                                
                                setFieldValue(
                                  "receiverAccountNumber",
                                  b.accountNumber
                                )
                              }
                              style={{
                                background:
                                  values.receiverAccountNumber ===
                                  b.accountNumber
                                    ? "var(--secondary)"
                                    : "var(--background)",
                                color:
                                  values.receiverAccountNumber ===
                                  b.accountNumber
                                    ? "white"
                                    : "var(--text)",
                                border: "2px solid",
                                borderColor:
                                  values.receiverAccountNumber ===
                                  b.accountNumber
                                    ? "var(--secondary)"
                                    : "var(--border)",
                                borderRadius: "8px",
                                padding: "0.4rem 0.75rem",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                fontWeight: "600",
                                transition: "all 0.3s ease",
                              }}
                            >
                              <FiUser style={{ marginRight: "6px" }} /> {b.beneficiaryName}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Amount */}
                    <div className="mb-4">
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
                        placeholder="Enter amount to transfer"
                        className="myfin-input w-100"
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

                    {/* Submit */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-myfin-primary w-100"
                      style={{ padding: "0.875rem" }}
                    >
                      {isSubmitting
                        ? "Processing..."
                        : "Transfer Now "}
                    </motion.button>
                  </Form>
                )}
              </Formik>
            </motion.div>
          </div>

          {/* Info Panel */}
          <div className="col-lg-5 mb-4">
            {/* Account Balances */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="myfin-card mb-4"
            >
              <h6
                style={{
                  fontWeight: "700",
                  marginBottom: "1rem",
                  color: "var(--text)",
                }}
              >
                <FiCreditCard />Your Accounts
              </h6>
              {activeAccounts.map((account) => (
                <div
                  key={account.accountNumber}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem",
                    background: "var(--background)",
                    borderRadius: "10px",
                    marginBottom: "0.5rem",
                  }}
                >
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
                        fontSize: "0.75rem",
                      }}
                    >
                      {account.accountType}
                    </div>
                  </div>
                  <div
                    style={{
                      fontWeight: "700",
                      color: "var(--secondary)",
                    }}
                  >
                    {formatCurrency(account.balance)}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Transfer Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="myfin-card"
              style={{
                background:
                  "linear-gradient(135deg, #1e40af, #3b82f6)",
                color: "white",
                border: "none",
              }}
            >
              <h6
                style={{
                  fontWeight: "700",
                  marginBottom: "1rem",
                }}
              >
                💡 Transfer Tips
              </h6>
              {[
                "Double check account number before transfer",
                "Transfers are instant and irreversible",
                "Add beneficiaries for quick transfers",
                "Both accounts must be active",
              ].map((tip, index) => (
                <div
                  key={index}
                  style={{
                    fontSize: "0.8rem",
                    marginBottom: "0.5rem",
                    opacity: 0.9,
                    display: "flex",
                    gap: "0.5rem",
                  }}
                >
                  <FiCheck />
                  <span>{tip}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;