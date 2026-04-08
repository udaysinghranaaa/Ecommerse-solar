"use client";

import { useEffect, useState } from "react";
import API from "../app/services/api"; 
import ProductCard from "./ProductCard";
import { useRouter } from "next/navigation";

export default function ProductGrid({ title, type }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "/products"; // ✅ FIX

        if (type === "trending") {
          url = "/products/trending"; // ✅ FIX
        } else if (type === "featured") {
          url = "/products/featured"; // ✅ FIX
        }

        const res = await API.get(url); // ✅ FIX

        const data =
          res.data.products || (Array.isArray(res.data) ? res.data : []);

        setProducts(data);
      } catch (err) {
        console.log("Error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type]);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex flex-col items-center text-center mb-12">

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {title}
          </h2>

          <p className="text-gray-500 mt-3 max-w-xl">
            Discover high-performance solar products designed for efficiency,
            durability, and long-term savings.
          </p>

          <div className="w-16 h-1 bg-green-500 mt-4 rounded-full"></div>

          <button
            onClick={() => router.push("/shop")}
            className="mt-6 px-6 py-2 border border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition"
          >
            View All Products →
          </button>

        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            No products available
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((p) => (
              <div key={p._id} className="relative group">

                {type === "trending" && (
                  <span className="absolute top-3 left-3 z-10 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    ⚡ Solar Pick
                  </span>
                )}

                {type === "featured" && (
                  <span className="absolute top-3 left-3 z-10 bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    🌟 Popular Choice
                  </span>
                )}

                <div className="transform transition duration-300 group-hover:-translate-y-2">
                  <ProductCard product={p} />
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}