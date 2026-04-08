"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ FIX BASE URL
  const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://ecommerse-solar.onrender.com";

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${BASE_URL}/api/stories`) // ✅ FIX
      .then((res) => {
        setStories(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching stories:", err);
        setError("Failed to load stories. Please try again later.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const getEmbedUrl = (url) => {
    if (!url) return "";

    if (url.includes("shorts")) {
      const id = url.split("shorts/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    if (url.includes("watch?v=")) {
      const id = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    return url;
  };

  const isYouTube = (url) => {
    return url?.includes("youtube.com") || url?.includes("youtu.be");
  };

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center">
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
              Customer Success Stories
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Real Stories, Real Impact
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover how our solutions have transformed businesses and lives.
            Real experiences. Real savings. Real impact.
          </p>

          <div className="flex justify-center gap-2 pt-2">
            <div className="w-12 h-1 bg-emerald-500 rounded-full"></div>
            <div className="w-12 h-1 bg-emerald-400 rounded-full opacity-50"></div>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {stories.length > 0 ? (
              stories.map((s) => {
                const imageUrl = s.image
                  ? `${BASE_URL}/${s.image.replace(/\\/g, "/")}` // ✅ FIX
                  : "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80";

                return (
                  <article
                    key={s._id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 flex flex-col h-full"
                  >
                    <div className="relative w-full overflow-hidden bg-gray-200 aspect-video">
                      {s.video ? (
                        isYouTube(s.video) ? (
                          <iframe
                            src={getEmbedUrl(s.video)}
                            className="w-full h-full"
                            title={s.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            src={`${BASE_URL}/${s.video.replace(/\\/g, "/")}`} // ✅ FIX
                            controls
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <img
                          src={imageUrl}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          alt={s.title}
                          loading="lazy"
                        />
                      )}
                    </div>

                    <div className="p-8 flex flex-col flex-grow">
                      {s.location && (
                        <span className="inline-flex w-fit text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-4">
                          📍 {s.location}
                        </span>
                      )}

                      <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {s.title}
                      </h3>

                      <p className="text-gray-600 text-base leading-relaxed mb-6 flex-grow line-clamp-4">
                        {s.description}
                      </p>

                      <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
                        <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-emerald-400 rounded-full"></div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {s.name}
                          </p>
                          {s.role && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {s.role}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500 text-lg font-medium">
                  No customer stories available yet
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}