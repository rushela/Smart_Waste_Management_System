// React import is not required with the new JSX transform.
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// General application imports
// @ts-ignore - App is a JSX file
import { App } from './App';
import { Login as UserLogin } from './pages/Login.js';
import { Signup } from './pages/Signup.js';
import { AuthProvider } from './context/AuthContext.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';
import { AdminLayout } from './components/AdminLayout.js';
import { Dashboard as AdminDashboard } from './pages/Dashboard.js';
import { WasteReports } from './pages/WasteReports.js';
import { UserReports } from './pages/UserReports.js';
import { PaymentReports } from './pages/PaymentReports.js';
import { CustomReports } from './pages/CustomReports.js';

// Payment pages (JSX files) – using default imports to avoid TS resolver issues
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PaymentDashboard from './payment/paymentDashboard.jsx';
// @ts-ignore
import PaymentCheckout from './payment/PaymentCheckout.jsx';
// @ts-ignore
import TransactionHistory from './payment/TransactionHistory.jsx';
// @ts-ignore
import PaymentStatus from './payment/PaymentStatus.jsx';

// Worker application imports
import WorkerLogin from './worker/Login';
import WorkerDashboard from './worker/Dashboard';
import ScanPage from './worker/ScanPage';
import History from './worker/History';
import ManualEntry from './worker/ManualEntry';
import Summary from './worker/Summary';
import { AuthProvider as WorkerAuthProvider } from './worker/context/AuthContext';

/**
 * Combined application router. This single router definition serves both the
 * public-facing site (with sign up, login, payment and admin dashboards) and
 * the worker-facing pages (login, dashboard, scanning, history, manual entry
 * and summary). Worker routes have been namespaced under `/worker` to avoid
 * colliding with the public login route.
 */
export function AppRouter() {
  // Layout that scopes the worker Auth context only to /worker routes
  const WorkerLayout = () => (
    <WorkerAuthProvider>
      <Outlet />
    </WorkerAuthProvider>
  );

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / user-facing routes */}
          <Route path="/" element={<App />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<Signup />} />
          {/* Payment routes */}
          <Route path="/payment" element={<PaymentDashboard />} />
          <Route path="/checkout" element={<PaymentCheckout />} />
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route path="/payment/status/:id" element={<PaymentStatus />} />

          {/* Admin dashboard with protected routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin', 'staff']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="waste-reports" element={<WasteReports />} />
            <Route path="user-reports" element={<UserReports />} />
            <Route path="payment-reports" element={<PaymentReports />} />
            <Route path="custom-reports" element={<CustomReports />} />
          </Route>

          {/* Worker routes – namespaced and wrapped with worker auth provider */}
          <Route path="/worker" element={<WorkerLayout />}>
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<WorkerLogin />} />
            <Route path="dashboard" element={<WorkerDashboard />} />
            <Route path="scan" element={<ScanPage />} />
            <Route path="history" element={<History />} />
            <Route path="manual" element={<ManualEntry />} />
            <Route path="summary" element={<Summary />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}