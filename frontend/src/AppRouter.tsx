// React import not required with the new JSX transform
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { App } from "./App";
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
export function AppRouter() {
  return <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
    </BrowserRouter>;
}