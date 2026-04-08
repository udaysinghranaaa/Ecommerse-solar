"use client";

import { useEffect, useState } from "react";
import API, { getImageUrl } from "../services/api"; // ✅ FIX

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/orders") // ✅ FIX
      .then((res) => {
        const data = res.data.orders || res.data || [];
        setOrders(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">

        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found</p>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-5 rounded-2xl shadow flex flex-col md:flex-row gap-6"
              >

                {/* ✅ IMAGE FIX */}
                <img
                  src={getImageUrl(order.image)}
                  alt="product"
                  className="w-32 h-32 object-cover rounded-lg"
                />

                {/* DETAILS */}
                <div className="flex-1 space-y-2">

                  <h2 className="text-lg font-semibold">
                    {order.title}
                  </h2>

                  <p className="text-gray-600">
                    ₹{order.price}
                  </p>

                  <p className="text-sm text-gray-500">
                    Order ID: {order._id}
                  </p>

                  <p className="text-sm">
                    Payment:{" "}
                    <span
                      className={
                        order.paymentStatus === "success"
                          ? "text-green-600 font-semibold"
                          : "text-red-500 font-semibold"
                      }
                    >
                      {order.paymentStatus}
                    </span>
                  </p>

                  <p className="text-sm">
                    Status:{" "}
                    <span className="text-blue-600 font-semibold">
                      {order.orderStatus}
                    </span>
                  </p>
                </div>

                {/* DATE */}
                <div className="text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}