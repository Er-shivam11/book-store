// src/routes/AdminRoute.jsx
import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { setShowLogin, showToast } = useUI();

  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!loading && !user && !hasTriggered.current) {
      setShowLogin(true);
      hasTriggered.current = true;
      return;
    }

    if (!loading && user && !user.is_staff && !hasTriggered.current) {
      showToast("Access denied: Admins only", "error");
      hasTriggered.current = true;
    }
  }, [user, loading, setShowLogin, showToast]);

  // ⏳ Loading
  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  // ❌ Not logged in → redirect
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ❌ Not admin → redirect
  if (!user.is_staff) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
};

export default AdminRoute;