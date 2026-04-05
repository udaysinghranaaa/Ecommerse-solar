const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // 🔥 USER INFO (future ke liye useful)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // guest checkout allow
    },

    // 🔥 PRODUCT INFO
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    image: {
      type: String,
    },

    // 🔥 PAYMENT INFO
    paymentId: {
      type: String,
    },

    orderId: {
      type: String, // Razorpay order id
    },

    signature: {
      type: String,
    },

    paymentMethod: {
      type: String,
      default: "Razorpay",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    // 💰 AMOUNT
    amount: {
      type: Number,
      required: true,
    },

    // 📦 ORDER STATUS
    orderStatus: {
      type: String,
      enum: ["placed", "processing", "shipped", "delivered"],
      default: "placed",
    },

    // 📍 ADDRESS (future use)
    address: {
      type: String,
    },

    phone: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);