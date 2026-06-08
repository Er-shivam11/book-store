import React, { useEffect, useState } from "react";
import { getAllOrders } from "../api/ordersApi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [topBooks, setTopBooks] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await getAllOrders();

      const orders = Array.isArray(data)
        ? data
        : data.results || [];

      let totalRevenue = 0;
      let pending = 0;
      let success = 0;
      let failed = 0;

      const dailyMap = {};
      const bookMap = {};

      orders.forEach((order) => {
        if (order.status === "SUCCESS") {
          totalRevenue += Number(order.total_amount || 0);
          success++;
        } else if (order.status === "PENDING") {
          pending++;
        } else {
          failed++;
        }

        const date = new Date(order.created_at).toLocaleDateString();

        if (!dailyMap[date]) {
          dailyMap[date] = { orders: 0, revenue: 0 };
        }

        dailyMap[date].orders += 1;

        if (order.status === "SUCCESS") {
          dailyMap[date].revenue += Number(order.total_amount || 0);
        }

        order.items?.forEach((item) => {
          const title = item.product_title;

          bookMap[title] = (bookMap[title] || 0) + item.quantity;
        });
      });

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders: pending,
        successOrders: success,
        failedOrders: failed,
      });

      setRecentOrders(orders.slice(0, 5));

      setDailyStats(
        Object.entries(dailyMap).map(([date, data]) => ({
          date,
          ...data,
        }))
      );

      setTopBooks(
        Object.entries(bookMap)
          .map(([title, qty]) => ({ title, qty }))
          .sort((a, b) => b.qty - a.qty)
          .slice(0, 5)
      );
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card title="Total Orders" value={stats.totalOrders} />
        <Card title="Revenue" value={`₹${stats.totalRevenue}`} />
        <Card title="Pending" value={stats.pendingOrders} color="yellow" />
        <Card title="Success" value={stats.successOrders} color="green" />
        <Card title="Failed" value={stats.failedOrders} color="red" />
      </div>

      <Section title="Recent Orders">
        {recentOrders.map((order) => (
          <OrderRow key={order.id} order={order} />
        ))}
      </Section>

      <Section title="Daily Analytics">
        {dailyStats.map((d, i) => (
          <div key={i}>
            {d.date} → Orders: {d.orders}, Revenue: ₹{d.revenue}
          </div>
        ))}
      </Section>

      <Section title="Top Books">
        {topBooks.map((b, i) => (
          <div key={i}>
            {b.title} → {b.qty} sold
          </div>
        ))}
      </Section>
    </div>
  );
};

// UI components remain same
const Card = ({ title, value, color }) => {
  const colorMap = {
    yellow: "text-yellow-600",
    green: "text-green-600",
    red: "text-red-600",
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-xl font-bold ${colorMap[color] || ""}`}>
        {value || 0}
      </h2>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow mb-6">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    <div className="space-y-2">{children}</div>
  </div>
);

const OrderRow = ({ order }) => (
  <div className="flex justify-between border p-3 rounded-lg">
    <div>
      <p>Order #{order.id}</p>
      <p className="text-xs text-gray-500">
        {new Date(order.created_at).toLocaleString()}
      </p>
    </div>

    <div className="text-right">
      <p>₹{order.total_amount}</p>
      <p className="text-xs">{order.status}</p>
    </div>
  </div>
);

export default AdminDashboard;