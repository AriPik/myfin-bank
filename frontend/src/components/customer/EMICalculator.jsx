import { useState } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "../../utils/formatCurrency";

const EMICalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [result, setResult] = useState(null);

  const calculateEMI = () => {
    if (!principal || !rate || !tenure) return;
    const monthlyRate = Number(rate) / 100 / 12;
    const n = Number(tenure);
    const p = Number(principal);
    const emi =
      monthlyRate === 0
        ? p / n
        : (p * monthlyRate * Math.pow(1 + monthlyRate, n)) /
          (Math.pow(1 + monthlyRate, n) - 1);

    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    setResult({
      emi: Math.round(emi * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
    });
  };

  return (
    <div className="myfin-card">
      <h5
        style={{
          fontWeight: "700",
          marginBottom: "1rem",
          color: "var(--text)",
        }}
      >
        🧮 EMI Calculator
      </h5>

      <div className="row">
        <div className="col-md-4 mb-3">
          <label
            style={{
              fontWeight: "600",
              fontSize: "0.875rem",
              marginBottom: "0.5rem",
              display: "block",
            }}
          >
            Loan Amount (₹)
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="e.g. 100000"
            className="myfin-input w-100"
          />
        </div>
        <div className="col-md-4 mb-3">
          <label
            style={{
              fontWeight: "600",
              fontSize: "0.875rem",
              marginBottom: "0.5rem",
              display: "block",
            }}
          >
            Interest Rate (% p.a.)
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="e.g. 8.5"
            className="myfin-input w-100"
          />
        </div>
        <div className="col-md-4 mb-3">
          <label
            style={{
              fontWeight: "600",
              fontSize: "0.875rem",
              marginBottom: "0.5rem",
              display: "block",
            }}
          >
            Tenure (Months)
          </label>
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            placeholder="e.g. 12"
            className="myfin-input w-100"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={calculateEMI}
        className="btn-myfin-primary"
        style={{ padding: "0.75rem 2rem" }}
      >
        Calculate EMI
      </motion.button>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: "1rem",
            background:
              "linear-gradient(135deg, #1e40af15, #3b82f615)",
            border: "1px solid #3b82f630",
            borderRadius: "12px",
            padding: "1rem",
          }}
        >
          <div className="row text-center">
            {[
              {
                label: "Monthly EMI",
                value: formatCurrency(result.emi),
                color: "var(--secondary)",
              },
              {
                label: "Total Payment",
                value: formatCurrency(result.totalPayment),
                color: "var(--text)",
              },
              {
                label: "Total Interest",
                value: formatCurrency(result.totalInterest),
                color: "var(--danger)",
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
    </div>
  );
};

export default EMICalculator;