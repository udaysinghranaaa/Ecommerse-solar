"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

const BASE_URL = "http://localhost:5000";

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug;

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!slug) return;

    axios
      .get(`http://localhost:5000/api/products/category/${slug}`)
      .then((res) => setProducts(res.data))
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
              
              {/* IMAGE */}
              <img
                src={`${BASE_URL}/${p.images?.[0]?.url}`}
                className="w-full h-40 object-cover"
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