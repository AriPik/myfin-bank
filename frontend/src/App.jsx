import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Common pages
import LandingPage from "./pages/common/LandingPage";
import CustomerLogin from "./pages/common/CustomerLogin";
import CustomerRegister from "./pages/common/CustomerRegister";
import AdminLogin from "./pages/common/AdminLogin";
import ForgotPassword from "./pages/common/ForgotPassword";
import ForgotPasswordAdmin from "./pages/common/ForgotPasswordAdmin";

// Customer pages
import CustomerDashboard from "./pages/customer/Dashboard";
import Accounts from "./pages/customer/Accounts";
import Passbook from "./pages/customer/Passbook";
import Transfer from "./pages/customer/Transfer";
import Loans from "./pages/customer/Loans";
import FixedDeposit from "./pages/customer/FixedDeposit";
import RecurringDeposit from "./pages/customer/RecurringDeposit";
import Beneficiaries from "./pages/customer/Beneficiaries";
import Support from "./pages/customer/Support";
import Profile from "./pages/customer/Profile";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import Customers from "./pages/admin/Customers";
import AdminAccounts from "./pages/admin/Accounts";
import AdminLoans from "./pages/admin/Loans";
import AdminSupport from "./pages/admin/Support";
import Reports from "./pages/admin/Reports";

import "./App.css";

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login/customer" element={<CustomerLogin />} />
      <Route path="/register" element={<CustomerRegister />} />
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot-password/admin" element={<ForgotPasswordAdmin />} />
      {/* Customer protected routes */}
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute role="CUSTOMER">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/accounts"
        element={
          <ProtectedRoute role="CUSTOMER">
            <Accounts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/passbook"
        element={
          <ProtectedRoute role="CUSTOMER">
            <Passbook />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/transfer"
        element={
          <ProtectedRoute role="CUSTOMER">
            <Transfer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/loans"
        element={
          <ProtectedRoute role="CUSTOMER">
            <Loans />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/fixed-deposit"
        element={
          <ProtectedRoute role="CUSTOMER">
            <FixedDeposit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/recurring-deposit"
        element={
          <ProtectedRoute role="CUSTOMER">
            <RecurringDeposit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/beneficiaries"
        element={
          <ProtectedRoute role="CUSTOMER">
            <Beneficiaries />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/support"
        element={
          <ProtectedRoute role="CUSTOMER">
            <Support />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute role="CUSTOMER">
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Admin protected routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/customers"
        element={
          <ProtectedRoute role="ADMIN">
            <Customers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/accounts"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminAccounts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/loans"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLoans />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/support"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminSupport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute role="ADMIN">
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;