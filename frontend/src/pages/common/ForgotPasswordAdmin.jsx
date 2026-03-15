import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import authService from "../../services/authService";
import { FiKey, FiCheck } from "react-icons/fi";
const requestSchema = Yup.object({
  identifier: Yup.string().required(
    "Email or Admin ID is required"
  ),
});

const resetSchema = Yup.object({
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

const ForgotPasswordAdmin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");

  const handleRequestOTP = async (values) => {
    try {
      await authService.forgotPasswordAdmin(values);
      toast.success("OTP sent to your registered email!");
      setIdentifier(values.identifier);
      setStep(2);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  };

  const handleResetPassword = async (values) => {
    try {
      await authService.resetPasswordAdmin({
        identifier,
        otp: values.otp,
        newPassword: values.newPassword,
      });
      toast.success("Password reset successfully!");
      navigate("/login/admin");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to reset password"
      );
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="auth-card"
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
              background:
                "linear-gradient(135deg, #7c3aed, #4c1d95)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              fontSize: "1.8rem",
            }}
          >
            <FiKey />
          </motion.div>
          <h2
            style={{
              fontWeight: "800",
              color: "var(--text)",
              fontSize: "1.75rem",
            }}
          >
            {step === 1
              ? "Forgot Password?"
              : "Reset Password"}
          </h2>
          <p style={{ color: "var(--text-light)" }}>
            {step === 1
              ? "Enter your email or Admin ID"
              : "OTP sent to your registered email"}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="d-flex justify-content-center gap-2 mb-4">
          {[1, 2].map((s) => (
            <div
              key={s}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background:
                  step >= s ? "#7c3aed" : "var(--border)",
                color:
                  step >= s ? "white" : "var(--text-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "0.875rem",
                transition: "all 0.3s ease",
              }}
            >
              {step > s ? <FiCheck /> : s}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <Formik
            initialValues={{ identifier: "" }}
            validationSchema={requestSchema}
            onSubmit={handleRequestOTP}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label
                    style={{
                      fontWeight: "600",
                      color: "var(--text)",
                      marginBottom: "0.5rem",
                      display: "block",
                    }}
                  >
                    Email or Admin ID
                  </label>
                  <Field
                    name="identifier"
                    type="text"
                    placeholder="Enter email or MYFIN-ADMIN-XXX"
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

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background:
                      "linear-gradient(135deg, #7c3aed, #4c1d95)",
                    border: "none",
                    color: "white",
                    borderRadius: "10px",
                    padding: "0.875rem",
                    fontSize: "1rem",
                    width: "100%",
                    fontWeight: "600",
                    cursor: isSubmitting
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  {isSubmitting
                    ? "Sending OTP..."
                    : "Send OTP 📧"}
                </motion.button>
              </Form>
            )}
          </Formik>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Formik
            initialValues={{
              otp: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={resetSchema}
            onSubmit={handleResetPassword}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label
                    style={{
                      fontWeight: "600",
                      color: "var(--text)",
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

                <div className="mb-3">
                  <label
                    style={{
                      fontWeight: "600",
                      color: "var(--text)",
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

                <div className="mb-4">
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

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      background: "none",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      padding: "0.875rem 1rem",
                      cursor: "pointer",
                      color: "var(--text-light)",
                      flex: 1,
                    }}
                  >
                    ← Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      background:
                        "linear-gradient(135deg, #7c3aed, #4c1d95)",
                      border: "none",
                      color: "white",
                      borderRadius: "10px",
                      padding: "0.875rem",
                      fontWeight: "600",
                      cursor: isSubmitting
                        ? "not-allowed"
                        : "pointer",
                      flex: 2,
                    }}
                  >
                    {isSubmitting
                      ? "Resetting..."
                      : "Reset Password"}
                  </motion.button>
                </div>
              </Form>
            )}
          </Formik>
        )}

        {/* Back to Login */}
        <div className="text-center mt-4">
          <Link
            to="/login/admin"
            style={{
              color: "var(--text-light)",
              fontSize: "0.875rem",
              textDecoration: "none",
            }}
          >
            ← Back to Admin Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordAdmin;