"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

export default function ProductGrid({ title }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data.products)); // ✅ FIXED
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(p => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}