// src/api/ordersApi.js
import axiosInstance from "./axiosConfig";

// =========================
// 🛒 CREATE ORDER
// =========================
export const createOrder = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/orders/create-order/",
      payload
    );

    return response; // already normalized
  } catch (error) {
    return {
      success: false,
      message: error?.message || "Order failed",
      errors: error?.errors || {},
    };
  }
};

// =========================
// 📦 GET ALL ORDERS
// =========================
export const getAllOrders = async () => {
  try {
    const response = await axiosInstance.get("/orders/orders/");
    return response; // ✅ FIXED
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);
    throw error;
  }
};

// =========================
// 👤 GET MY ORDERS
// =========================
export const getMyOrders = async () => {
  try {
    const response = await axiosInstance.get("/orders/my-orders/");
    return response; // ✅ FIXED
  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error);
    throw error;
  }
};

// =========================
// 💳 CONFIRM PAYMENT
// =========================
export const confirmPayment = async (orderId, payload) => {
  try {
    const response = await axiosInstance.post(
      `/orders/confirm-payment/${orderId}/`,
      payload
    );

    return response; // ✅ FIXED
  } catch (error) {
    console.error("CONFIRM PAYMENT ERROR:", error);
    throw error;
  }
};

// =========================
// 💰 GET PAYMENTS
// =========================
export const getPayments = async () => {
  try {
    const response = await axiosInstance.get("/orders/payments/");
    return response; // ✅ FIXED
  } catch (error) {
    console.error("GET PAYMENTS ERROR:", error);
    throw error;
  }
};

// =========================
// 📄 GET ORDER DETAIL
// =========================
export const getOrderDetail = async (orderId) => {
  try {
    const response = await axiosInstance.get(
      `/orders/orders/${orderId}/`
    );

    return response;
  } catch (error) {
    console.error("GET ORDER DETAIL ERROR:", error);
    throw error;
  }
};