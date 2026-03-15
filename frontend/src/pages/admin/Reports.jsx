import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import toast from "react-hot-toast";
import Sidebar from "../../components/common/Sidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import axiosInstance from "../../services/axiosInstance";
import { formatCurrency } from "../../utils/formatCurrency";
import { FiUsers, FiCreditCard, FiDollarSign, FiTrendingUp, FiBarChart2, FiArrowUp, FiArrowDown, FiClock, FiRefreshCw, FiCalendar } from "react-icons/fi";

const COLORS = ["#1e40af", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const Reports = () => {
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosInstance.get(
                "/admin/reports/summary"
            );
            setSummary(data.summary);
        } catch (error) {
            toast.error("Failed to load reports");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <LoadingSpinner fullScreen />;

    const transactionData = [
        {
            name: "Deposits",
            amount: summary?.transactions?.totalDeposits || 0,
        },
        {
            name: "Withdrawals",
            amount: summary?.transactions?.totalWithdrawals || 0,
        },
        {
            name: "Outstanding Loans",
            amount: summary?.loans?.totalOutstanding || 0,
        },
        {
            name: "FD Holdings",
            amount: summary?.fixedDeposits?.totalAmount || 0,
        },
    ];

    const customerData = [
        {
            name: "Active",
            value: summary?.customers?.active || 0,
        },
        {
            name: "Pending",
            value: summary?.customers?.pending || 0,
        },
        {
            name: "Others",
            value:
                (summary?.customers?.total || 0) -
                (summary?.customers?.active || 0) -
                (summary?.customers?.pending || 0),
        },
    ];

    const accountData = [
        {
            name: "Active",
            value: summary?.accounts?.active || 0,
        },
        {
            name: "AT Risk",
            value: summary?.accounts?.atRisk || 0,
        },
        {
            name: "Others",
            value:
                (summary?.accounts?.total || 0) -
                (summary?.accounts?.active || 0) -
                (summary?.accounts?.atRisk || 0),
        },
    ];

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
                        <FiBarChart2/> Reports & Analytics
                    </h4>
                    <p style={{ color: "var(--text-light)", margin: 0 }}>
                        Bank performance overview
                    </p>
                </motion.div>

                {/* Summary Cards */}
                <div className="row mb-4">
                    {[
                        {
                            title: "Total Customers",
                            value: summary?.customers?.total || 0,
                            sub: `${summary?.customers?.active || 0} Active`,
                            icon: <FiUsers/>,
                            color: "var(--secondary)",
                            delay: 0,
                        },
                        {
                            title: "Total Accounts",
                            value: summary?.accounts?.total || 0,
                            sub: `${summary?.accounts?.active || 0} Active`,
                            icon: <FiCreditCard/>,
                            color: "var(--success)",
                            delay: 0.1,
                        },
                        {
                            title: "Active Loans",
                            value: summary?.loans?.active || 0,
                            sub: formatCurrency(
                                summary?.loans?.totalOutstanding || 0
                            ),
                            icon: <FiDollarSign/>,
                            color: "var(--accent)",
                            delay: 0.2,
                        },
                        {
                            title: "Total FDs",
                            value: summary?.fixedDeposits?.active || 0,
                            sub: formatCurrency(
                                summary?.fixedDeposits?.totalAmount || 0
                            ),
                            icon: <FiTrendingUp/>,
                            color: "#8b5cf6",
                            delay: 0.3,
                        },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="col-sm-6 col-xl-3 mb-3"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: stat.delay }}
                                className="stats-card"
                                style={{ borderLeftColor: stat.color }}
                            >
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <p
                                            style={{
                                                color: "var(--text-light)",
                                                fontSize: "0.875rem",
                                                margin: 0,
                                            }}
                                        >
                                            {stat.title}
                                        </p>
                                        <h3
                                            style={{
                                                fontWeight: "800",
                                                margin: "0.25rem 0 0",
                                            }}
                                        >
                                            {stat.value}
                                        </h3>
                                        <p
                                            style={{
                                                color: stat.color,
                                                fontSize: "0.8rem",
                                                margin: 0,
                                                fontWeight: "600",
                                            }}
                                        >
                                            {stat.sub}
                                        </p>
                                    </div>
                                    <span style={{ fontSize: "2.5rem" }}>
                                        {stat.icon}
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="row mb-4">
                    {/* Bar Chart */}
                    <div className="col-lg-7 mb-4" style={{ display: "flex", flexDirection: "column" }}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="myfin-card"
                            style={{ flex: 1 }}
                        >
                            <h5
                                style={{
                                    fontWeight: "700",
                                    marginBottom: "1.5rem",
                                }}
                            >
                                <FiDollarSign/> Financial Overview
                            </h5>
                            <div style={{ overflowX: "auto" }}>
                                <div style={{ minWidth: "400px" }}>
                                    <ResponsiveContainer width="100%" height={280}>
                                        <BarChart data={transactionData}>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#e2e8f0"
                                            />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fontSize: 11 }}
                                                interval={0}
                                                angle={-15}
                                                textAnchor="end"
                                                height={50}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 11 }}
                                                tickFormatter={(v) =>
                                                    `₹${(v / 1000).toFixed(0)}k`
                                                }
                                            />
                                            <Tooltip
                                                formatter={(value) =>
                                                    formatCurrency(value)
                                                }
                                                contentStyle={{
                                                    borderRadius: "10px",
                                                    border: "1px solid var(--border)",
                                                }}
                                            />
                                            <Bar
                                                dataKey="amount"
                                                fill="#1e40af"
                                                radius={[6, 6, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Pie Charts */}
                    <div className="col-lg-5 mb-4" style={{ display: "flex", flexDirection: "column" }}>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="myfin-card mb-3"
                            style={{ flex: 1 }}
                        >
                            <h6
                                style={{
                                    fontWeight: "700",
                                    marginBottom: "1rem",
                                }}
                            >
                                <FiUsers/> Customer Distribution
                            </h6>
                            <ResponsiveContainer width="100%" height={150}>
                                <PieChart>
                                    <Pie
                                        data={customerData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={65}
                                        dataKey="value"
                                    >
                                        {customerData.map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend
                                        iconSize={10}
                                        wrapperStyle={{ fontSize: "0.75rem" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="myfin-card"
                            style={{ flex: 1 }}
                        >
                            <h6
                                style={{
                                    fontWeight: "700",
                                    marginBottom: "1rem",
                                }}
                            >
                                <FiCreditCard/> Account Distribution
                            </h6>
                            <ResponsiveContainer width="100%" height={150}>
                                <PieChart>
                                    <Pie
                                        data={accountData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={65}
                                        dataKey="value"
                                    >
                                        {accountData.map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend
                                        iconSize={10}
                                        wrapperStyle={{ fontSize: "0.75rem" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </motion.div>
                    </div>
                </div>

                {/* Detailed Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="myfin-card"
                >
                    <h5
                        style={{
                            fontWeight: "700",
                            marginBottom: "1rem",
                        }}
                    >
                        <FiBarChart2/> Detailed Statistics
                    </h5>
                    <div className="row">
                        {[
                            {
                                label: "Total Deposits",
                                value: formatCurrency(
                                    summary?.transactions?.totalDeposits || 0
                                ),
                                icon: <FiArrowUp />,
                                color: "var(--success)",
                            },
                            {
                                label: "Total Withdrawals",
                                value: formatCurrency(
                                    summary?.transactions?.totalWithdrawals ||
                                    0
                                ),
                                icon: <FiArrowDown />,
                                color: "var(--danger)",
                            },
                            {
                                label: "Pending Loans",
                                value: summary?.loans?.pending || 0,
                                icon: <FiClock />,
                                color: "var(--accent)",
                            },
                            {
                                label: "Outstanding Loan Amount",
                                value: formatCurrency(
                                    summary?.loans?.totalOutstanding || 0
                                ),
                                icon: <FiDollarSign />,
                                color: "var(--secondary)",
                            },
                            {
                                label: "Active RDs",
                                value:
                                    summary?.recurringDeposits?.active || 0,
                                icon: <FiRefreshCw />,
                                color: "#06b6d4",
                            },
                            {
                                label: "Monthly RD Amount",
                                value: formatCurrency(
                                    summary?.recurringDeposits
                                        ?.totalMonthlyAmount || 0
                                ),
                                icon: <FiCalendar />,
                                color: "#8b5cf6",
                            },
                        ].map((item, index) => (
                            <div key={index} className="col-md-4 mb-3">
                                <div
                                    style={{
                                        background: "var(--background)",
                                        borderRadius: "10px",
                                        padding: "1rem",
                                        border: "1px solid var(--border)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.75rem",
                                    }}
                                >
                                    <span style={{ fontSize: "1.5rem" }}>
                                        {item.icon}
                                    </span>
                                    <div>
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
                                                fontWeight: "700",
                                                color: item.color,
                                            }}
                                        >
                                            {item.value}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Reports;