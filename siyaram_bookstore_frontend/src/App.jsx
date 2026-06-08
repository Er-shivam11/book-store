import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute"; 
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import CartCheckout from "./pages/CartCheckout";
import AdminDashboard from "./pages/AdminDashboard";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { UIProvider, useUI } from "./context/UIContext";
import ResetPassword from "./pages/ResetPassword";

// =========================
// 🍞 GLOBAL TOAST
// =========================
const Toast = () => {
  const { toast } = useUI();

  if (!toast) return null;

  return (
    <div className="fixed top-5 right-5 z-50">
      <div
        className={`px-4 py-2 rounded-lg shadow-lg text-white text-sm animate-fadeIn
          ${toast.type === "error" ? "bg-red-500" : "bg-gray-900"}`}
      >
        {toast.message}
      </div>
    </div>
  );
};

// =========================
// 🧠 APP CONTENT
// =========================
const AppContent = () => {
  return (
    <Router>
      <Navbar />
      <Toast />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* 🔐 USER PROTECTED ROUTE */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetail />} />

        {/* 🔐 CHECKOUT */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CartCheckout />
            </ProtectedRoute>
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/payment/:orderId" element={<Payment />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />

        {/* 🛡️ ADMIN ONLY */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>

      <Footer />
    </Router>
  );
};

// =========================
// 🚀 ROOT APP
// =========================
const App = () => {
  return (
    <UIProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </UIProvider>
  );
};

export default App;