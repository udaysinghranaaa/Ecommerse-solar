"use client";

import { useEffect, useState } from "react";
import API, { getImageUrl } from "../../services/api"; // ✅ FIX
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug;

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!slug) return;

    API.get(`/products/category/${slug}`) // ✅ FIX
      .then((res) => {
        const data = res.data.products || res.data || [];
        setProducts(data);
      })
      .catch((err) => console.log(err));
  }, [slug]);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">
        Category: {slug}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((p) => (
            <div key={p._id} className="border p-4 rounded-xl">

              {/* ✅ IMAGE FIX */}
              <img
                src={getImageUrl(p.images?.[0])}
                className="w-full h-40 object-cover"
                alt={p.title}
              />

              {/* TITLE */}
              <h3 className="font-bold mt-2">{p.title}</h3>

              {/* PRICE */}
              <p>₹{p.discountPrice}</p>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
}