import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Sidebar from "../../components/common/Sidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import beneficiaryService from "../../services/beneficiaryService";
import { formatDateOnly } from "../../utils/formatCurrency";
import accountService from "../../services/accountService";
import { FiUsers, FiUser } from "react-icons/fi";
const beneficiarySchema = Yup.object({
    beneficiaryName: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Beneficiary name is required"),
    accountNumber: Yup.string()
        .required("Account number is required")
        .test(
            "not-own-account",
            "You cannot add your own account as beneficiary",
            function (value) {
                const ownAccounts = JSON.parse(
                    localStorage.getItem("ownAccounts") || "[]"
                );
                return !ownAccounts.includes(value);
            }
        ),
    branch: Yup.string()
        .min(3, "Branch must be at least 3 characters")
        .required("Branch is required"),
});

const Beneficiaries = () => {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        fetchBeneficiaries();
    }, []);

    const fetchBeneficiaries = async () => {
        setIsLoading(true);
        try {
            const data = await beneficiaryService.getMyBeneficiaries();
            setBeneficiaries(data.beneficiaries);

            // Store own account numbers for validation
            const accountData = await accountService.getMyAccounts();
            const ownAccountNumbers = accountData.accounts.map(
                (a) => a.accountNumber
            );
            localStorage.setItem(
                "ownAccounts",
                JSON.stringify(ownAccountNumbers)
            );
        } catch (error) {
            toast.error("Failed to load beneficiaries");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddBeneficiary = async (
        values,
        { resetForm }
    ) => {
        try {
            await beneficiaryService.addBeneficiary(values);
            toast.success(
                "Beneficiary added! Awaiting admin approval."
            );
            setShowForm(false);
            resetForm();
            fetchBeneficiaries();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to add beneficiary"
            );
        }
    };

    const getStatusColor = (status) => {
        const map = {
            ACTIVE: "var(--success)",
            PENDING: "var(--accent)",
            REJECTED: "var(--danger)",
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
                            <FiUsers/> Beneficiaries
                        </h4>
                        <p
                            style={{ color: "var(--text-light)", margin: 0 }}
                        >
                            Manage your saved beneficiaries
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowForm(!showForm)}
                        className="btn-myfin-primary"
                    >
                        {showForm ? "✕ Cancel" : "+ Add Beneficiary"}
                    </motion.button>
                </motion.div>

                {/* Add Beneficiary Form */}
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
                            ➕ Add New Beneficiary
                        </h5>
                        <Formik
                            initialValues={{
                                beneficiaryName: "",
                                accountNumber: "",
                                branch: "",
                            }}
                            validationSchema={beneficiarySchema}
                            onSubmit={handleAddBeneficiary}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label
                                                style={{
                                                    fontWeight: "600",
                                                    marginBottom: "0.5rem",
                                                    display: "block",
                                                }}
                                            >
                                                Beneficiary Name
                                            </label>
                                            <Field
                                                name="beneficiaryName"
                                                type="text"
                                                placeholder="Enter full name"
                                                className="myfin-input w-100"
                                            />
                                            <ErrorMessage
                                                name="beneficiaryName"
                                                component="div"
                                                style={{
                                                    color: "var(--danger)",
                                                    fontSize: "0.8rem",
                                                    marginTop: "0.25rem",
                                                }}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label
                                                style={{
                                                    fontWeight: "600",
                                                    marginBottom: "0.5rem",
                                                    display: "block",
                                                }}
                                            >
                                                Account Number
                                            </label>
                                            <Field
                                                name="accountNumber"
                                                type="text"
                                                placeholder="e.g. MYFIN-SACC-0001"
                                                className="myfin-input w-100"
                                            />
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

                                        <div className="col-md-4 mb-3">
                                            <label
                                                style={{
                                                    fontWeight: "600",
                                                    marginBottom: "0.5rem",
                                                    display: "block",
                                                }}
                                            >
                                                Branch
                                            </label>
                                            <Field
                                                name="branch"
                                                type="text"
                                                placeholder="e.g. Mumbai Main Branch"
                                                className="myfin-input w-100"
                                            />
                                            <ErrorMessage
                                                name="branch"
                                                component="div"
                                                style={{
                                                    color: "var(--danger)",
                                                    fontSize: "0.8rem",
                                                    marginTop: "0.25rem",
                                                }}
                                            />
                                        </div>
                                    </div>

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
                                            : "Add Beneficiary"}
                                    </motion.button>
                                </Form>
                            )}
                        </Formik>
                    </motion.div>
                )}

                {/* Beneficiaries List */}
                {beneficiaries.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="myfin-card text-center"
                        style={{ padding: "3rem" }}
                    >
                        <div style={{ fontSize: "3rem", display: "flex", justifyContent: "center" }}><FiUsers /></div>
                        <h5 style={{ marginTop: "1rem" }}>
                            No beneficiaries yet
                        </h5>
                        <p style={{ color: "var(--text-light)" }}>
                            Add beneficiaries for quick transfers
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="myfin-card"
                        style={{ padding: 0, overflow: "hidden" }}
                    >
                        <table
                            className="table myfin-table mb-0"
                        >
                            <thead>
                                <tr>
                                    <th style={{ padding: "1rem" }}>
                                        Beneficiary ID
                                    </th>
                                    <th>Name</th>
                                    <th>Account Number</th>
                                    <th>Branch</th>
                                    <th>Status</th>
                                    <th>Added On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {beneficiaries.map((b, index) => (
                                    <motion.tr
                                        key={b.beneficiaryId}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <td
                                            style={{
                                                padding: "1rem",
                                                fontWeight: "600",
                                                fontSize: "0.8rem",
                                                color: "var(--text-light)",
                                            }}
                                        >
                                            {b.beneficiaryId}
                                        </td>
                                        <td style={{ fontWeight: "600" }}>
                                            <FiUser style={{ marginRight: "6px" }} /> {b.beneficiaryName}
                                        </td>
                                        <td
                                            style={{
                                                fontFamily: "monospace",
                                                fontSize: "0.875rem",
                                            }}
                                        >
                                            {b.accountNumber}
                                        </td>
                                        <td style={{ color: "var(--text-light)" }}>
                                            {b.branch}
                                        </td>
                                        <td>
                                            <span
                                                style={{
                                                    background: `${getStatusColor(b.status)}20`,
                                                    color: getStatusColor(b.status),
                                                    border: `1px solid ${getStatusColor(b.status)}40`,
                                                    borderRadius: "20px",
                                                    padding: "0.2rem 0.75rem",
                                                    fontSize: "0.8rem",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                {b.status}
                                            </span>
                                        </td>
                                        <td
                                            style={{
                                                fontSize: "0.8rem",
                                                color: "var(--text-light)",
                                            }}
                                        >
                                            {formatDateOnly(b.createdAt)}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Beneficiaries;