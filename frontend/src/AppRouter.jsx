// React import not required with the new JSX transform
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { App } from "./App";
import { Login } from './components/pages/Login';
import { Signup } from './components/pages/Signup';
export function AppRouter() {
  return <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/payment" element={<PaymentDashboard />} />
          <Route path="/checkout" element={<PaymentCheckout />} />
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route path="/payment/status/:id" element={<PaymentStatus />} />
        </Routes>
    </BrowserRouter>;
}