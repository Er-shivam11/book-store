// src/context/UIContext.jsx
import { createContext, useContext, useState, useMemo, useRef } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [toast, setToast] = useState(null);

  const timeoutRef = useRef(null);

  // =========================
  // 🍞 TOAST HANDLER
  // =========================
  const showToast = (message, type = "success") => {
    setToast({ message, type });

    // clear previous timeout if exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  // =========================
  // 📦 CONTEXT VALUE (STABLE)
  // =========================
  const value = useMemo(
    () => ({
      showLogin,
      setShowLogin,
      toast,
      showToast,
    }),
    [showLogin, toast]
  );

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);