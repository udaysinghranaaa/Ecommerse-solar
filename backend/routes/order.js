const express = require("express");
const Order = require("../models/Order");

const router = express.Router();


// 🔥 1. GET ALL ORDERS (ADMIN)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("productId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});


// 🔥 2. GET SINGLE ORDER
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});


// 🔥 3. GET USER ORDERS (future use)
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});


// 🔥 4. UPDATE ORDER STATUS (ADMIN)
router.put("/:id", async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    res.json(updatedOrder);
  } catch (err) {
    console.log(err);
    res.status(500).send("Update Failed");
  }
});


// 🔥 5. DELETE ORDER (optional)
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Delete Failed");
  }
});

module.exports = router;