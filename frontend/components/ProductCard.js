"use client";

import React from "react";
import { FiShoppingCart, FiStar, FiLock, FiArrowRight, FiPackage } from "react-icons/fi";
import { motion } from "framer-motion";

const BASE_URL = "http://localhost:5000"; // ✅ IMPORTANT

const ProductCard = ({ product }) => {

  // ✅ FIXED IMAGE HANDLING
  const getImageUrl = () => {
    if (!product.images || product.images.length === 0) return null;

    const firstImage = product.images[0];

    if (typeof firstImage === "object" && firstImage.url) {
      return firstImage.url;
    }

    // ✅ ADD BASE URL
    return `${BASE_URL}/${firstImage}`;
  };

  const imageUrl = getImageUrl();

  const isInStock = product.stock > 0;

  const productName = product.title || "Untitled Product";
  const productPrice = product.discountPrice || 0;
  const mrpPrice = product.mrpPrice || 0;

  const calculateDiscountPercentage = () => {
    if (mrpPrice && productPrice && mrpPrice > productPrice) {
      return Math.round(((mrpPrice - productPrice) / mrpPrice) * 100);
    }
    return null;
  };

  const discountPercentage = calculateDiscountPercentage();

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col h-full"
    >
      {/* IMAGE */}
      <div className="aspect-[4/5] bg-[#fcfdfe] p-8 flex items-center justify-center relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={productName}
            className="max-h-full object-contain group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="flex flex-col items-center gap-4 text-slate-300">
            <FiPackage size={60} />
            <span>No Image</span>
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="p-6 flex flex-col gap-3">
        <h3 className="text-lg font-bold">{productName}</h3>

        <p className="text-sm text-gray-500 line-clamp-2">
          {product.description || "No description available"}
        </p>

        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">₹{productPrice}</span>

          {mrpPrice > productPrice && (
            <span className="line-through text-gray-400">
              ₹{mrpPrice}
            </span>
          )}
        </div>

        {discountPercentage && (
          <span className="text-green-600 text-sm font-semibold">
            {discountPercentage}% OFF
          </span>
        )}

        <button className="mt-3 bg-black text-white py-2 rounded-xl hover:bg-blue-600 transition">
          View Details →
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;