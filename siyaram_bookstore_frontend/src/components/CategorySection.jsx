import React, { useEffect, useState } from "react";
import { getCategories } from "../api/booksApi";
import { useNavigate } from "react-router-dom";

const CategorySection = ({ title, categoryId }) => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
  try {
    const res = await getCategories(categoryId, 4);

    console.log("BOOKS:", res); // DEBUG

    setBooks(res?.data?.results || []);
  } catch (err) {
    console.error("Category fetch error:", err);
  }
};

    fetchData();
  }, [categoryId]);

  if (!books.length) return null;

  return (
    <section className="px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">{title}</h2>

          <button
            onClick={() => navigate(`/books?category=${categoryId}`)}
            className="text-sm text-gray-600 hover:underline"
          >
            View All →
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {books.map((book) => (
            <div
              key={book.id}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col"
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
                    loading="lazy"
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                  />
                )}
              </div>

              {/* CONTENT */}
              <div className="p-4 flex flex-col justify-between flex-1">

                <div>
                  <h2 className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {book.title}
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    {book.author}
                  </p>

                  {book.category?.name && (
                    <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded-full">
                      {book.category.name}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="font-semibold text-gray-900 text-sm">
                    ₹{book.price}
                  </p>

                  <button
                    onClick={() => console.log("Add to cart:", book)}
                    className="px-3 py-1 text-xs bg-black text-white rounded-full hover:bg-gray-800 transition"
                  >
                    Add
                  </button>
                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default CategorySection;