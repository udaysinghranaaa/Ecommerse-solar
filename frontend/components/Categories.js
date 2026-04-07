"use client";

import { useRouter } from "next/navigation";

export default function Categories({ categories }) {
  const router = useRouter();

  const BASE_URL = "https://ecommerse-solar.onrender.com";

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADING */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Explore Solar Categories
          </h2>
          <p className="text-gray-500 mt-2">
            Find the right solar products for your needs
          </p>
          <div className="w-16 h-1 bg-green-500 mx-auto mt-3 rounded"></div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((c) => {

            // ✅ FIXED IMAGE URL (MAIN FIX)
            const imageUrl = c?.image
              ? `${BASE_URL}/${c.image.replace(/\\/g, "/")}`
              : "https://images.unsplash.com/photo-1509395176047-4a66953fd231";

            return (
              <div
                key={c._id}
                onClick={() => router.push(`/category/${c._id}`)}
                className="group cursor-pointer rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition"
              >
                <img
                  src={imageUrl}
                  alt={c.name || "category"}
                  className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                />

                <div className="p-3 text-center font-semibold text-gray-800">
                  {c.name}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}