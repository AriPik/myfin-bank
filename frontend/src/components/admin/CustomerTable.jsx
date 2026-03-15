import { formatDateOnly } from "../../utils/formatCurrency";

const CustomerTable = ({
  customers,
  onActivate,
  onReject,
  onSelect,
  selectedId,
}) => {
  const getStatusColor = (status) => {
    const map = {
      ACTIVE: "var(--success)",
      PENDING_VERIFICATION: "var(--accent)",
      REJECTED: "var(--danger)",
    };
    return map[status] || "var(--text-light)";
  };

  return (
    <div
      className="myfin-card"
      style={{ padding: 0, overflow: "hidden" }}
    >
      <table className="table myfin-table mb-0">
        <thead>
          <tr>
            <th style={{ padding: "1rem" }}>Customer</th>
            <th>Email</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "var(--text-light)",
                }}
              >
                No customers found
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr
                key={customer.customerId}
                onClick={() => onSelect(customer.customerId)}
                style={{
                  cursor: "pointer",
                  background:
                    selectedId === customer.customerId
                      ? "rgba(30,64,175,0.05)"
                      : "transparent",
                }}
              >
                <td style={{ padding: "0.75rem 1rem" }}>
                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "0.875rem",
                    }}
                  >
                    {customer.name}
                  </div>
                  <div
                    style={{
                      color: "var(--text-light)",
                      fontSize: "0.75rem",
                    }}
                  >
                    {customer.customerId}
                  </div>
                </td>
                <td
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-light)",
                  }}
                >
                  {customer.email}
                </td>
                <td>
                  <span
                    style={{
                      background: `${getStatusColor(customer.status)}20`,
                      color: getStatusColor(customer.status),
                      border: `1px solid ${getStatusColor(customer.status)}40`,
                      borderRadius: "20px",
                      padding: "0.2rem 0.6rem",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                    }}
                  >
                    {customer.status === "PENDING_VERIFICATION"
                      ? "PENDING"
                      : customer.status}
                  </span>
                </td>
                <td
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-light)",
                  }}
                >
                  {formatDateOnly(customer.createdAt)}
                </td>
                <td>
                  <div
                    style={{ display: "flex", gap: "0.4rem" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {customer.status !== "ACTIVE" && (
                      <button
                        onClick={() =>
                          onActivate(customer.customerId)
                        }
                        style={{
                          background:
                            "rgba(16,185,129,0.1)",
                          border:
                            "1px solid rgba(16,185,129,0.3)",
                          color: "var(--success)",
                          borderRadius: "6px",
                          padding: "0.3rem 0.6rem",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                      >
                        ✓ Activate
                      </button>
                    )}
                    {customer.status !== "REJECTED" && (
                      <button
                        onClick={() =>
                          onReject(customer.customerId)
                        }
                        style={{
                          background:
                            "rgba(239,68,68,0.1)",
                          border:
                            "1px solid rgba(239,68,68,0.3)",
                          color: "var(--danger)",
                          borderRadius: "6px",
                          padding: "0.3rem 0.6rem",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                      >
                        ✗ Reject
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;