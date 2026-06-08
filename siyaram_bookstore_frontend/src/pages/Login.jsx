import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axiosConfig";

const Login = ({ closeModal }) => {
  const { login } = useAuth();

  // =========================
  // STATE
  // =========================
  const [showPassword, setShowPassword] = useState(false);
  const [isForgot, setIsForgot] = useState(false);

  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });

  const [resetForm, setResetForm] = useState({
    mobile: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // =========================
  // LOGIN
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isForgot) return;

    setError(null);

    if (!form.mobile || !form.password) {
      setError("Mobile and password required");
      return;
    }

    if (loading) return;
    setLoading(true);

    const success = await login(form.mobile, form.password);

    setLoading(false);

    if (success) {
      closeModal?.();
    } else {
      setError("Login failed. Please check credentials.");
    }
  };

  // =========================
  // RESET PASSWORD
  // =========================
  const handleResetPassword = async () => {
    setError(null);

    if (!resetForm.mobile || !resetForm.password) {
      setError("Mobile and new password required");
      return;
    }

    try {
      await axios.post("/users/reset-password/", {
        mobile: resetForm.mobile,
        password: resetForm.password,
      });

      alert("Password updated successfully");

      setIsForgot(false);
      setResetForm({ mobile: "", password: "" });
    } catch (err) {
      setError("Password reset failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">

        {/* CLOSE */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          ×
        </button>

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold">
            {isForgot ? "Reset Password" : "Welcome back"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isForgot
              ? "Enter mobile and new password"
              : "Login to continue your journey"}
          </p>
        </div>

        {/* TOGGLE */}
        <div className="text-right mb-3">
          <button
            type="button"
            onClick={() => setIsForgot(!isForgot)}
            className="text-xs text-blue-500 hover:underline"
          >
            {isForgot ? "Back to Login" : "Forgot Password?"}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="text-red-500 text-xs text-center mb-3">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* =========================
              LOGIN MODE
          ========================= */}
          {!isForgot && (
            <>
              {/* MOBILE */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={form.mobile}
                  onChange={(e) =>
                    setForm({ ...form, mobile: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border rounded-lg"
                />
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <label className="text-xs text-gray-500 mb-1 block">
                  Password
                </label>

                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border rounded-lg"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-xs text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </>
          )}

          {/* =========================
              FORGOT MODE
          ========================= */}
          {isForgot && (
            <>
              {/* MOBILE */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={resetForm.mobile}
                  onChange={(e) =>
                    setResetForm({
                      ...resetForm,
                      mobile: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2.5 border rounded-lg"
                />
              </div>

              {/* NEW PASSWORD */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  New Password
                </label>
                <input
                  type="password"
                  value={resetForm.password}
                  onChange={(e) =>
                    setResetForm({
                      ...resetForm,
                      password: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2.5 border rounded-lg"
                />
              </div>

              {/* RESET BUTTON */}
              <button
                type="button"
                onClick={handleResetPassword}
                className="w-full bg-blue-600 text-white py-2 rounded-full"
              >
                Reset Password
              </button>
            </>
          )}

          {/* =========================
              LOGIN BUTTON
          ========================= */}
          {!isForgot && (
            <button
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-full"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;