"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Hero() {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ✅ SAFE API URL (FIX)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  // 🔥 FETCH FROM BACKEND (FIXED DATA FORMAT)
  useEffect(() => {
    axios
      .get(`${API_URL}/api/banners`)
      .then((res) => {
        console.log("Banners:", res.data);

        const data = res.data.banners || res.data || [];
        setBanners(data);
      })
      .catch((err) => console.log("Banner Error:", err));
  }, []);

  // 🔥 AUTO SLIDE
  useEffect(() => {
    if (banners.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [banners]);

  // ✅ EMPTY STATE FIX
  if (banners.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-400">
        No banners available
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-white">

      {/* 🔥 SLIDER */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full flex flex-col md:flex-row min-h-[400px] md:h-[500px]"
          >
            {/* LEFT IMAGE */}
            <div className="w-full md:w-3/5 relative">
              <img
                src={`${API_URL}/${banner.image?.replace(/\\/g, "/")}`} // ✅ IMAGE FIX
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>

            {/* RIGHT CONTENT */}
            <div className="w-full md:w-2/5 bg-gradient-to-r from-green-600 to-green-800 text-white flex flex-col justify-center p-8 md:p-12 relative">
              <div className="max-w-md">

                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                  {banner.title}
                </h1>

                <p className="text-sm md:text-base opacity-90 mb-6">
                  {banner.subtitle}
                </p>

                {banner.link && (
                  <a
                    href={banner.link}
                    className="inline-block px-6 py-3 bg-white text-green-700 font-semibold rounded-full hover:bg-gray-200 transition"
                  >
                    Explore Now →
                  </a>
                )}
              </div>

              {/* WHATSAPP BUTTON */}
              <a
                href="https://wa.me/your-number"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-6 right-6 bg-green-500 p-3 rounded-full shadow-lg hover:bg-green-400 transition"
              >
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 DOTS */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 transition-all duration-300 rounded-full ${
              currentSlide === index ? "w-8 bg-green-500" : "w-4 bg-white/50"
            }`}
          />
        ))}
      </div>

    </div>
  );
}