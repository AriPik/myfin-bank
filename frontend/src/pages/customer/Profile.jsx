import { useState } from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Sidebar from "../../components/common/Sidebar";
import useAuth from "../../hooks/useAuth";
import authService from "../../services/authService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import { FiUser, FiCheckCircle } from "react-icons/fi";

const passwordSchema = Yup.object({
    identifier: Yup.string().required(
        "Email or Customer ID is required"
    ),
    otp: Yup.string()
        .length(6, "OTP must be 6 digits")
        .required("OTP is required"),
    newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords do not match")
        .required("Please confirm your password"),
});

const Profile = () => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSendOTP = async () => {
        setOtpLoading(true);
        try {
            await authService.forgotPasswordCustomer({
                identifier: user.email,
            });
            toast.success("OTP sent to your registered email!");
            setOtpSent(true);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to send OTP"
            );
        } finally {
            setOtpLoading(false);
        }
    };

    const handleResetPassword = async (
        values,
        { resetForm }
    ) => {
        try {
            await authService.resetPasswordCustomer({
                identifier: values.identifier,
                otp: values.otp,
                newPassword: values.newPassword,
            });

            toast(
                (t) => (
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                fontWeight: "700",
                                marginBottom: "0.5rem",
                                fontSize: "1rem",
                            }}
                        >
                            <FiCheckCircle style={{ color: "var(--success)", marginRight: "4px" }} /> Password Changed!
                        </div>
                        <div
                            style={{
                                fontSize: "0.875rem",
                                marginBottom: "0.75rem",
                                color: "#64748b",
                            }}
                        >
                            Please login with your new password.
                        </div>
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                dispatch(logout());
                                navigate("/login/customer");
                            }}
                            style={{
                                background:
                                    "linear-gradient(135deg, #1e40af, #0f172a)",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                padding: "0.5rem 1.5rem",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                            }}
                        >
                            OK → Login Now
                        </button>
                    </div>
                ),
                {
                    duration: Infinity,
                    style: {
                        background: "white",
                        color: "#1e293b",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "1.25rem",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    },
                }
            );

            resetForm();
            setOtpSent(false);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to reset password"
            );
        }
    };

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
                        <FiUser/> My Profile
                    </h4>
                    <p style={{ color: "var(--text-light)", margin: 0 }}>
                        View and manage your profile
                    </p>
                </motion.div>

                <div className="row">
                    {/* Profile Card */}
                    <div className="col-lg-4 mb-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="myfin-card text-center"
                        >
                            {/* Avatar */}
                            <div
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    background:
                                        "linear-gradient(135deg, var(--secondary), var(--primary))",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 1rem",
                                    fontSize: "2rem",
                                    color: "white",
                                    fontWeight: "800",
                                }}
                            >
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>

                            <h5 style={{ fontWeight: "700" }}>
                                {user?.name}
                            </h5>
                            <p
                                style={{
                                    color: "var(--text-light)",
                                    fontSize: "0.875rem",
                                }}
                            >
                                {user?.email}
                            </p>

                            <div
                                style={{
                                    background: "rgba(30,64,175,0.1)",
                                    border: "1px solid rgba(30,64,175,0.2)",
                                    borderRadius: "10px",
                                    padding: "0.5rem",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "var(--text-light)",
                                    }}
                                >
                                    Customer ID
                                </div>
                                <div
                                    style={{
                                        fontWeight: "700",
                                        color: "var(--secondary)",
                                    }}
                                >
                                    {user?.customerId}
                                </div>
                            </div>

                            <span className="badge-active">
                                {user?.status}
                            </span>
                        </motion.div>
                    </div>

                    {/* Profile Details */}
                    <div className="col-lg-8 mb-4">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="myfin-card mb-4"
                        >
                            <h5
                                style={{
                                    fontWeight: "700",
                                    marginBottom: "1.5rem",
                                }}
                            >
                                 Account Information
                            </h5>

                            <div className="row">
                                {[
                                    { label: "Full Name", value: user?.name },
                                    {
                                        label: "Email Address",
                                        value: user?.email,
                                    },
                                    {
                                        label: "Customer ID",
                                        value: user?.customerId,
                                    },
                                    {
                                        label: "Account Status",
                                        value: user?.status,
                                    },
                                ].map((item, index) => (
                                    <div key={index} className="col-md-6 mb-3">
                                        <div
                                            style={{
                                                background: "var(--background)",
                                                borderRadius: "10px",
                                                padding: "1rem",
                                                border: "1px solid var(--border)",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: "0.75rem",
                                                    color: "var(--text-light)",
                                                    marginBottom: "0.25rem",
                                                }}
                                            >
                                                {item.label}
                                            </div>
                                            <div
                                                style={{
                                                    fontWeight: "600",
                                                    fontSize: "0.9rem",
                                                }}
                                            >
                                                {item.value}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Change Password */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="myfin-card"
                        >
                            <h5
                                style={{
                                    fontWeight: "700",
                                    marginBottom: "1rem",
                                }}
                            >
                                 Change Password
                            </h5>

                            {!otpSent ? (
                                <div>
                                    <p
                                        style={{
                                            color: "var(--text-light)",
                                            fontSize: "0.875rem",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        Click below to receive an OTP on your
                                        registered email to change your password.
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSendOTP}
                                        disabled={otpLoading}
                                        className="btn-myfin-primary"
                                        style={{ padding: "0.75rem 2rem" }}
                                    >
                                        {otpLoading
                                            ? "Sending OTP..."
                                            : "Send OTP to Email "}
                                    </motion.button>
                                </div>
                            ) : (
                                <Formik
                                    initialValues={{
                                        identifier: user?.email || "",
                                        otp: "",
                                        newPassword: "",
                                        confirmPassword: "",
                                    }}
                                    validationSchema={passwordSchema}
                                    onSubmit={handleResetPassword}
                                >
                                    {({ isSubmitting }) => (
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
                                                        Email or Customer ID
                                                    </label>
                                                    <Field
                                                        name="identifier"
                                                        type="text"
                                                        className="myfin-input w-100"
                                                    />
                                                    <ErrorMessage
                                                        name="identifier"
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
                                                        OTP (Check your email)
                                                    </label>
                                                    <Field
                                                        name="otp"
                                                        type="text"
                                                        placeholder="Enter 6 digit OTP"
                                                        className="myfin-input w-100"
                                                        maxLength={6}
                                                    />
                                                    <ErrorMessage
                                                        name="otp"
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
                                                        New Password
                                                    </label>
                                                    <Field
                                                        name="newPassword"
                                                        type="password"
                                                        placeholder="Min 6 characters"
                                                        className="myfin-input w-100"
                                                    />
                                                    <ErrorMessage
                                                        name="newPassword"
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
                                                        Confirm Password
                                                    </label>
                                                    <Field
                                                        name="confirmPassword"
                                                        type="password"
                                                        placeholder="Repeat password"
                                                        className="myfin-input w-100"
                                                    />
                                                    <ErrorMessage
                                                        name="confirmPassword"
                                                        component="div"
                                                        style={{
                                                            color: "var(--danger)",
                                                            fontSize: "0.8rem",
                                                            marginTop: "0.25rem",
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "1rem",
                                                }}
                                            >
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="btn-myfin-primary"
                                                    style={{
                                                        padding: "0.75rem 2rem",
                                                    }}
                                                >
                                                    {isSubmitting
                                                        ? "Changing..."
                                                        : "Change Password"}
                                                </motion.button>
                                                <button
                                                    type="button"
                                                    onClick={() => setOtpSent(false)}
                                                    style={{
                                                        background: "none",
                                                        border:
                                                            "1px solid var(--border)",
                                                        borderRadius: "10px",
                                                        padding: "0.75rem 1.5rem",
                                                        cursor: "pointer",
                                                        color: "var(--text-light)",
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;