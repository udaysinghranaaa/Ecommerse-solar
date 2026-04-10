"use client";

import { useEffect, useState } from "react";
import API from "../../services/api";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  ShoppingCart,
  Phone,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Share2,
} from "lucide-react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ecommerse-solar.onrender.com";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("specs");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-scroll carousel
  useEffect(() => {
    if (!product?.images || product.images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % product.images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [product?.images]);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    API.get(`/products/${id}`)
      .then((res) => {
        const data =
          res.data?.product?.product ||
          res.data?.product ||
          res.data;

        setProduct(data);
        setError(null);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to load product details");
      })
      .finally(() => setLoading(false));

    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [id]);

  const handlePayment = async () => {
    try {
      const { data } = await API.post("/payment/create-order", {
        productId: product._id,
        quantity,
      });

      const { order, dbOrderId } = data;

      const options = {
        key: "YOUR_KEY_ID",
        amount: order.amount,
        currency: "INR",
        name: "Hans Solar",
        description: product.title,
        order_id: order.id,

        handler: async function (response) {
          const verifyRes = await API.post("/payment/verify", {
            ...response,
            dbOrderId,
          });

          if (verifyRes.data.success) {
            router.push("/payment-success");
          } else {
            alert("Payment Failed ❌");
          }
        },

        theme: {
          color: "#16a34a",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      alert("Payment Error ❌");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center bg-gray-50 p-8 rounded-lg max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-700 font-semibold mb-4">{error || "Product not found"}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const getImage = (img) => {
    if (!img) return "";
    if (typeof img === "object" && img.url) {
      return `${BASE_URL}/${img.url.replace(/\\/g, "/")}`;
    }
    return `${BASE_URL}/${img.replace(/\\/g, "/")}`;
  };

  const discount =
    product.mrpPrice > product.discountPrice
      ? Math.round(
          ((product.mrpPrice - product.discountPrice) /
            product.mrpPrice) *
            100
        )
      : 0;

  const averageRating = product.averageRating || 4.5;
  const reviewCount = product.customerReviews?.length || 0;

  const handleNextImage = () => {
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="bg-white py-8 md:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMB */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <button onClick={() => router.push("/")} className="hover:text-green-600 transition">Home</button>
          <span className="text-gray-400">/</span>
          <button onClick={() => router.push("/products")} className="hover:text-green-600 transition">Products</button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium truncate">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* IMAGE GALLERY SECTION */}
          <div className="space-y-4 lg:sticky lg:top-24 self-start">
            {/* Main Image with Auto-Scroll */}
            <div className="relative bg-gray-50 rounded-lg h-[400px] sm:h-[500px] flex items-center justify-center overflow-hidden group">
              {images.length > 0 ? (
                <>
                  <img
                    src={getImage(images[activeImage])}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain transition-all duration-300"
                  />
                  
                  {/* Image Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Next image"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {activeImage + 1} / {images.length}
                    </div>
                  )}

                  {/* Progress Dots */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImage(index)}
                          className={`h-1.5 rounded-full transition-all ${
                            activeImage === index
                              ? "bg-green-600 w-6"
                              : "bg-white/50 w-1.5 hover:bg-white/70"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-400">No image available</p>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border transition-all ${
                      activeImage === index
                        ? "border-2 border-green-600 ring-2 ring-green-200"
                        : "border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={getImage(img)}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT DETAILS SECTION */}
          <div className="space-y-6">

            {/* Category */}
            <div>
              <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">
                {product.category?.name || product.category || "Category"}
              </p>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-900">{averageRating}</span>
              <span className="text-sm text-gray-600">({reviewCount} reviews)</span>
            </div>

            {/* Pricing Section */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-bold text-green-600">
                  ₹{product.discountPrice?.toLocaleString('en-IN')}
                </span>
                {product.mrpPrice > product.discountPrice && (
                  <>
                    <span className="line-through text-gray-400 text-lg">
                      ₹{product.mrpPrice?.toLocaleString('en-IN')}
                    </span>
                    {discount > 0 && (
                      <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded text-sm font-bold">
                        {discount}% OFF
                      </span>
                    )}
                  </>
                )}
              </div>
              <p className="text-xs text-gray-600">Inclusive of all taxes</p>
            </div>

            {/* Product Info */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold mb-1">GST</p>
                <p className="text-lg font-bold text-gray-900">{product.gst}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Stock</p>
                <p className={`text-lg font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock}` : 'Out'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="text-gray-700 leading-relaxed text-sm">
              {product.description}
            </div>

            {/* Quantity & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition font-semibold"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-semibold text-gray-900 border-l border-r border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={product.stock <= 0}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold text-base shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                Buy Now
              </button>

              <button className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-semibold flex items-center justify-center gap-2 text-sm">
                <Share2 size={16} />
                Share
              </button>
            </div>

            {/* Support Section */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
              <Phone className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-blue-900">Need Help?</p>
                <p className="text-blue-700">Call us at 1-800-SOLAR-01</p>
              </div>
            </div>

          </div>
        </div>

        {/* TABS SECTION */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          {/* Tab Navigation */}
          <div className="flex gap-8 border-b border-gray-200 mb-8 overflow-x-auto">
            {[
              { id: "specs", label: "Specifications" },
              { id: "faqs", label: "FAQs" },
              { id: "reviews", label: "Reviews" },
              { id: "videos", label: "Videos" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 font-semibold text-sm sm:text-base whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {/* SPECIFICATIONS */}
            {activeTab === "specs" && (
              <div className="space-y-4">
                {(product.technicalSpecs || []).length > 0 ? (
                  product.technicalSpecs.map((spec, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="font-medium text-gray-900 text-sm">{spec.key}</span>
                      <span className="text-gray-700 text-sm text-right">{spec.value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8 text-sm">No specifications available</p>
                )}
              </div>
            )}

            {/* FAQs */}
            {activeTab === "faqs" && (
              <div className="space-y-6">
                {(product.faqs || []).length > 0 ? (
                  product.faqs.map((faq, i) => (
                    <div key={i} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <p className="font-semibold text-gray-900 mb-2 text-sm">{faq.question}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8 text-sm">No FAQs available</p>
                )}
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {(product.customerReviews || []).length > 0 ? (
                  product.customerReviews.map((rev, i) => (
                    <div key={i} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-gray-900 text-sm">{rev.name}</p>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              size={14}
                              className={j < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8 text-sm">No reviews yet. Be the first to review!</p>
                )}
              </div>
            )}

            {/* VIDEOS */}
            {activeTab === "videos" && (
              <div className="space-y-6">
                {(product.videos || []).length > 0 ? (
                  product.videos.map((vid, i) => (
                    <div key={i} className="rounded-lg overflow-hidden shadow-sm">
                      <video
                        controls
                        className="w-full bg-black"
                        poster={getImage(vid.thumbnail)}
                      >
                        <source src={getImage(vid.url)} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8 text-sm">No videos available</p>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
