import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FiCreditCard, FiTrendingUp, FiHome, FiLock } from "react-icons/fi";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e40af 100%)",
        color: "white",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          padding: "1.5rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            M
          </div>
          <span style={{ fontSize: "1.5rem", fontWeight: "700" }}>
            MyFin Bank
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", gap: "1rem" }}
        >
          <Button
            onClick={() => navigate("/login/admin")}
            variant="outline-light"
            style={{ borderRadius: "10px" }}
          >
            Admin Login
          </Button>
          <Button
            onClick={() => navigate("/login/customer")}
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
            }}
          >
            Customer Login
          </Button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <Container style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
        <Row className="align-items-center">
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div
                style={{
                  background: "rgba(245,158,11,0.2)",
                  border: "1px solid rgba(245,158,11,0.4)",
                  borderRadius: "20px",
                  padding: "0.5rem 1rem",
                  display: "inline-block",
                  marginBottom: "1.5rem",
                  fontSize: "0.875rem",
                  color: "#f59e0b",
                }}
              >
                🏦 Next Generation Banking
              </div>
              <h1
                style={{
                  fontSize: "3.5rem",
                  fontWeight: "800",
                  lineHeight: "1.1",
                  marginBottom: "1.5rem",
                }}
              >
                Banking Made
                <span
                  style={{
                    background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {" "}
                  Simple{" "}
                </span>
                & Secure
              </h1>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "2rem",
                  lineHeight: "1.8",
                }}
              >
                Experience the future of banking with MyFin Bank. Manage your
                accounts, investments, and loans all in one place — anytime,
                anywhere.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Button
                  onClick={() => navigate("/register")}
                  size="lg"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: "600",
                    padding: "0.75rem 2rem",
                  }}
                >
                  Open Account
                </Button>
              </div>
            </motion.div>
          </Col>

          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{ padding: "2rem" }}
            >
              {/* Feature Cards */}
              {[
                {
                  icon: <FiCreditCard />,
                  title: "Smart Accounts",
                  desc: "Savings & Current accounts with overdraft facility",
                },
                {
                  icon: <FiTrendingUp />,
                  title: "Investments",
                  desc: "Fixed & Recurring deposits with competitive rates",
                },
                {
                  icon: <FiHome />,
                  title: "Easy Loans",
                  desc: "Quick loan approvals with EMI calculator",
                },
                {
                  icon: <FiLock />,
                  title: "Bank-Grade Security",
                  desc: "Secure user authentication for maximum security",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + index * 0.1,
                  }}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    padding: "1rem 1.5rem",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "2rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {feature.icon}
                  </span>
                  <div>
                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "1rem",
                      }}
                    >
                      {feature.title}
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "0.875rem",
                      }}
                    >
                      {feature.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.5)",
          fontSize: "0.875rem",
        }}
      >
        © 2026 MyFin Bank. All rights reserved. | Secure Banking Platform
      </div>
    </div>
  );
};

export default LandingPage;
