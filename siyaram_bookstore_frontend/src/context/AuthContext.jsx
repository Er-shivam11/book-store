// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import axiosInstance, {
  setTokens,
  clearTokens,
  getRefreshToken,
} from "../api/axiosConfig";
import { useUI } from "./UIContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { showToast } = useUI();

  // =========================
  // 🔐 LOGIN
  // =========================
  // =========================
// 🔐 LOGIN
// =========================
const login = async (mobile, password) => {
  try {
    const res = await axiosInstance.post("users/login/", {
      mobile,
      password,
    });

    // 🔥 FORCE NORMALIZATION
    const response = res?.success ? res : res?.data;

    console.log("LOGIN NORMALIZED:", response);

    if (!response?.success) {
      showToast(response?.message || "Login failed", "error");
      return false;
    }

    const { access, refresh, user } = response.data;

    setTokens(access, refresh);
    // setUser(user);
    // ✅ Instead
    await fetchProfile();

    showToast("Login successful ✅");
    return true;
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    showToast(err?.message || "Login failed", "error");
    return false;
  }
};
  // =========================
  // 🚪 LOGOUT
  // =========================
  const logout = async () => {
    const refresh = getRefreshToken();

    try {
      if (refresh) {
        await axiosInstance.post("users/logout/", { refresh });
      }
    } catch (err) {
      console.warn("Logout API failed, forcing local logout");
    } finally {
      clearTokens();
      setUser(null);
    }
  };

 // =========================
// 👤 FETCH PROFILE
// =========================
const fetchProfile = async () => {
  try {
    const res = await axiosInstance.get("users/profile/");

    console.log("PROFILE RAW:", res);

    // 🔥 HANDLE BOTH CASES
    const response = res?.success ? res : { success: true, data: res };

    if (!response.success) return;

    setUser(response.data);
  } catch (err) {
    const status = err?.status || err?.response?.status;

    if (status === 401) return;

    console.error("fetchProfile failed:", err);
  }
};
  // =========================
  // 🧠 INITIAL LOAD
  // =========================
  useEffect(() => {
    const refresh = getRefreshToken();

    if (!refresh) {
      setLoading(false);
      return;
    }

    fetchProfile().finally(() => setLoading(false));
  }, []);

  // =========================
  // 🔥 GLOBAL LOGOUT LISTENER
  // =========================
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  // =========================
  // 📦 CONTEXT VALUE
  // =========================
  const value = useMemo(
    () => ({
      user,
      setUser,
      login,
      logout,
      loading,
      fetchProfile,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// =========================
// 🔁 CUSTOM HOOK
// =========================
export const useAuth = () => useContext(AuthContext);