// src/components/Navbar.jsx

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useEffect, useRef } from "react";
import CartCheckout from "../pages/CartCheckout";
import Login from "../pages/Login";
import { useUI } from "../context/UIContext";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { showLogin, setShowLogin } = useUI();
  const navigate = useNavigate();
  const handleLogout = async () => {
  try {
    await logout();
  } catch (err) {
    console.error(err);
  } finally {
    setProfileOpen(false);
    navigate("/");
  }
};
  const [showCart, setShowCart] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileOpen]);

  const getInitials = (name) => String(name || "U").split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <>
      {/* ✅ TRANSPARENT GLASS NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 
        bg-white/70 backdrop-blur-lg 
        border-b border-gray-200/50 
        px-6 py-3 flex justify-between items-center">

        {/* LOGO */}
        <Link
          to="/"
          className="font-bold text-lg text-gray-900 tracking-tight hover:opacity-80 transition"
        >
          Siyaram
        </Link>

        <div className="flex items-center space-x-4">

          {/* USER SECTION */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen((prev) => !prev);
                }}
                className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 
                flex items-center justify-center text-sm font-semibold 
                hover:ring-2 hover:ring-gray-300 transition"
              >
                {getInitials(user.username)}
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 
                  bg-white/95 backdrop-blur-md 
                  text-gray-800 rounded-xl shadow-lg border 
                  overflow-hidden z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  

                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm transition"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile
                  </Link>
                {user?.is_staff && (
                <Link
                  to="/admin"
                  className="block px-4 py-2 hover:bg-gray-100 text-sm transition"
                  onClick={() => setProfileOpen(false)}
                >
                  Admin Dashboard
                </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="bg-black text-white px-4 py-1.5 rounded-full text-sm 
              hover:bg-gray-800 transition"
            >
              Login
            </button>
          )}

          {/* CART BUTTON */}
          <button
            onClick={() => setShowCart(true)}
            className="relative bg-gray-100 px-3 py-1.5 rounded-full 
            hover:bg-gray-200 transition"
          >
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* ✅ Spacer (IMPORTANT for fixed navbar) */}
      <div className="h-16" />

      {/* CART SLIDER (UNCHANGED) */}
      {showCart && (
        <>
          <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-xl z-50">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-bold">Checkout</h2>
              <button
                className="text-gray-600 hover:text-gray-900 text-lg font-bold"
                onClick={() => setShowCart(false)}
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto h-full">
              <CartCheckout closeModal={() => setShowCart(false)} />
            </div>
          </div>

          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setShowCart(false)}
          />
        </>
      )}

      {/* LOGIN MODAL (UNCHANGED) */}
      {showLogin && (
        <Login closeModal={() => setShowLogin(false)} />
      )}
    </>
  );
};

export default Navbar;