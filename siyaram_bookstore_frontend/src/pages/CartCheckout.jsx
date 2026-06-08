// src/pages/CartCheckout.jsx
import React, { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api/ordersApi";
import { useUI } from "../context/UIContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";

const CartCheckout = ({ closeModal }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user,setUser, fetchProfile } = useAuth();
  const { setShowLogin, showToast } = useUI();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const normalize = (res) => {
  if (res?.success !== undefined) return res;
  return {
    success: true,
    data: res,
    message: "",
  };
};
  // =========================
  // 💰 TOTAL
  // =========================
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0
    );
  }, [cartItems]);

  // =========================
  // 📧 SAVE EMAIL FIRST
  // =========================
const handleSaveEmail = async () => {
  try {
    setSavingEmail(true);

    const res = await axiosInstance.patch("users/profile/", {
      email: emailInput,
    });

    const response = normalize(res.data);

    console.log("FULL RESPONSE:", res);
    console.log("NORMALIZED:", response);

    if (response.success) {
      setUser(response.data); // same as Profile.jsx

      await fetchProfile?.(); // optional but safe sync

      showToast("Email updated ✅");
    } else {
      showToast(response.message || "Email update failed");
    }

  } catch (err) {
    console.error("ERROR:", err);
    showToast("Email update failed");
  } finally {
    setSavingEmail(false);
  }
};
  // =========================
  // 🚀 CHECKOUT
  // =========================
  const handleFreeCheckout = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    // 🚨 BLOCK if email still missing
    if (!user.email) {
      showToast("Please add email first");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const payload = {
        items: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        name: user.first_name || user.email || "Guest",
        email: user.email,
      };

      const res = await createOrder(payload);

      if (res && res.success) {
        showToast("🎉 Order created. Redirecting to payment...");

        clearCart();
        closeModal?.();

        navigate(`/payment/${res.data.order_id}`);
      } else {
        showToast(res?.message || "Order failed");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      showToast(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EMPTY CART
  // =========================
  if (cartItems.length === 0)
    return (
      <p className="p-6 text-center text-sm text-gray-500">
        Your cart is empty 😔
      </p>
    );

  return (
    <div className="p-4 space-y-4">

      {/* ITEMS */}
      <div className="space-y-3">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 bg-white border rounded-xl p-3"
          >
            <img
              src={item.cover}
              alt={item.title}
              className="w-16 h-24 object-cover rounded-lg"
            />

            <div className="flex-1">
              <h2 className="text-sm font-semibold">{item.title}</h2>
              <p className="text-xs text-gray-500">{item.author}</p>

              <div className="flex items-center gap-2 mt-2">
                <button
                  className="w-6 h-6 border rounded"
                  onClick={() =>
                    updateQuantity(item.id, Math.max(1, item.quantity - 1))
                  }
                >
                  −
                </button>

                <span className="text-sm">{item.quantity}</span>

                <button
                  className="w-6 h-6 border rounded"
                  onClick={() =>
                    updateQuantity(item.id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between">
              <p className="text-sm font-semibold">
                ₹{item.price * item.quantity}
              </p>

              <button
                className="text-xs text-red-500"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMAIL SECTION */}
      {user && !user.email && (
        <div className="border p-3 rounded-lg bg-yellow-50">
          <p className="text-xs text-gray-600 mb-2">
            Please add email to continue checkout
          </p>

          <input
            type="email"
            placeholder="Enter email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />

          <button
            onClick={handleSaveEmail}
            disabled={savingEmail}
            className="mt-2 w-full bg-black text-white py-2 rounded-lg text-sm"
          >
            {savingEmail ? "Saving..." : "Save Email"}
          </button>
        </div>
      )}

      {/* SHOW EMAIL */}
      {user?.email && (
        <div>
          <p className="text-xs text-gray-500 mb-1">Delivery Email</p>
          <div className="p-2 border rounded-lg bg-gray-50 text-sm">
            {user.email}
          </div>
        </div>
      )}

      {/* TOTAL */}
      <div className="flex justify-between items-center font-semibold border-t pt-3">
        <span>Total</span>
        <span className="text-lg">₹{subtotal}</span>
      </div>

      {/* CTA */}
      {!user ? (
        <button
          className="w-full bg-black text-white py-3 rounded-full"
          onClick={() => setShowLogin(true)}
        >
          Login to Proceed
        </button>
      ) : (
        <button
          disabled={loading || !user.email}
          className="w-full bg-black text-white py-3 rounded-full disabled:opacity-50"
          onClick={handleFreeCheckout}
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      )}
    </div>
  );
};

export default CartCheckout;