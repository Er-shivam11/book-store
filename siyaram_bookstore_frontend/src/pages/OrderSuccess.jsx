// src/pages/OrderSuccess.jsx
import { useParams, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-bold mb-4">
        🎉 Order Successful
      </h1>

      <p className="text-gray-600 mb-6">
        Your order #{orderId} has been placed successfully.
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-6 py-2 rounded-full"
        >
          Go Home
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="border px-6 py-2 rounded-full"
        >
          View Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;