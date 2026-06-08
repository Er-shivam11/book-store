import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { QRCode } from "react-qr-code";

import { confirmPayment, getOrderDetail } from "../api/ordersApi";
import { useUI } from "../context/UIContext";
import { useCart } from "../context/CartContext";

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useUI();
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  // 🟢 NEW STATES
  const [isPaidChecked, setIsPaidChecked] = useState(false);

  const upiId = import.meta.env.VITE_UPI_ID;

  // =========================
  // FETCH ORDER
  // =========================
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderDetail(orderId);

        if (res?.id) {
          setOrder(res);
        } else {
          showToast("Failed to load order");
        }
      } catch (err) {
        showToast("Failed to load order");
      } finally {
        setLoadingOrder(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  // =========================
  // WHATSAPP
  // =========================
  const openWhatsApp = () => {
    const message = `Hi Siyaram Ebook Store, I have completed payment for Order #${order.id} of ₹${order.total_amount}. Please verify and confirm.`;

    const url = `https://wa.me/917977285585?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  // =========================
  // PAYMENT CONFIRM
  // =========================
  const handlePayment = async () => {
    if (!isPaidChecked) {
      showToast("Please confirm payment checkbox");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const res = await confirmPayment(orderId);

      if (res?.success) {
        showToast("Payment submitted successfully");

        clearCart();

        openWhatsApp();

        navigate(`/order-success/${orderId}`);
      } else {
        showToast(res?.message || "Payment failed");
      }
    } catch (err) {
      showToast("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loadingOrder) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load order
      </div>
    );
  }

  const upiLink = `upi://pay?pa=${upiId}&pn=BookStore&am=${order.total_amount}&cu=INR`;

  // =========================
  // UI
  // =========================
  return (
    <div className="max-w-md mx-auto p-6 space-y-5 text-center">

      <h1 className="text-xl font-semibold">Complete Payment</h1>

      {/* ORDER INFO */}
      <div className="text-sm text-gray-500">
        Order ID: #{order.id}
      </div>

      <div className="text-2xl font-bold">
        ₹{order.total_amount}
      </div>

      {/* UPI BOX */}
      <div className="border rounded-xl p-4 space-y-3 bg-gray-50">

        <p className="font-medium">Scan & Pay</p>

        <p className="text-sm text-gray-700">{upiId}</p>

        <div className="flex justify-center bg-white p-3 rounded-lg">
          <QRCode value={upiLink} size={180} />
        </div>

        <p className="text-xs text-gray-400">
          Pay using GPay / PhonePe / Paytm
        </p>
      </div>

      {/* =========================
          CHECKBOX
      ========================= */}
      <div className="flex items-center gap-2 text-sm justify-center">
        <input
          type="checkbox"
          checked={isPaidChecked}
          onChange={() => setIsPaidChecked(!isPaidChecked)}
        />
        <span>I have completed the payment</span>
      </div>

      {/* =========================
          SCREENSHOT NOTE
      ========================= */}
      <p className="text-xs text-gray-500">
       Complete the payment and click the button below by checking the box for faster verification.
      </p>

      {/* BUTTON */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full py-3 rounded-full text-white transition ${
          isPaidChecked ? "bg-black" : "bg-gray-400"
        }`}
      >
        {loading ? "Processing..." : "Confirm & Continue"}
      </button>
    </div>
  );
};

export default Payment;