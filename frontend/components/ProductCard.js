"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiPackage, FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

// ✅ FIXED BASE URL
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const ProductCard = ({ product }) => {
  const router = useRouter();

  // ✅ CART CONTEXT
  const { addToCart } = useCart();

  // 🔥 IMAGE HANDLE
  const getImageUrl = () => {
    if (!product?.images || product.images.length === 0) return null;

    const firstImage = product.images[0];

    if (typeof firstImage === "object" && firstImage.url) {
      return `${BASE_URL}/${firstImage.url.replace(/\\/g, "/")}`;
    }

    return `${BASE_URL}/${firstImage.replace(/\\/g, "/")}`;
  };

  const imageUrl = getImageUrl();

  const productName = product.title || "Untitled Product";
  const productPrice = product.discountPrice || 0;
  const mrpPrice = product.mrpPrice || 0;

  // 🔥 DISCOUNT
  const discountPercentage =
    mrpPrice > productPrice
      ? Math.round(((mrpPrice - productPrice) / mrpPrice) * 100)
      : null;

  // 🛒 ADD TO CART FUNCTION
  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* 🔥 IMAGE */}
      <div className="relative aspect-[4/5] bg-gray-50 flex items-center justify-center p-6 overflow-hidden">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={productName}
            className="max-h-full object-contain group-hover:scale-110 transition duration-500"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-300">
            <FiPackage size={50} />
            <span>No Image</span>
          </div>
        )}

        {/* 🔥 DISCOUNT BADGE */}
        {discountPercentage && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
            {discountPercentage}% OFF
          </span>
        )}

      </div>

      {/* 🔥 INFO */}
      <div className="p-4 flex flex-col flex-grow">

        <h3 className="text-md font-semibold text-gray-900 line-clamp-1">
          {productName}
        </h3>

        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {product.description || "No description available"}
        </p>

        {/* 🔥 PRICE */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-gray-900">
            ₹{productPrice}
          </span>

          {mrpPrice > productPrice && (
            <span className="line-through text-gray-400 text-sm">
              ₹{mrpPrice}
            </span>
          )}
        </div>

        {/* 🔥 BUTTONS */}
        <div className="mt-auto pt-4 flex gap-2">

          <button
            onClick={() => router.push(`/product/${product._id}`)}
            className="flex-1 bg-black text-white py-2 rounded-lg text-sm hover:bg-gray-800 transition"
          >
            View
          </button>

          <button
            onClick={handleAddToCart}
            className="bg-green-600 text-white px-3 rounded-lg hover:bg-green-700 transition"
          >
            <FiShoppingCart size={18} />
          </button>

        </div>

      </div>
    </motion.div>
  );
};

export default ProductCard;