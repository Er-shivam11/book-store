// context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // =========================
  // 🧠 INIT FROM LOCAL STORAGE
  // =========================
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // =========================
  // 💾 PERSIST CART
  // =========================
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // =========================
  // ➕ ADD TO CART
  // =========================
  const addToCart = (book, quantity = 1) => {
    if (!book?.id) return;

    const qty = Math.max(1, Number(quantity) || 1);

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === book.id);

      if (existing) {
        return prev.map((item) =>
          item.id === book.id
            ? {
                ...item,
                quantity: item.quantity + qty,
              }
            : item
        );
      }

      return [...prev, { ...book, quantity: qty }];
    });
  };

  // =========================
  // ❌ REMOVE ITEM
  // =========================
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // =========================
  // 🔁 UPDATE QUANTITY
  // =========================
  const updateQuantity = (id, quantity) => {
    const qty = Math.max(1, Number(quantity) || 1);

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  // =========================
  // 🧹 CLEAR CART
  // =========================
  const clearCart = () => {
    setCartItems([]);
  };

  // =========================
  // 📊 DERIVED VALUES (SAFE)
  // =========================
  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const qty = Number(item.quantity) || 0;
        return sum + price * qty;
      }, 0),
    [cartItems]
  );

  // =========================
  // 📦 CONTEXT VALUE
  // =========================
  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [cartItems, totalItems, totalPrice]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);