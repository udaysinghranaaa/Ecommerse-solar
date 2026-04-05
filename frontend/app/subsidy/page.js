"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../components/ProductCard";

export default function SubsidyPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH SUBSIDY PRODUCTS
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products/subsidy")
      .then((res) => {
        const data =
          res.data.products || (Array.isArray(res.data) ? res.data : []);
        setProducts(data);
      })
      .catch((err) => {
        console.log("Subsidy Error:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        {/* 🔥 HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Government Subsidy Solar Products
          </h1>

          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Save more with government-supported solar solutions designed to reduce
            your electricity costs and promote clean energy adoption.
          </p>

          <div className="w-16 h-1 bg-green-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* 🔄 LOADING */}
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
          <div className="text-center py-20 text-gray-400">
            No subsidy products available
          </div>
        ) : (

          /* 🔥 PRODUCTS GRID */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((p) => (
              <div key={p._id} className="relative group">

                {/* 🔥 SUBSIDY BADGE */}
                <span className="absolute top-3 left-3 z-10 bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                  Govt Subsidy
                </span>

                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}