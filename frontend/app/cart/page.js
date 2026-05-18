"use client";

import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default function CartPage() {
  const router = useRouter();

  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
  } = useCart();

  // ✅ TOTAL
  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc + item.discountPrice * item.quantity,
    0
  );

  // ✅ IMAGE
  const getImageUrl = (item) => {
    if (!item?.images || item.images.length === 0) {
      return null;
    }

    const firstImage = item.images[0];

    if (typeof firstImage === "object" && firstImage.url) {
      return `${BASE_URL}/${firstImage.url.replace(/\\/g, "/")}`;
    }

    return `${BASE_URL}/${firstImage.replace(/\\/g, "/")}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* ✅ HEADING */}
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="text-green-600" size={32} />

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Shopping Cart
          </h1>
        </div>

        {/* ✅ EMPTY CART */}
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-12 text-center">

            <h2 className="text-2xl font-semibold text-gray-700">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mt-2">
              Add some amazing solar products to your cart.
            </p>

            <button
              onClick={() => router.push("/shop")}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition"
            >
              Continue Shopping
            </button>

          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ✅ CART ITEMS */}
            <div className="lg:col-span-2 space-y-6">

              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl shadow-sm p-5 flex flex-col sm:flex-row gap-5"
                >

                  {/* ✅ IMAGE */}
                  <div className="w-full sm:w-40 h-40 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">

                    {getImageUrl(item) ? (
                      <img
                        src={getImageUrl(item)}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-400">
                        No Image
                      </div>
                    )}

                  </div>

                  {/* ✅ DETAILS */}
                  <div className="flex-1 flex flex-col justify-between">

                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {item.title}
                      </h2>

                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-2xl font-bold text-green-600">
                          ₹{item.discountPrice}
                        </span>

                        {item.mrpPrice > item.discountPrice && (
                          <span className="line-through text-gray-400">
                            ₹{item.mrpPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ✅ ACTIONS */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-5">

                      {/* QUANTITY */}
                      <div className="flex items-center border rounded-xl overflow-hidden">

                        <button
                          onClick={() =>
                            decreaseQty(item._id)
                          }
                          className="px-4 py-2 hover:bg-gray-100"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="px-5 font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQty(item._id)
                          }
                          className="px-4 py-2 hover:bg-gray-100"
                        >
                          <Plus size={16} />
                        </button>

                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() =>
                          removeFromCart(item._id)
                        }
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ SUMMARY */}
            <div className="bg-white rounded-3xl shadow-sm p-6 h-fit sticky top-24">

              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 text-gray-700">

                <div className="flex justify-between">
                  <span>Items</span>

                  <span>
                    {cartItems.reduce(
                      (acc, item) =>
                        acc + item.quantity,
                      0
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Subtotal</span>

                  <span>₹{totalPrice}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>

                  <span className="text-green-600">
                    Free
                  </span>
                </div>

                <hr />

                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>

                  <span>₹{totalPrice}</span>
                </div>

              </div>

              <button
                className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl text-lg font-semibold transition"
              >
                Proceed to Checkout
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}