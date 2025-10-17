// React import not required with the new JSX transform
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { App } from "./App";
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
import PaymentDashboard from './payment/PaymentDashboard.js';
// @ts-ignore
import PaymentCheckout from './payment/PaymentCheckout.js';
// @ts-ignore
import TransactionHistory from './payment/TransactionHistory.js';
// @ts-ignore
import PaymentStatus from './payment/PaymentStatus.js';

export function AppRouter() {
  return <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Payments */}
          <Route path="/payment" element={<PaymentDashboard />} />
          <Route path="/checkout" element={<PaymentCheckout />} />
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route path="/payment/status/:id" element={<PaymentStatus />} />
          
          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin', 'staff']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="waste-reports" element={<WasteReports />} />
            <Route path="user-reports" element={<UserReports />} />
            <Route path="payment-reports" element={<PaymentReports />} />
            <Route path="custom-reports" element={<CustomReports />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>;
}