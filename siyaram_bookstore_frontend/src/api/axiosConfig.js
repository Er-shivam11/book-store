// src/api/axiosConfig.js
import axios from "axios";

// =========================
// 🌍 BASE URL (can be moved to .env later)
// =========================
const BASE_URL = "http://localhost:8000/api/";

// =========================
// 🚀 AXIOS INSTANCE
// =========================
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================
// 🔐 TOKEN HELPERS
// =========================
export const getAccessToken = () => localStorage.getItem("access");
export const getRefreshToken = () => localStorage.getItem("refresh");

export const setTokens = (access, refresh) => {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
};

export const clearTokens = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");

  // notify app logout
  window.dispatchEvent(new Event("logout"));
};

// =========================
// 🚀 REQUEST INTERCEPTOR
// =========================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =========================
// 🔄 RESPONSE INTERCEPTOR
// =========================
axiosInstance.interceptors.response.use(
  (response) => {
    // ✅ normalize backend response here
    return response.data;
  },

  async (error) => {
    const originalRequest = error.config;

    // =========================
    // 🔁 TOKEN REFRESH FLOW
    // =========================
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        // ⚠️ use plain axios to avoid interceptor loop
        const { data } = await axios.post(
          `${BASE_URL}users/token/refresh/`,
          {
            refresh: getRefreshToken(),
          }
        );

        const newAccess = data.access;

        setTokens(newAccess, getRefreshToken());

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        clearTokens();
        return Promise.reject({
          success: false,
          message: "Session expired. Please login again.",
        });
      }
    }

    // =========================
    // ❌ STANDARD ERROR FORMAT
    // =========================
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject({
      success: false,
      message: "Network error",
    });
  }
);

export default axiosInstance;