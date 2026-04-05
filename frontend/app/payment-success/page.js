"use client";

import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow text-center max-w-md">

        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Your order has been placed successfully.
        </p>

        <button
          onClick={() => router.push("/")}
          className="bg-green-600 text-white px-6 py-3 rounded-xl"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}