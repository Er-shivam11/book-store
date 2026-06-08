// src/pages/Profile.jsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useUI } from "../context/UIContext";

const Profile = () => {
  const { user, logout, setUser,fetchProfile } = useAuth();
  const { setShowLogin, showToast } = useUI();
  const navigate = useNavigate();
  const {  } = useUI();

  const [form, setForm] = useState({
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
  fetchProfile();   // ALWAYS fetch fresh profile
}, []);

 // =========================
// 📦 NORMALIZE RESPONSE
// =========================
const normalize = (res) => {
  if (res?.success !== undefined) return res;
  return {
    success: true,
    data: res,
    message: "",
  };
};

// =========================
// 📦 SAFE ARRAY EXTRACTOR
// =========================
const extractArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

// =========================
// 📥 FETCH ORDERS
// =========================
useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("orders/my-orders/");
      const response = normalize(res.data);

      if (response.success) {
        const safeOrders = extractArray(response.data);
        setOrders(safeOrders);
      } else {
        showToast(response.message || "Failed to load orders", "error");
        setOrders([]);
      }
    } catch (err) {
      console.error("Orders fetch error:", err);
      showToast("Failed to load orders", "error");
      setOrders([]);
    }
  };

  fetchOrders();
}, []);

  if (!user) {
    return (
      <p className="p-6 text-center text-gray-500">
        No user logged in.
      </p>
    );
  }

  // =========================
  // 💾 UPDATE PROFILE
  // =========================
  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.patch("users/profile/", form);
      const response = normalize(res.data);

      if (response.success) {
        setUser(response.data);
        setEditing(false);
        showToast("Profile updated ✅");
      } else {
        showToast(response.message || "Update failed", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      setShowLogin(false); 
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-b from-white via-gray-50 to-gray-100">

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* LEFT PANEL */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-lg font-semibold">
              {(user.first_name || user.mobile)?.[0]?.toUpperCase()}
            </div>

            <h2 className="mt-3 font-semibold text-lg text-gray-900">
              {user.first_name || user.mobile}
            </h2>

            <p className="text-xs text-gray-500">
              {user.email || "No email"}
            </p>
          </div>

          <div className="space-y-4 text-sm">

            <div>
              <label className="text-xs text-gray-500">First Name</label>
              {editing ? (
                <input
                  value={form.first_name}
                  onChange={(e) =>
                    setForm({ ...form, first_name: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              ) : (
                <p className="mt-1 text-gray-800">
                  {user.first_name || "-"}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-500">Last Name</label>
              {editing ? (
                <input
                  value={form.last_name}
                  onChange={(e) =>
                    setForm({ ...form, last_name: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              ) : (
                <p className="mt-1 text-gray-800">
                  {user.last_name || "-"}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-500">Email</label>
              {editing ? (
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              ) : (
                <p className="mt-1 text-gray-800">
                  {user.email || "-"}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-4">

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="w-full bg-black text-white py-2.5 rounded-full hover:bg-gray-800"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-black text-white py-2.5 rounded-full"
                >
                  {loading ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-full"
                >
                  Cancel
                </button>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="w-full text-red-600 border border-red-200 py-2.5 rounded-full hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Order History
          </h2>

          {orders.length === 0 ? (
            <p className="text-sm text-gray-500">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-xl p-4 space-y-4 bg-white shadow-sm"
                >
                  <div className="flex justify-between">
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="font-semibold">₹{order.total_amount}</p>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <span
                      className={
                        order.status === "SUCCESS"
                          ? "text-green-600 font-medium"
                          : "text-yellow-600 font-medium"
                      }
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 text-left">
                        <tr>
                          <th className="p-2">Book</th>
                          <th className="p-2">Qty</th>
                          <th className="p-2">Price</th>
                        </tr>
                      </thead>

                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="p-2">{item.product_title}</td>
                            <td className="p-2">{item.quantity}</td>
                            <td className="p-2">₹{item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleString()}
                  </div>

                  {order.invoice_url ? (
                    <a
                      href={`http://localhost:8000${order.invoice_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-black text-white px-4 py-2 rounded-full text-sm"
                    >
                      Download Invoice PDF
                    </a>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Invoice is being generated...
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;