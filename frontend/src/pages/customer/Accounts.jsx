import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Row, Col, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Sidebar from "../../components/common/Sidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import accountService from "../../services/accountService";
import transactionService from "../../services/transactionService";
import { setAccounts } from "../../features/account/accountSlice";
import { formatCurrency, formatDate } from "../../utils/formatCurrency";
import { FiCreditCard, FiDollarSign, FiArrowUp, FiArrowDown, FiCheckCircle, FiPlusCircle, FiArrowDownCircle } from "react-icons/fi";
const depositSchema = Yup.object({
    amount: Yup.number()
        .min(1, "Amount must be greater than 0")
        .required("Amount is required"),
});

const withdrawSchema = Yup.object({
    amount: Yup.number()
        .min(1, "Amount must be greater than 0")
        .required("Amount is required"),
});

const Accounts = () => {
    const dispatch = useDispatch();
    const { accounts } = useSelector((state) => state.account);
    const [isLoading, setIsLoading] = useState(true);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        setIsLoading(true);
        try {
            const data = await accountService.getMyAccounts();
            dispatch(setAccounts(data.accounts));
        } catch (error) {
            toast.error("Failed to load accounts");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeposit = async (values, { resetForm }) => {
        try {
            await transactionService.deposit({
                accountNumber: selectedAccount.accountNumber,
                amount: Number(values.amount),
            });
            toast.success(`₹${values.amount} deposited successfully!`);
            setShowDepositModal(false);
            resetForm();
            fetchAccounts();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Deposit failed"
            );
        }
    };

    const handleWithdraw = async (values, { resetForm }) => {
        try {
            await transactionService.withdraw({
                accountNumber: selectedAccount.accountNumber,
                amount: Number(values.amount),
            });
            toast.success(
                `₹${values.amount} withdrawn successfully!`
            );
            setShowWithdrawModal(false);
            resetForm();
            fetchAccounts();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Withdrawal failed"
            );
        }
    };

    const handleRequestAccount = async (values) => {
        try {
            await accountService.requestAccount(values);
            toast.success(
                "Account request submitted! Awaiting admin approval."
            );
            setShowRequestModal(false);
            fetchAccounts();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Account request failed"
            );
        }
    };

    const getStatusBadge = (status) => {
        const map = {
            ACTIVE: "badge-active",
            REQUESTED: "badge-pending",
            REJECTED: "badge-rejected",
            DEACTIVATED: "badge-deactivated",
            AT_RISK: "badge-pending",
        };
        return map[status] || "badge-pending";
    };

    if (isLoading) return <LoadingSpinner fullScreen />;

    const hasSavings = accounts.some(
        (a) =>
            a.accountType === "SAVINGS" && a.status !== "REJECTED"
    );
    const hasCurrent = accounts.some(
        (a) =>
            a.accountType === "CURRENT" && a.status !== "REJECTED"
    );

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
                            <FiCreditCard /> My Accounts
                        </h4>
                        <p
                            style={{ color: "var(--text-light)", margin: 0 }}
                        >
                            Manage your bank accounts
                        </p>
                    </div>
                    {(!hasSavings || !hasCurrent) && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowRequestModal(true)}
                            className="btn-myfin-primary"
                        >
                            + Request Account
                        </motion.button>
                    )}
                </motion.div>

                {/* Accounts Grid */}
                <Row>
                    {accounts.length === 0 ? (
                        <Col>
                            <div
                                className="myfin-card text-center"
                                style={{ padding: "3rem" }}
                            >
                                <div style={{ fontSize: "3rem" }}>💳</div>
                                <h5 style={{ marginTop: "1rem" }}>
                                    No accounts yet
                                </h5>
                                <p style={{ color: "var(--text-light)" }}>
                                    Request your first bank account
                                </p>
                                <button
                                    onClick={() => setShowRequestModal(true)}
                                    className="btn-myfin-primary"
                                >
                                    Request Account
                                </button>
                            </div>
                        </Col>
                    ) : (
                        accounts.map((account, index) => (
                            <Col key={account.accountNumber} md={6} className="mb-4 ">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{
                                        scale: 1.03,
                                        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                                    }}
                                    transition={{ delay: index * 0.1 }}
                                    className="myfin-card"
                                    style={{
                                        background:
                                            account.accountType === "SAVINGS"
                                                ? "linear-gradient(135deg, #1e40af, #3b82f6)"
                                                : "linear-gradient(135deg, #0f172a, #1e293b)",
                                        color: "white",
                                        border: "none",
                                        height: "100%",
                                        cursor: "pointer",
                                    }}
                                >
                                    {/* Card Header */}
                                    <div className="d-flex justify-content-between mb-3">
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: "0.8rem",
                                                    opacity: 0.7,
                                                }}
                                            >
                                                {account.accountType} ACCOUNT
                                            </div>
                                            <div
                                                style={{
                                                    fontWeight: "700",
                                                    fontSize: "1rem",
                                                    letterSpacing: "1px",
                                                }}
                                            >
                                                {account.accountNumber}
                                            </div>
                                        </div>
                                        <span
                                            style={{
                                                background: "rgba(255,255,255,0.2)",
                                                borderRadius: "20px",
                                                padding: "0.25rem 0.75rem",
                                                fontSize: "0.75rem",
                                                fontWeight: "600",
                                                height: "fit-content",
                                            }}
                                        >
                                            {account.status}
                                        </span>
                                    </div>

                                    {/* Balance */}
                                    <div style={{ marginBottom: "1.5rem" }}>
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
                                                fontSize: "2rem",
                                                fontWeight: "800",
                                            }}
                                        >
                                            {formatCurrency(account.balance)}
                                        </div>
                                        {account.accountType === "CURRENT" &&
                                            account.overdraftLimit > 0 && (
                                                <div
                                                    style={{
                                                        fontSize: "0.75rem",
                                                        opacity: 0.7,
                                                    }}
                                                >
                                                    Overdraft Limit:{" "}
                                                    {formatCurrency(account.overdraftLimit)}
                                                </div>
                                            )}
                                    </div>

                                    {/* Approved By */}
                                    {account.approvedByName && (
                                        <div
                                            style={{
                                                fontSize: "0.75rem",
                                                opacity: 0.7,
                                                marginBottom: "1rem",
                                            }}
                                        >
                                            <FiCheckCircle style={{ color: "var(--success)", marginRight: "4px" }} /> Approved by {account.approvedByName}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    {(account.status === "ACTIVE" || account.status === "AT_RISK") && (
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "0.75rem",
                                            }}
                                        >
                                            <button
                                                onClick={() => {
                                                    setSelectedAccount(account);
                                                    setShowDepositModal(true);
                                                }}
                                                style={{
                                                    flex: 1,
                                                    background:
                                                        "rgba(255,255,255,0.2)",
                                                    border:
                                                        "1px solid rgba(255,255,255,0.3)",
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
                                            {!(account.accountType === "CURRENT" && account.status === "AT_RISK") && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedAccount(account);
                                                        setShowWithdrawModal(true);
                                                    }}
                                                    style={{
                                                        flex: 1,
                                                        background:
                                                            "rgba(255,255,255,0.1)",
                                                        border:
                                                            "1px solid rgba(255,255,255,0.2)",
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
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            </Col>
                        ))
                    )}
                </Row>

                {/* Deposit Modal */}
                <Modal
                    show={showDepositModal}
                    onHide={() => setShowDepositModal(false)}
                    centered
                >
                    <Modal.Header
                        closeButton
                        style={{ borderBottom: "1px solid var(--border)" }}
                    >
                        <Modal.Title style={{ fontWeight: "700" }}>
                            <FiPlusCircle /> Deposit Money
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: "1.5rem" }}>
                        {selectedAccount && (
                            <div
                                style={{
                                    background: "var(--background)",
                                    borderRadius: "10px",
                                    padding: "1rem",
                                    marginBottom: "1rem",
                                    fontSize: "0.875rem",
                                }}
                            >
                                <strong>{selectedAccount.accountNumber}</strong>
                                <span
                                    style={{
                                        color: "var(--text-light)",
                                        marginLeft: "0.5rem",
                                    }}
                                >
                                    Balance:{" "}
                                    {formatCurrency(selectedAccount.balance)}
                                </span>
                            </div>
                        )}
                        <Formik
                            initialValues={{ amount: "" }}
                            validationSchema={depositSchema}
                            onSubmit={handleDeposit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="mb-3">
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
                                            placeholder="Enter amount"
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
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-myfin-primary w-100"
                                        style={{ padding: "0.75rem" }}
                                    >
                                        {isSubmitting
                                            ? "Processing..."
                                            : "Deposit Now"}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                </Modal>

                {/* Withdraw Modal */}
                <Modal
                    show={showWithdrawModal}
                    onHide={() => setShowWithdrawModal(false)}
                    centered
                >
                    <Modal.Header
                        closeButton
                        style={{ borderBottom: "1px solid var(--border)" }}
                    >
                        <Modal.Title style={{ fontWeight: "700" }}>
                            <FiArrowDownCircle /> Withdraw Money
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: "1.5rem" }}>
                        {selectedAccount && (
                            <div
                                style={{
                                    background: "var(--background)",
                                    borderRadius: "10px",
                                    padding: "1rem",
                                    marginBottom: "1rem",
                                    fontSize: "0.875rem",
                                }}
                            >
                                <strong>{selectedAccount.accountNumber}</strong>
                                <span
                                    style={{
                                        color: "var(--text-light)",
                                        marginLeft: "0.5rem",
                                    }}
                                >
                                    Balance:{" "}
                                    {formatCurrency(selectedAccount.balance)}
                                </span>
                            </div>
                        )}
                        <Formik
                            initialValues={{ amount: "" }}
                            validationSchema={withdrawSchema}
                            onSubmit={handleWithdraw}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="mb-3">
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
                                            placeholder="Enter amount"
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
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-myfin-primary w-100"
                                        style={{ padding: "0.75rem" }}
                                    >
                                        {isSubmitting
                                            ? "Processing..."
                                            : "Withdraw Now"}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                </Modal>

                {/* Request Account Modal */}
                <Modal
                    show={showRequestModal}
                    onHide={() => setShowRequestModal(false)}
                    centered
                >
                    <Modal.Header
                        closeButton
                        style={{ borderBottom: "1px solid var(--border)" }}
                    >
                        <Modal.Title style={{ fontWeight: "700" }}>
                            <FiPlusCircle /> Request New Account
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: "1.5rem" }}>
                        <Formik
                            initialValues={{ accountType: "" }}
                            validationSchema={Yup.object({
                                accountType: Yup.string().required(
                                    "Please select account type"
                                ),
                            })}
                            onSubmit={handleRequestAccount}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="mb-3">
                                        <label
                                            style={{
                                                fontWeight: "600",
                                                marginBottom: "0.5rem",
                                                display: "block",
                                            }}
                                        >
                                            Account Type
                                        </label>
                                        <Field
                                            name="accountType"
                                            as="select"
                                            className="myfin-input w-100"
                                        >
                                            <option value="">Select Type</option>
                                            {!hasSavings && (
                                                <option value="SAVINGS">
                                                    Savings Account
                                                </option>
                                            )}
                                            {!hasCurrent && (
                                                <option value="CURRENT">
                                                    Current Account
                                                </option>
                                            )}
                                        </Field>
                                        <ErrorMessage
                                            name="accountType"
                                            component="div"
                                            style={{
                                                color: "var(--danger)",
                                                fontSize: "0.8rem",
                                                marginTop: "0.25rem",
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-myfin-primary w-100"
                                        style={{ padding: "0.75rem" }}
                                    >
                                        {isSubmitting
                                            ? "Submitting..."
                                            : "Submit Request"}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

export default Accounts;