"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiStar, FiMessageSquare, FiCheckCircle } from "react-icons/fi";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/reviews")
      .then((res) => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ========== HEADER SECTION ========== */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200 mb-6">
            <FiCheckCircle className="text-green-600" size={16} />
            <span className="text-sm font-semibold text-green-700">Trusted by 5000+ Customers</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Customer Reviews
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who have transformed their energy solutions with our innovative solar technology. Real experiences from real people.
          </p>

          {/* Rating Summary */}
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    size={20}
                    className={i < Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-slate-300"}
                  />
                ))}
              </div>
              <span className="text-slate-700 font-semibold">
                {averageRating} out of 5 • {reviews.length} reviews
              </span>
            </div>
          )}

          <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mt-8 rounded-full"></div>
        </div>

        {/* ========== REVIEWS GRID ========== */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-green-500 rounded-full animate-spin"></div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((r, index) => {
              const imageUrl = r.image
                ? `http://localhost:5000/${r.image}`
                : "https://i.pravatar.cc/100?img=" + index;

              return (
                <div
                  key={r._id}
                  className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Message Icon (Replacement for Quote) */}
                  <div className="absolute top-6 right-6 text-slate-200 group-hover:text-green-200 transition-colors duration-300">
                    <FiMessageSquare size={32} />
                  </div>

                  {/* Content */}
                  <div className="relative p-8 space-y-5">
                    
                    {/* Rating Stars */}
                    <div className="flex gap-1">
                      {[...Array(Number(r.rating || 5))].map((_, i) => (
                        <FiStar
                          key={i}
                          size={18}
                          className="text-yellow-400 fill-yellow-400"
                        />
                      ))}
                      {[...Array(5 - Number(r.rating || 5))].map((_, i) => (
                        <FiStar
                          key={i + Number(r.rating || 5)}
                          size={18}
                          className="text-slate-300"
                        />
                      ))}
                    </div>

                    {/* Review Message */}
                    <p className="text-slate-700 leading-relaxed text-base font-medium">
                      "{r.message}"
                    </p>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

                    {/* User Info */}
                    <div className="flex items-center gap-4 pt-2">
                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt={r.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 group-hover:border-green-500 transition-colors duration-300"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <FiCheckCircle size={12} className="text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-base">
                          {r.name}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium">
                          Verified Customer
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Accent Line */}
                  <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <FiStar size={32} className="text-slate-400" />
            </div>
            <p className="text-slate-500 text-lg font-medium">No reviews yet</p>
            <p className="text-slate-400 text-sm mt-2">Be the first to share your experience</p>
          </div>
        )}

        {/* ========== CTA SECTION ========== */}
        {reviews.length > 0 && (
          <div className="mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl px-8 py-6">
              <p className="text-slate-700 font-medium mb-4">
                Join our community of satisfied customers
              </p>
              <button className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-200 transition-all duration-300 transform hover:scale-105">
                Share Your Experience
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
