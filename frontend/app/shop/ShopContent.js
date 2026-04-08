"use client";

import { useEffect, useState } from "react";
import API from "../services/api";
import { useSearchParams } from "next/navigation";
import ProductCard from "../../components/ProductCard";

// ✅ SAFE BASE URL
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ecommerse-solar.onrender.com";

export default function ShopContent() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category");
  const searchQuery = searchParams.get("search");

  // 🔥 FETCH CATEGORIES
  useEffect(() => {
    API.get("/category") // ✅ FIX
      .then((res) => {
        const data =
          res.data.categories || (Array.isArray(res.data) ? res.data : []);
        setCategories(data);
      })
      .catch((err) => console.log(err));
  }, []);

  // 🔥 FETCH PRODUCTS
  useEffect(() => {
    let url = "/products";

    if (selectedCategory) {
      url = `/products/category/${selectedCategory}`;
    }

    API.get(url) // ✅ FIX
      .then((res) => {
        let data =
          res.data.products || (Array.isArray(res.data) ? res.data : []);

        // 🔍 SEARCH FILTER
        if (searchQuery) {
          data = data.filter((p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setProducts(data);
      })
      .catch((err) => console.log(err));
  }, [selectedCategory, searchQuery]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Explore Solar Products
          </h1>
          <p className="text-gray-500 mt-2">
            Find the perfect solar solution for your needs
          </p>
        </div>

        <div className="flex gap-3 overflow-x-auto mb-10 pb-2">

          <button
            onClick={() => window.location.href = "/shop"}
            className={`px-4 py-2 rounded-full border ${
              !selectedCategory ? "bg-green-600 text-white" : "bg-white"
            }`}
          >
            All
          </button>

          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() =>
                (window.location.href = `/shop?category=${c._id}`)
              }
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === c._id
                  ? "bg-green-600 text-white"
                  : "bg-white"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {products.length > 0 ? (
            products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400">
              No products found
            </div>
          )}

        </div>

      </div>
    </section>
  );
}