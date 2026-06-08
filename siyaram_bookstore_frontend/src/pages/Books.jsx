// src/pages/Books.jsx
import React, { useEffect, useState } from "react";
import { getBooks } from "../api/booksApi";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUI } from "../context/UIContext";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useUI();

  // =========================
  // 📚 FETCH BOOKS
  // =========================
  const fetchBooks = async () => {
    try {
      setLoading(true);

      const res = await getBooks();

      // Handle backend response safely
      const data = res?.results || res?.data?.results || res || [];

      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Books fetch error:", error);
      showToast("Failed to load books", "error");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // =========================
  // 🧠 GROUP BY CATEGORY
  // =========================
  const groupByCategory = (books) => {
    return books.reduce((acc, book) => {
      const category = book.category?.name || "Others";

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(book);

      return acc;
    }, {});
  };

  const groupedBooks = groupByCategory(books);

  // =========================
  // LOADING UI
  // =========================
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading books...
      </div>
    );
  }

  // =========================
  // EMPTY STATE
  // =========================
  if (!books.length) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        No books available 😔
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-b from-white via-gray-50 to-gray-100">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Explore Products
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Interview Kits, Projects, Internship & More
        </p>
      </div>

      {/* CATEGORY SECTIONS */}
      <div className="max-w-6xl mx-auto space-y-16">

        {Object.entries(groupedBooks).map(([category, items]) => (

          <div key={category}>

            {/* CATEGORY TITLE */}
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {category}
            </h2>

            {/* HORIZONTAL SCROLL */}
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">

              {items.map((book) => (
                <div
                  key={book.id}
                  className="min-w-[260px] bg-white border border-gray-200 
                  rounded-2xl overflow-hidden shadow-sm hover:shadow-xl 
                  transition duration-300 flex flex-col"
                >

                  {/* IMAGE */}
                  <div
                    className="cursor-pointer overflow-hidden bg-gray-100"
                    onClick={() => navigate(`/books/${book.id}`)}
                  >
                    {book.cover && (
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-44 object-cover 
                        hover:scale-105 transition duration-300"
                      />
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-4 flex flex-col justify-between flex-1">

                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {book.title}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        {book.author}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between">

                      <p className="font-semibold text-gray-900 text-base">
                        ₹{book.price}
                      </p>

                      <button
                        onClick={() => {
                          addToCart(book, 1);
                          showToast("Added to cart 🛒");
                        }}
                        className="px-3 py-1.5 text-xs font-medium 
                        bg-black text-white rounded-full 
                        hover:bg-gray-800 active:scale-95 transition"
                      >
                        Add
                      </button>

                    </div>
                  </div>
                </div>
              ))}

            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default Books;