// React import not required with the new JSX transform
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.jsx';
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
import { PaymentDashboard } from './pages/PaymentDashboard'; 
import { PaymentCheckout } from "./pages/PaymentCheckout";
import { PaymentEdit } from "./pages/PaymentEdit";
import PaymentDetails from "./pages/PaymentDetails";
import PaymentHistory from "./pages/PaymentHistory";
import PaymentVoid from "./pages/PaymentVoid";
import InvoiceList from "./pages/InvoiceList";


export function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/payments" element={<PaymentDashboard />} />
          <Route path="/checkout" element={<PaymentCheckout />} />
          <Route path="/payments/edit/:id" element={<PaymentEdit />} />
          <Route path="/details" element={<PaymentDetails />} />
          <Route path="/payment-details/:id" element={<PaymentDetails />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/payment-void/:id" element={<PaymentVoid />} />
          <Route path="/invoices" element={<InvoiceList />} />

          {/* Admin Dashboard Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin', 'staff']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="waste-reports" element={<WasteReports />} />
            <Route path="user-reports" element={<UserReports />} />
            <Route path="payment-reports" element={<PaymentReports />} />
            <Route path="custom-reports" element={<CustomReports />} />

            <Route path="payments" element={<PaymentDashboard />} />
            <Route path="checkout" element={<PaymentCheckout />} />
            <Route path="payments/edit/:id" element={<PaymentEdit />} />
            <Route path="details" element={<PaymentDetails />} />
            <Route path="payment-details/:id" element={<PaymentDetails />} />
            <Route path="payment-history" element={<PaymentHistory />} />
            <Route path="payment-void/:id" element={<PaymentVoid />} />
            <Route path="invoices" element={<InvoiceList />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
 