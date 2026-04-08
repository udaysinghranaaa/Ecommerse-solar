"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiStar, FiMessageSquare, FiCheckCircle } from "react-icons/fi";

// ✅ FIX BASE URL
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ecommerse-solar.onrender.com";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/reviews`) // ✅ FIX
      .then((res) => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, r) => sum + Number(r.rating || 5),
            0
          ) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200 mb-6">
            <FiCheckCircle className="text-green-600" size={16} />
            <span className="text-sm font-semibold text-green-700">
              Trusted by 5000+ Customers
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Customer Reviews
          </h2>

          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    size={20}
                    className={
                      i < Math.round(averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-slate-300"
                    }
                  />
                ))}
              </div>
              <span className="text-slate-700 font-semibold">
                {averageRating} out of 5 • {reviews.length} reviews
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-green-500 rounded-full animate-spin"></div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((r, index) => {
              
              // ✅ FIX IMAGE URL
              const imageUrl = r.image
                ? `${BASE_URL}/${r.image.replace(/\\/g, "/")}`
                : "https://i.pravatar.cc/100?img=" + index;

              return (
                <div key={r._id} className="group relative bg-white rounded-2xl border overflow-hidden">

                  <div className="relative p-8 space-y-5">
                    
                    <div className="flex gap-1">
                      {[...Array(Number(r.rating || 5))].map((_, i) => (
                        <FiStar key={i} size={18} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>

                    <p className="text-slate-700">
                      "{r.message}"
                    </p>

                    <div className="flex items-center gap-4 pt-2">
                      <img
                        src={imageUrl}
                        alt={r.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-slate-900">
                          {r.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Verified Customer
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            No reviews yet
          </div>
        )}

      </div>
    </section>
  );
}