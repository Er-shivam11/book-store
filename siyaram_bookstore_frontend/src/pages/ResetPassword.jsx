import { useState } from "react";
import axios from "../api/axiosConfig";

const ResetPassword = () => {
  const [mobile, setMobile] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const resetPassword = async () => {
    try {
      await axios.post("/users/reset-password/", {
        mobile,
        password: newPassword,
      });

      alert("Password updated successfully");
    } catch (err) {
      alert("Failed to reset password");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>

      <input
        type="text"
        placeholder="Mobile number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      <button
        onClick={resetPassword}
        className="bg-black text-white px-4 py-2 w-full"
      >
        Reset Password
      </button>
    </div>
  );
};

export default ResetPassword;