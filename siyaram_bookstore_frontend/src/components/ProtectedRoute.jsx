import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { setShowLogin } = useUI();

  const hasTriggeredLogin = useRef(false);

  useEffect(() => {
    if (!loading && !user && !hasTriggeredLogin.current) {
      setShowLogin(true); // optional modal
      hasTriggeredLogin.current = true;
    }
  }, [user, loading, setShowLogin]);

  // ⏳ While checking auth
  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  // ❌ Not logged in → REDIRECT
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ✅ Authorized
  return children;
};

export default ProtectedRoute;