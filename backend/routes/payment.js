const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Order = require("../models/Order");
const Product = require("../models/Product");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: "YOUR_KEY_ID",
  key_secret: "YOUR_KEY_SECRET",
});


// 🔥 1. CREATE ORDER
router.post("/create-order", async (req, res) => {
  try {
    const { productId } = req.body;

    // 🔐 GET PRODUCT FROM DB (secure price)
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const amount = product.discountPrice;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    // 💾 SAVE ORDER (PENDING)
    const newOrder = await Order.create({
      productId: product._id,
      title: product.title,
      price: product.discountPrice,
      amount: amount,
      image: product.images?.[0]?.url || "",
      orderId: order.id,
      paymentStatus: "pending",
    });

    res.json({
      order,
      dbOrderId: newOrder._id,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});


// 🔥 2. VERIFY PAYMENT
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", "YOUR_KEY_SECRET")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      // ✅ UPDATE ORDER (SUCCESS)
      await Order.findByIdAndUpdate(dbOrderId, {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        paymentStatus: "success",
      });

      return res.json({ success: true });

    } else {
      // ❌ FAILED
      await Order.findByIdAndUpdate(dbOrderId, {
        paymentStatus: "failed",
      });

      return res.status(400).json({ success: false });
    }

  } catch (err) {
    console.log(err);
    res.status(500).send("Verification Error");
  }
});

module.exports = router;