import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import authService from "../../services/authService";
import { FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../features/auth/authSlice";
import { setAuthToken } from "../../services/axiosInstance";
const loginSchema = Yup.object({
  identifier: Yup.string().required(
    "Email or Admin ID is required"
  ),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values) => {
    dispatch(loginStart());
    try {
      const data = await authService.loginAdmin(values);
      dispatch(
        loginSuccess({
          user: { ...data.admin, role: data.admin.role },
          token: data.token,
        })
      );
      toast.success(`Welcome, ${data.admin.name}! 👋`);
      setAuthToken(data.token);
      navigate("/admin/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed";
      dispatch(loginFailure(message));
      toast.error(message);
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
        {/* Logo */}
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
            🔐
          </motion.div>
          <h2
            style={{
              fontWeight: "800",
              color: "var(--text)",
              fontSize: "1.75rem",
            }}
          >
            Admin Portal
          </h2>
          <p style={{ color: "var(--text-light)" }}>
            Authorized personnel only
          </p>
        </div>

        {/* Admin Badge */}
        <div className="text-center mb-4">
          <span
            style={{
              background: "rgba(124, 58, 237, 0.1)",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              color: "#7c3aed",
              borderRadius: "20px",
              padding: "0.25rem 1rem",
              fontSize: "0.8rem",
              fontWeight: "600",
            }}
          >
            <FiShield style={{ marginRight: "6px" }} /> Secure Admin Access
          </span>
        </div>

        {/* Form */}
        <Formik
          initialValues={{ identifier: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Identifier */}
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

              {/* Password */}
              <div className="mb-3">
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
                    placeholder="Enter your password"
                    className="myfin-input w-100"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
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

              {/* Forgot Password */}
              <div className="text-end mb-3">
                <Link
                  to="/forgot-password/admin"
                  style={{
                    color: "#7c3aed",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || isLoading}
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
                  cursor:
                    isSubmitting || isLoading
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {isSubmitting || isLoading
                  ? "Signing in..."
                  : "Access Admin Portal"}
              </motion.button>
            </Form>
          )}
        </Formik>

        {/* Back to Home */}
        <div className="text-center mt-4">
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

export default AdminLogin;