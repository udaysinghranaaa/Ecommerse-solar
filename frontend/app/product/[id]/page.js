"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation"; // ✅ ADD
import {
  Star,
  ShoppingCart,
  Zap,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";

const BASE_URL = "http://localhost:5000";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter(); // ✅ ADD

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${BASE_URL}/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err));

    // ✅ ADD: Razorpay Script
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }

  }, [id]);

  // ✅ ADD: PAYMENT FUNCTION
  const handlePayment = async () => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/payment/create-order`,
        {
          productId: product._id,
        }
      );

      const { order, dbOrderId } = data;

      const options = {
        key: "YOUR_KEY_ID",
        amount: order.amount,
        currency: "INR",
        name: "Hans Solar",
        description: product.title,
        order_id: order.id,

        handler: async function (response) {
          const verifyRes = await axios.post(
            `${BASE_URL}/api/payment/verify`,
            {
              ...response,
              dbOrderId,
            }
          );

          if (verifyRes.data.success) {
            router.push("/payment-success"); // ✅ ADD
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

  if (!product) {
    return (
      <div className="p-16 text-center text-gray-400 text-lg">
        Loading product...
      </div>
    );
  }

  const images = product.images || [];

  const getImage = (img) => {
    if (!img) return "";
    if (typeof img === "object" && img.url) {
      return `${BASE_URL}/${img.url}`;
    }
    return `${BASE_URL}/${img}`;
  };

  const discount =
    product.mrpPrice > product.discountPrice
      ? Math.round(
          ((product.mrpPrice - product.discountPrice) /
            product.mrpPrice) *
            100
        )
      : 0;

  return (
    <section className="bg-gray-50 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-start">

        {/* 🔥 LEFT - STICKY IMAGE */}
        <div className="space-y-4 lg:sticky lg:top-24 self-start">

          <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition flex items-center justify-center h-[420px]">
            {images.length > 0 ? (
              <img
                src={getImage(images[activeImage])}
                alt={product.title}
                className="max-h-full object-contain transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <p>No Image</p>
            )}
          </div>

          {/* THUMBNAILS */}
          <div className="flex gap-3 overflow-x-auto">
            {images.map((img, index) => (
              <img
                key={index}
                src={getImage(img)}
                onClick={() => setActiveImage(index)}
                className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition ${
                  activeImage === index
                    ? "border-green-600 scale-105"
                    : "border-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 🔥 RIGHT - SCROLLABLE DETAILS */}
        <div className="space-y-6">

          {/* CATEGORY */}
          <p className="text-sm text-green-600 font-semibold uppercase tracking-wide">
            {product.category?.name || "Category"}
          </p>

          {/* TITLE */}
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {product.title}
          </h1>

          {/* ⭐ RATING */}
          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill="currentColor" />
            ))}
            <span className="text-gray-500 text-sm ml-2">(5.0)</span>
          </div>

          {/* 💰 PRICE */}
          <div className="flex items-center gap-4 flex-wrap bg-white p-4 rounded-xl shadow">
            <span className="text-4xl font-bold text-green-600">
              ₹{product.discountPrice}
            </span>

            {product.mrpPrice > product.discountPrice && (
              <>
                <span className="line-through text-gray-400 text-lg">
                  ₹{product.mrpPrice}
                </span>

                <span className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full font-medium">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* STOCK */}
          <p className="text-sm">
            Availability:{" "}
            <span
              className={
                product.stock > 0
                  ? "text-green-600 font-semibold"
                  : "text-red-500 font-semibold"
              }
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </p>

          {/* GST */}
          <p className="text-sm text-gray-400">
            GST Included: {product.gst}%
          </p>

          {/* DESCRIPTION */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-2 text-lg">
              Product Description
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* 🔥 CTA BUTTONS */}
          <div className="flex flex-col gap-3 pt-2">

            <button className="flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition">
              <ShoppingCart size={18} /> Add to Cart
            </button>

            {/* ✅ ONLY ADD HERE */}
            <button
              onClick={handlePayment}
              className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              <Zap size={18} /> Buy Now
            </button>

            <a
              href={`https://wa.me/919358622621?text=I want to buy ${product.title}`}
              target="_blank"
              className="flex items-center justify-center gap-2 border border-green-600 text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition"
            >
              <Phone size={18} /> WhatsApp Enquiry
            </a>
          </div>

          {/* 🔥 TRUST SECTION */}
          <div className="grid grid-cols-3 gap-4 pt-6 text-center text-sm">

            <div className="flex flex-col items-center gap-1 text-gray-600 bg-white p-3 rounded-lg shadow">
              <Truck size={20} />
              Fast Delivery
            </div>

            <div className="flex flex-col items-center gap-1 text-gray-600 bg-white p-3 rounded-lg shadow">
              <ShieldCheck size={20} />
              Warranty
            </div>

            <div className="flex flex-col items-center gap-1 text-gray-600 bg-white p-3 rounded-lg shadow">
              🔒 Secure Payment
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 EXTRA DETAILS */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-3">
            More Details
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>
    </section>
  );
}