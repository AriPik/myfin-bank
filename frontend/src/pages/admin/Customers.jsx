import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Sidebar from "../../components/common/Sidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import axiosInstance from "../../services/axiosInstance";
import { formatDateOnly } from "../../utils/formatCurrency";
import { FiUsers, FiCheck, FiX } from "react-icons/fi";
const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerAccounts, setCustomerAccounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosInstance.get(
                "/admin/customers/all"
            );
            setCustomers(data.customers);
        } catch (error) {
            toast.error("Failed to load customers");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCustomerDetails = async (customerId) => {
        try {
            const { data } = await axiosInstance.get(
                `/admin/customers/${customerId}`
            );
            setSelectedCustomer(data.customer);
            setCustomerAccounts(data.accounts);
        } catch (error) {
            toast.error("Failed to load customer details");
        }
    };

    const handleActivate = async (customerId) => {
        try {
            await axiosInstance.patch(
                `/admin/customers/${customerId}/activate`
            );
            toast.success("Customer activated successfully!");
            fetchCustomers();
            if (selectedCustomer?.customerId === customerId) {
                fetchCustomerDetails(customerId);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to activate customer"
            );
        }
    };

    const handleReject = async (customerId) => {
        try {
            await axiosInstance.patch(
                `/admin/customers/${customerId}/reject`
            );
            toast.success("Customer rejected!");
            fetchCustomers();
            if (selectedCustomer?.customerId === customerId) {
                fetchCustomerDetails(customerId);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to reject customer"
            );
        }
    };

    const getStatusColor = (status) => {
        const map = {
            ACTIVE: "var(--success)",
            PENDING_VERIFICATION: "var(--accent)",
            REJECTED: "var(--danger)",
        };
        return map[status] || "var(--text-light)";
    };

    const filteredCustomers = customers.filter((c) => {
        const matchesSearch =
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.customerId
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "ALL" || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

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
                        <FiUsers/> Customer Management
                    </h4>
                    <p style={{ color: "var(--text-light)", margin: 0 }}>
                        Manage all registered customers
                    </p>
                </motion.div>

                <div className="row">
                    {/* Customers List */}
                    <div
                        className={
                            selectedCustomer ? "col-lg-5" : "col-12"
                        }
                    >
                        {/* Search + Filter */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="myfin-card mb-3"
                            style={{ padding: "1rem" }}
                        >
                            <div className="d-flex gap-2 flex-wrap">
                                <input
                                    type="text"
                                    placeholder="Search by name, email or ID..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="myfin-input"
                                    style={{ flex: 1, minWidth: "200px" }}
                                />
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="myfin-input"
                                    style={{ width: "auto" }}
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="PENDING_VERIFICATION">
                                        Pending
                                    </option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                            </div>
                        </motion.div>

                        {/* Customers Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="myfin-card"
                            style={{ padding: 0, overflow: "hidden" }}
                        >
                            <table className="table myfin-table mb-0">
                                <thead>
                                    <tr>
                                        <th style={{ padding: "1rem" }}>
                                            Customer
                                        </th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCustomers.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={3}
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
                                        filteredCustomers.map((customer) => (
                                            <tr
                                                key={customer.customerId}
                                                style={{
                                                    cursor: "pointer",
                                                    background:
                                                        selectedCustomer?.customerId ===
                                                            customer.customerId
                                                            ? "rgba(30,64,175,0.05)"
                                                            : "transparent",
                                                }}
                                                onClick={() =>
                                                    fetchCustomerDetails(
                                                        customer.customerId
                                                    )
                                                }
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
                                                <td>
                                                    <span
                                                        style={{
                                                            background: `${getStatusColor(customer.status)}20`,
                                                            color: getStatusColor(
                                                                customer.status
                                                            ),
                                                            border: `1px solid ${getStatusColor(customer.status)}40`,
                                                            borderRadius: "20px",
                                                            padding: "0.2rem 0.6rem",
                                                            fontSize: "0.75rem",
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        {customer.status ===
                                                            "PENDING_VERIFICATION"
                                                            ? "PENDING"
                                                            : customer.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "0.4rem",
                                                        }}
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        {customer.status !==
                                                            "ACTIVE" && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleActivate(
                                                                            customer.customerId
                                                                        )
                                                                    }
                                                                    style={{
                                                                        background:
                                                                            "rgba(16,185,129,0.1)",
                                                                        border:
                                                                            "1px solid rgba(16,185,129,0.3)",
                                                                        color: "var(--success)",
                                                                        borderRadius: "6px",
                                                                        padding:
                                                                            "0.3rem 0.6rem",
                                                                        cursor: "pointer",
                                                                        fontSize: "0.75rem",
                                                                        fontWeight: "600",
                                                                    }}
                                                                >
                                                                    <FiCheck style={{ marginRight: "4px" }} /> Activate
                                                                </button>
                                                            )}
                                                        {customer.status !==
                                                            "REJECTED" && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleReject(
                                                                            customer.customerId
                                                                        )
                                                                    }
                                                                    style={{
                                                                        background:
                                                                            "rgba(239,68,68,0.1)",
                                                                        border:
                                                                            "1px solid rgba(239,68,68,0.3)",
                                                                        color: "var(--danger)",
                                                                        borderRadius: "6px",
                                                                        padding:
                                                                            "0.3rem 0.6rem",
                                                                        cursor: "pointer",
                                                                        fontSize: "0.75rem",
                                                                        fontWeight: "600",
                                                                    }}
                                                                >
                                                                    <FiX /> Reject
                                                                </button>
                                                            )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </motion.div>
                    </div>

                    {/* Customer Details Panel */}
                    {selectedCustomer && (
                        <div className="col-lg-7 mt-3 mt-lg-0">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="myfin-card"
                            >
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5
                                        style={{
                                            fontWeight: "700",
                                            margin: 0,
                                        }}
                                    >
                                        Customer Details
                                    </h5>
                                    <button
                                        onClick={() =>
                                            setSelectedCustomer(null)
                                        }
                                        style={{
                                            background: "none",
                                            border: "none",
                                            fontSize: "1.25rem",
                                            cursor: "pointer",
                                            color: "var(--text-light)",
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Customer Info */}
                                <div
                                    style={{
                                        background: "var(--background)",
                                        borderRadius: "12px",
                                        padding: "1rem",
                                        marginBottom: "1rem",
                                    }}
                                >
                                    <div className="row">
                                        {[
                                            {
                                                label: "Full Name",
                                                value: selectedCustomer.name,
                                            },
                                            {
                                                label: "Email",
                                                value: selectedCustomer.email,
                                            },
                                            {
                                                label: "Customer ID",
                                                value: selectedCustomer.customerId,
                                            },
                                            {
                                                label: "Phone",
                                                value: selectedCustomer.phone,
                                            },
                                            {
                                                label: "Gov ID Type",
                                                value: selectedCustomer.govIdType,
                                            },
                                            {
                                                label: "Gov ID Number",
                                                value: selectedCustomer.govIdNumber,
                                            },
                                            {
                                                label: "Status",
                                                value: selectedCustomer.status,
                                            },
                                            {
                                                label: "Registered On",
                                                value: formatDateOnly(
                                                    selectedCustomer.createdAt
                                                ),
                                            },
                                        ].map((item, index) => (
                                            <div
                                                key={index}
                                                className="col-6 mb-2"
                                            >
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
                                                        fontWeight: "600",
                                                        fontSize: "0.875rem",
                                                    }}
                                                >
                                                    {item.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Address */}
                                    <div className="mt-2">
                                        <div
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "var(--text-light)",
                                            }}
                                        >
                                            Address
                                        </div>
                                        <div
                                            style={{
                                                fontWeight: "600",
                                                fontSize: "0.875rem",
                                            }}
                                        >
                                            {selectedCustomer.address}
                                        </div>
                                    </div>

                                    {/* Document */}
                                    {selectedCustomer.govIdDocumentPath && (
                                        <div className="mt-2">
                                            <div
                                                style={{
                                                    fontSize: "0.75rem",
                                                    color: "var(--text-light)",
                                                    marginBottom: "0.25rem",
                                                }}
                                            >
                                                Uploaded Document
                                            </div>
                                            <a
                                                href={`http://localhost:5001/${selectedCustomer.govIdDocumentPath}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{
                                                    color: "var(--secondary)",
                                                    fontWeight: "600",
                                                    fontSize: "0.875rem",
                                                    textDecoration: "none",
                                                }}
                                            >
                                                📄 View Document →
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Customer Accounts */}
                                <h6
                                    style={{
                                        fontWeight: "700",
                                        marginBottom: "0.75rem",
                                    }}
                                >
                                    Accounts ({customerAccounts.length})
                                </h6>
                                {customerAccounts.length === 0 ? (
                                    <p
                                        style={{
                                            color: "var(--text-light)",
                                            fontSize: "0.875rem",
                                        }}
                                    >
                                        No accounts yet
                                    </p>
                                ) : (
                                    customerAccounts.map((account) => (
                                        <div
                                            key={account.accountNumber}
                                            style={{
                                                background: "var(--background)",
                                                borderRadius: "10px",
                                                padding: "0.75rem",
                                                marginBottom: "0.5rem",
                                                border: "1px solid var(--border)",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
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
                                            <div style={{ textAlign: "right" }}>
                                                <div
                                                    style={{
                                                        fontWeight: "700",
                                                        color: "var(--secondary)",
                                                    }}
                                                >
                                                    ₹{account.balance}
                                                </div>
                                                <span
                                                    style={{
                                                        fontSize: "0.75rem",
                                                        color:
                                                            account.status === "ACTIVE"
                                                                ? "var(--success)"
                                                                : "var(--accent)",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    {account.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Customers;