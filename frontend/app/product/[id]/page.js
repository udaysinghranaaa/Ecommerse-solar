"use client";

import { useEffect, useState } from "react";
import API from "../../services/api"; // ✅ CHANGED
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  ShoppingCart,
  Zap,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ecommerse-solar.onrender.com"; // ✅ CHANGED

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!id) return;

    // ✅ FIXED API CALL
    API.get(`/products/${id}`)
      .then((res) => setProduct(res.data.product || res.data))
      .catch((err) => console.log(err));

    // Razorpay script
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }

  }, [id]);

  // ✅ PAYMENT FIX
  const handlePayment = async () => {
    try {
      const { data } = await API.post("/payment/create-order", {
        productId: product._id,
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

  if (!product) {
    return (
      <div className="p-16 text-center text-gray-400 text-lg">
        Loading product...
      </div>
    );
  }

  const images = product.images || [];

  // ✅ IMAGE FIX
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

  return (
    <section className="bg-gray-50 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-start">

        <div className="space-y-4 lg:sticky lg:top-24 self-start">
          <div className="bg-white rounded-2xl p-6 shadow flex items-center justify-center h-[420px]">
            {images.length > 0 ? (
              <img
                src={getImage(images[activeImage])}
                alt={product.title}
                className="max-h-full object-contain"
              />
            ) : (
              <p>No Image</p>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto">
            {images.map((img, index) => (
              <img
                key={index}
                src={getImage(img)}
                onClick={() => setActiveImage(index)}
                className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 ${
                  activeImage === index
                    ? "border-green-600"
                    : "border-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-sm text-green-600 font-semibold uppercase">
            {product.category?.name || "Category"}
          </p>

          <h1 className="text-3xl font-bold">
            {product.title}
          </h1>

          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill="currentColor" />
            ))}
          </div>

          <div className="bg-white p-4 rounded-xl">
            <span className="text-4xl font-bold text-green-600">
              ₹{product.discountPrice}
            </span>
          </div>

          <button onClick={handlePayment}>
            Buy Now
          </button>
        </div>
      </div>
    </section>
  );
}