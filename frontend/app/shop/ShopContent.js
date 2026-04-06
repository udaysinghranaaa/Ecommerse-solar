"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import ProductCard from "../../components/ProductCard";

// ✅ ENV URL
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export default function ShopContent() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category");
  const searchQuery = searchParams.get("search");

  // 🔥 FETCH CATEGORIES
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/category`)
      .then((res) => {
        const data =
          res.data.categories || (Array.isArray(res.data) ? res.data : []);
        setCategories(data);
      });
  }, []);

  // 🔥 FETCH PRODUCTS
  useEffect(() => {
    let url = `${BASE_URL}/api/products`;

    if (selectedCategory) {
      url = `${BASE_URL}/api/products/category/${selectedCategory}`;
    }

    axios.get(url).then((res) => {
      let data =
        res.data.products || (Array.isArray(res.data) ? res.data : []);

      // 🔍 SEARCH FILTER
      if (searchQuery) {
        data = data.filter((p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setProducts(data);
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Explore Solar Products
          </h1>
          <p className="text-gray-500 mt-2">
            Find the perfect solar solution for your needs
          </p>
        </div>

        {/* CATEGORY FILTER */}
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

        {/* PRODUCTS GRID */}
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