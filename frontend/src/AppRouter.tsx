// React import not required with the new JSX transform
import { BrowserRouter, Routes, Route } from "react-router-dom";
//import { App } from "./App";
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { WasteReports } from './pages/WasteReports';
import { UserReports } from './pages/UserReports';
import { PaymentReports } from './pages/PaymentReports';
import { CustomReports } from './pages/CustomReports';
// Payment pages (JSX files)
// Use .jsx extensions explicitly to avoid TS resolver issues without type declarations
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PaymentDashboard from './payment/paymentDashboard.jsx';
// @ts-ignore
import PaymentCheckout from './payment/PaymentCheckout.jsx';
// @ts-ignore
import TransactionHistory from './payment/TransactionHistory.jsx';
// @ts-ignore
import PaymentStatus from './payment/PaymentStatus.jsx';
import DashboardPage from "./pages/DashboardPage.js";
import CreateRoutePage from "./pages/CreateRoutePage.js";
import EditRoutePage from "./pages/EditRoutePage.js";

export function AppRouter() {
  return <AuthProvider>
      <BrowserRouter>
        <Routes>
  {/* Public routes */}
  {/* <Route path="/" element={<DashboardPage />} /> */}
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />

  {/* Payment routes */}
  <Route path="/payment" element={<PaymentDashboard />} />
  <Route path="/checkout" element={<PaymentCheckout />} />
  <Route path="/transactions" element={<TransactionHistory />} />
  <Route path="/payment/status/:id" element={<PaymentStatus />} />

  {/* Admin routes (protected) */}
  <Route
    path="/admin"
    element={
      <ProtectedRoute roles={['admin', 'staff']}>
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    {/* index = /admin */}
    <Route index element={<Dashboard />} />

    {/* nested relative routes */}
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="waste-reports" element={<WasteReports />} />
    <Route path="user-reports" element={<UserReports />} />
    <Route path="payment-reports" element={<PaymentReports />} />
    <Route path="custom-reports" element={<CustomReports />} />

    {/* Route management pages */}
    <Route path="create-route" element={<CreateRoutePage />} />
    <Route path="edit-route/:id" element={<EditRoutePage />} />
  </Route>

  {/* Optional fallback */}
  <Route path="*" element={<Login />} />
</Routes>
      </BrowserRouter>
    </AuthProvider>;
}