// src/components/Footer.jsx

import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* BRAND */}
        <div>
          <h2 className="text-lg font-bold text-gray-900">Siyaram</h2>
          <p className="text-sm text-gray-500 mt-2">
            Digital learning platform for books, future courses, and real-world skills.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Explore</h3>
          <div className="space-y-2 text-sm text-gray-500">
            <Link to="/" className="block hover:text-black transition">Home</Link>
            <Link to="/" className="block hover:text-black transition">Books</Link>
            <Link to="/profile" className="block hover:text-black transition">Profile</Link>
          </div>
        </div>

        {/* INFO */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Info</h3>
          <div className="space-y-2 text-sm text-gray-500">
            <p>📩 support@siyaram.com</p>
            <p>⚡ Instant Digital Delivery</p>
            <p>🔐 Secure Payments</p>
          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-100 text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} Siyaram. Built for growth 🚀
      </div>

    </footer>
  );
};

export default Footer;