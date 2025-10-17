// React import not required with the new JSX transform
import { BrowserRouter, Routes, Route } from "react-router-dom";
// @ts-ignore: jsx module without types
import { App } from "./App.jsx";
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ProfilePage } from './pages/ProfilePage';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { AdminIssuePage } from './pages/AdminIssuePage';
import { AdminLayout } from './components/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { WasteReports } from './pages/WasteReports';
import { UserReports } from './pages/UserReports';
import { PaymentReports } from './pages/PaymentReports';
import { CustomReports } from './pages/CustomReports';
import { PaymentsPage } from './pages/PaymentsPage';
import { PaybackPage } from './pages/PaybackPage';
import { AdminPricingPage } from './pages/AdminPricingPage';
import { PaymentSummaryPage } from './pages/PaymentSummaryPage';
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

export function AppRouter() {
  return <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/issues" element={<ReportIssuePage />} />
          <Route path="/admin/issues" element={<AdminIssuePage />} />
          
          {/* Payments */}
          <Route path="/payment" element={<PaymentDashboard />} />
          <Route path="/checkout" element={<PaymentCheckout />} />
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route path="/payment/status/:id" element={<PaymentStatus />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/paybacks" element={<PaybackPage />} />
          
          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="waste-reports" element={<WasteReports />} />
            <Route path="user-reports" element={<UserReports />} />
            <Route path="payment-reports" element={<PaymentReports />} />
            <Route path="custom-reports" element={<CustomReports />} />
            <Route path="pricing" element={<AdminPricingPage />} />
            <Route path="payments-summary" element={<PaymentSummaryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>;
}