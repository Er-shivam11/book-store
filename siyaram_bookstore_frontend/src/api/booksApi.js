// src/api/booksApi.js
import axiosInstance from "./axiosConfig";

// =========================
// 📚 GET ALL BOOKS
// =========================
export const getBooks = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/books/books/", { params });

    return response.data?.results || [];
  } catch (error) {
    console.error("getBooks API error:", error);
    throw error;
  }
};
export const getCategories = async () => {
  const res = await axiosInstance.get("/categories/");
  return res.data || [];
};


// =========================
// 📖 GET SINGLE BOOK
// =========================
export const getBookById = async (id) => {
  try {
    const response = await axiosInstance.get(`/books/books/${id}/`);

    return response.data || null;
  } catch (error) {
    console.error("getBookById API error:", error);
    throw error;
  }
};

// =========================
// ➕ CREATE BOOK (ADMIN)
// =========================
export const createBook = async (payload) => {
  try {
    const response = await axiosInstance.post("/books/books/", payload);
    return response.data;
  } catch (error) {
    console.error("createBook API error:", error);
    throw error;
  }
};

// =========================
// ✏️ UPDATE BOOK (ADMIN)
// =========================
export const updateBook = async (id, payload) => {
  try {
    const response = await axiosInstance.put(
      `/books/books/${id}/`,
      payload
    );

    return response.data;
  } catch (error) {
    console.error("updateBook API error:", error);
    throw error;
  }
};

// =========================
// ❌ DELETE BOOK (ADMIN)
// =========================
export const deleteBook = async (id) => {
  try {
    const response = await axiosInstance.delete(`/books/books/${id}/`);
    return response.data;
  } catch (error) {
    console.error("deleteBook API error:", error);
    throw error;
  }
};