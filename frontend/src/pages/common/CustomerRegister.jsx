import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import authService from "../../services/authService";
import { FiEye, FiEyeOff } from "react-icons/fi";
const registerSchema = Yup.object({
    name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Full name is required"),
    email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required("Please confirm your password"),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter valid 10 digit phone number")
        .required("Phone number is required"),
    address: Yup.string()
        .min(10, "Address must be at least 10 characters")
        .required("Address is required"),
    govIdType: Yup.string()
        .oneOf(["AADHAAR", "PAN"], "Select a valid ID type")
        .required("Government ID type is required"),
    govIdNumber: Yup.string()
        .required("Government ID number is required")
        .when("govIdType", {
            is: "AADHAAR",
            then: (schema) =>
                schema.matches(/^[0-9]{12}$/, "Aadhaar must be exactly 12 digits"),
        })
        .when("govIdType", {
            is: "PAN",
            then: (schema) =>
                schema.matches(
                    /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                    "PAN must be in format ABCDE1234F",
                ),
        }),
});

const CustomerRegister = () => {
    const navigate = useNavigate();
    const [govIdFile, setGovIdFile] = useState(null);
    const [fileError, setFileError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "application/pdf",
        ];
        if (!allowedTypes.includes(file.type)) {
            setFileError("Only jpeg, jpg, png and pdf files allowed!");
            setGovIdFile(null);
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setFileError("File size must be less than 5MB!");
            setGovIdFile(null);
            return;
        }
        setFileError("");
        setGovIdFile(file);
    };

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("email", values.email);
            formData.append("password", values.password);
            formData.append("phone", values.phone);
            formData.append("address", values.address);
            formData.append("govIdType", values.govIdType);
            formData.append("govIdNumber", values.govIdNumber);
            if (govIdFile) {
                formData.append("govIdDocument", govIdFile);
            }

            await authService.registerCustomer(formData);
            toast.success(
                "Registration submitted successfully! Our team will review your application and send your account details to your registered email.",
                { duration: 5000 }
            );
            navigate("/login/customer");
        } catch (error) {
            const message = error.response?.data?.message || "Registration failed";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="auth-container"
            style={{ padding: "2rem 0", alignItems: "flex-start" }}
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="auth-card"
                style={{ maxWidth: "560px", margin: "2rem auto" }}
            >
                {/* Header */}
                <div className="text-center mb-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{
                            width: "60px",
                            height: "60px",
                            background: "linear-gradient(135deg, #1e40af, #0f172a)",
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 1rem",
                            fontSize: "1.8rem",
                        }}
                    >
                        🏦
                    </motion.div>
                    <h2
                        style={{
                            fontWeight: "800",
                            color: "var(--text)",
                            fontSize: "1.75rem",
                        }}
                    >
                        Open Your Account
                    </h2>
                    <p style={{ color: "var(--text-light)" }}>
                        Join MyFin Bank today — it's free!
                    </p>
                </div>

                <Formik
                    initialValues={{
                        name: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        phone: "",
                        address: "",
                        govIdType: "",
                        govIdNumber: "",
                    }}
                    validationSchema={registerSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values }) => (
                        <Form>
                            {/* Name */}
                            <div className="mb-3">
                                <label
                                    style={{
                                        fontWeight: "600",
                                        color: "var(--text)",
                                        marginBottom: "0.5rem",
                                        display: "block",
                                    }}
                                >
                                    Full Name
                                </label>
                                <Field
                                    name="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="myfin-input w-100"
                                />
                                <ErrorMessage
                                    name="name"
                                    component="div"
                                    style={{
                                        color: "var(--danger)",
                                        fontSize: "0.8rem",
                                        marginTop: "0.25rem",
                                    }}
                                />
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                                <label
                                    style={{
                                        fontWeight: "600",
                                        color: "var(--text)",
                                        marginBottom: "0.5rem",
                                        display: "block",
                                    }}
                                >
                                    Email Address
                                </label>
                                <Field
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="myfin-input w-100"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    style={{
                                        color: "var(--danger)",
                                        fontSize: "0.8rem",
                                        marginTop: "0.25rem",
                                    }}
                                />
                            </div>

                            {/* Password + Confirm */}
                            <div className="row mb-3">
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <label
                                        style={{
                                            fontWeight: "600",
                                            color: "var(--text)",
                                            marginBottom: "0.5rem",
                                            display: "block",
                                        }}
                                    >
                                        Password
                                    </label>
                                    <div style={{ position: "relative" }}>
                                        <Field
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Min 6 characters"
                                            className="myfin-input w-100"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: "absolute",
                                                right: "12px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "1.1rem",
                                            }}
                                        >
                                            {showPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        style={{
                                            color: "var(--danger)",
                                            fontSize: "0.8rem",
                                            marginTop: "0.25rem",
                                        }}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label
                                        style={{
                                            fontWeight: "600",
                                            color: "var(--text)",
                                            marginBottom: "0.5rem",
                                            display: "block",
                                        }}
                                    >
                                        Confirm Password
                                    </label>
                                    <div style={{ position: "relative" }}>
                                        <Field
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Repeat password"
                                            className="myfin-input w-100"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                            style={{
                                                position: "absolute",
                                                right: "12px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "1.1rem",
                                            }}
                                        >
                                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>
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

                            {/* Phone */}
                            <div className="mb-3">
                                <label
                                    style={{
                                        fontWeight: "600",
                                        color: "var(--text)",
                                        marginBottom: "0.5rem",
                                        display: "block",
                                    }}
                                >
                                    Phone Number
                                </label>
                                <div style={{ display: "flex", gap: "0" }}>
                                    {/* India Flag Prefix */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            padding: "0 12px",
                                            background: "#f1f5f9",
                                            border: "2px solid var(--border)",
                                            borderRight: "none",
                                            borderRadius: "10px 0 0 10px",
                                            whiteSpace: "nowrap",
                                            fontSize: "0.9rem",
                                            fontWeight: "600",
                                            color: "var(--text)",
                                        }}
                                    >
                                        🇮🇳 +91
                                    </div>
                                    <Field
                                        name="phone"
                                        type="text"
                                        placeholder="10 digit mobile number"
                                        className="myfin-input w-100"
                                        style={{
                                            borderRadius: "0 10px 10px 0",
                                            borderLeft: "none",
                                        }}
                                        maxLength={10}
                                    />
                                </div>
                                <ErrorMessage
                                    name="phone"
                                    component="div"
                                    style={{
                                        color: "var(--danger)",
                                        fontSize: "0.8rem",
                                        marginTop: "0.25rem",
                                    }}
                                />
                            </div>

                            {/* Address */}
                            <div className="mb-3">
                                <label
                                    style={{
                                        fontWeight: "600",
                                        color: "var(--text)",
                                        marginBottom: "0.5rem",
                                        display: "block",
                                    }}
                                >
                                    Address
                                </label>
                                <Field
                                    name="address"
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter your full address"
                                    className="myfin-input w-100"
                                    style={{ resize: "none" }}
                                />
                                <ErrorMessage
                                    name="address"
                                    component="div"
                                    style={{
                                        color: "var(--danger)",
                                        fontSize: "0.8rem",
                                        marginTop: "0.25rem",
                                    }}
                                />
                            </div>

                            {/* GovId Type */}
                            <div className="mb-3">
                                <label
                                    style={{
                                        fontWeight: "600",
                                        color: "var(--text)",
                                        marginBottom: "0.5rem",
                                        display: "block",
                                    }}
                                >
                                    Government ID Type
                                </label>
                                <Field
                                    name="govIdType"
                                    as="select"
                                    className="myfin-input w-100"
                                >
                                    <option value="">Select ID Type</option>
                                    <option value="AADHAAR">Aadhaar Card</option>
                                    <option value="PAN">PAN Card</option>
                                </Field>
                                <ErrorMessage
                                    name="govIdType"
                                    component="div"
                                    style={{
                                        color: "var(--danger)",
                                        fontSize: "0.8rem",
                                        marginTop: "0.25rem",
                                    }}
                                />
                            </div>

                            {/* GovId Number */}
                            {values.govIdType && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="mb-3"
                                >
                                    <label
                                        style={{
                                            fontWeight: "600",
                                            color: "var(--text)",
                                            marginBottom: "0.5rem",
                                            display: "block",
                                        }}
                                    >
                                        {values.govIdType === "AADHAAR"
                                            ? "Aadhaar Number (12 digits)"
                                            : "PAN Number (ABCDE1234F)"}
                                    </label>
                                    <Field
                                        name="govIdNumber"
                                        type="text"
                                        placeholder={
                                            values.govIdType === "AADHAAR"
                                                ? "Enter 12 digit Aadhaar number"
                                                : "Enter PAN in format ABCDE1234F"
                                        }
                                        className="myfin-input w-100"
                                        style={{
                                            textTransform:
                                                values.govIdType === "PAN" ? "uppercase" : "none",
                                        }}
                                    />
                                    <ErrorMessage
                                        name="govIdNumber"
                                        component="div"
                                        style={{
                                            color: "var(--danger)",
                                            fontSize: "0.8rem",
                                            marginTop: "0.25rem",
                                        }}
                                    />
                                </motion.div>
                            )}

                            {/* Document Upload */}
                            <div className="mb-4">
                                <label
                                    style={{
                                        fontWeight: "600",
                                        color: "var(--text)",
                                        marginBottom: "0.5rem",
                                        display: "block",
                                    }}
                                >
                                    Upload ID Document
                                    <span
                                        style={{
                                            color: "var(--text-light)",
                                            fontWeight: "400",
                                            fontSize: "0.8rem",
                                            marginLeft: "0.5rem",
                                        }}
                                    >
                                        (jpeg/jpg/png/pdf, max 5MB)
                                    </span>
                                </label>
                                <div
                                    style={{
                                        border: "2px dashed var(--border)",
                                        borderRadius: "10px",
                                        padding: "1.5rem",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        background: govIdFile
                                            ? "rgba(16, 185, 129, 0.05)"
                                            : "transparent",
                                        borderColor: govIdFile ? "var(--success)" : "var(--border)",
                                    }}
                                    onClick={() =>
                                        document.getElementById("govIdDocument").click()
                                    }
                                >
                                    <input
                                        id="govIdDocument"
                                        type="file"
                                        accept=".jpeg,.jpg,.png,.pdf"
                                        onChange={handleFileChange}
                                        style={{ display: "none" }}
                                    />
                                    {govIdFile ? (
                                        <div style={{ color: "var(--success)" }}>
                                            ✅ {govIdFile.name}
                                        </div>
                                    ) : (
                                        <div style={{ color: "var(--text-light)" }}>
                                            📎 Click to upload document
                                        </div>
                                    )}
                                </div>
                                {fileError && (
                                    <div
                                        style={{
                                            color: "var(--danger)",
                                            fontSize: "0.8rem",
                                            marginTop: "0.25rem",
                                        }}
                                    >
                                        {fileError}
                                    </div>
                                )}
                            </div>

                            {/* Submit */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-myfin-primary w-100"
                                style={{
                                    padding: "0.875rem",
                                    fontSize: "1rem",
                                    width: "100%",
                                    cursor: isSubmitting ? "not-allowed" : "pointer",
                                }}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Application"}
                            </motion.button>
                        </Form>
                    )}
                </Formik>

                {/* Login Link */}
                <div className="text-center mt-4">
                    <span style={{ color: "var(--text-light)" }}>
                        Already have an account?{" "}
                    </span>
                    <Link
                        to="/login/customer"
                        style={{
                            color: "var(--secondary)",
                            fontWeight: "700",
                            textDecoration: "none",
                        }}
                    >
                        Sign In
                    </Link>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-2">
                    <Link
                        to="/"
                        style={{
                            color: "var(--text-light)",
                            fontSize: "0.875rem",
                            textDecoration: "none",
                        }}
                    >
                        ← Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default CustomerRegister;
