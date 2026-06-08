// src/pages/BookDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookById, getBooks } from "../api/booksApi";
import { useCart } from "../context/CartContext";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [book, setBook] = useState(null);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    getBookById(id).then((data) => setBook(data));
    getBooks().then((data) =>
      setRecommended(data.filter((b) => b.id !== Number(id)).slice(0, 3))
    );
  }, [id]);

  if (!book)
    return <p className="p-6 text-center text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-b from-white via-gray-50 to-gray-100">

      <div className="max-w-6xl mx-auto">

        {/* MAIN SECTION */}
        <div className="flex flex-col md:flex-row gap-12">

          {/* LEFT - COVER */}
          <div className="w-full md:w-80 space-y-5">

            <div className="rounded-2xl overflow-hidden shadow-sm border bg-white">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-80 object-cover"
              />
            </div>

            {/* FEATURES */}
            <div className="text-xs text-gray-600 space-y-2 px-1">
              <p>📘 Soft Copy (PDF)</p>
              <p>⚡ Instant Email Delivery</p>
              <p>🔐 Watermark Protected</p>
              <p>♾️ Lifetime Access</p>
            </div>
          </div>

          {/* RIGHT - DETAILS */}
          <div className="flex-1">

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-snug">
              {book.title}
            </h1>

            <p className="text-gray-500 mt-2">
              by <span className="font-medium text-gray-700">{book.author}</span>
            </p>

            {/* CATEGORY BADGE */}
            <span className="inline-block mt-3 px-3 py-1 text-xs font-medium 
              bg-gray-100 text-gray-600 rounded-full">
              {book.category?.name}
            </span>

            <p className="text-3xl font-semibold mt-6 text-gray-900">
              ₹{book.price}
            </p>

            {/* CTA BOX */}
            <div className="mt-6 p-5 rounded-2xl border bg-white shadow-sm">

              <button
                onClick={() => addToCart(book, 1)}
                className="w-full bg-black text-white py-3 rounded-full font-medium 
                hover:bg-gray-800 active:scale-95 transition"
              >
                Add to Cart
              </button>

              <p className="text-xs text-gray-500 text-center mt-2">
                Instant access after checkout
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                About this book
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                {book.description}
              </p>
            </div>

          </div>
        </div>

        {/* RECOMMENDED */}
        <div className="mt-20">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            You may also like
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {recommended.map((item) => (
              <div
                key={item.id}
                className="group bg-white border border-gray-200 
                rounded-2xl overflow-hidden shadow-sm 
                hover:shadow-xl hover:-translate-y-1 
                transition cursor-pointer"
                onClick={() => navigate(`/books/${item.id}`)}
              >
                <img
                  src={item.cover}
                  alt={item.title}
                  className="h-44 w-full object-cover 
                  group-hover:scale-105 transition duration-300"
                />

                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {item.author}
                  </p>

                  <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium 
                    bg-gray-100 text-gray-600 rounded-full">
                    {item.category?.name}
                  </span>

                  <p className="font-semibold mt-3 text-gray-900">
                    ₹{item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookDetail;