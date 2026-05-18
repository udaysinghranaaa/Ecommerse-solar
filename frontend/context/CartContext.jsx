"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Load from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");

    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // ✅ Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      "cartItems",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  // ✅ Add to Cart
  const addToCart = (product) => {
    const existing = cartItems.find(
      (item) => item._id === product._id
    );

    if (existing) {
      const updated = cartItems.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );

      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  // ✅ Remove
  const removeFromCart = (id) => {
    const filtered = cartItems.filter(
      (item) => item._id !== id
    );

    setCartItems(filtered);
  };

  // ✅ Increase Qty
  const increaseQty = (id) => {
    const updated = cartItems.map((item) =>
      item._id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    setCartItems(updated);
  };

  // ✅ Decrease Qty
  const decreaseQty = (id) => {
    const updated = cartItems.map((item) =>
      item._id === id
        ? {
            ...item,
            quantity:
              item.quantity > 1
                ? item.quantity - 1
                : 1,
          }
        : item
    );

    setCartItems(updated);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () =>
  useContext(CartContext);