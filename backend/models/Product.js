const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    // 🔥 IMAGES
    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    // 🔥 PRICING
    mrpPrice: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
      required: true,
    },

    gst: {
      type: Number,
      default: 18,
    },

    stock: {
      type: Number,
      default: 0,
    },

    // 🔥 CATEGORY
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // 🔥 SUBCATEGORY
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },

    // 🔥 REVIEWS SYSTEM
    ratings: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    // 🔥 FLAGS
    isTrending: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isSubsidy: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // =========================
    // 🔥 EXISTING (NO CHANGE)
    // =========================

    // ✅ TECHNICAL SPECIFICATIONS
    technicalSpecs: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],

    // ✅ FAQs
    faqs: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],

    // ✅ Q/A
    qa: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],

    // =========================
    // 🔥 NEW ADDITIONS
    // =========================

    // ✅ CUSTOMER REVIEWS (Admin controlled)
    customerReviews: [
      {
        name: { type: String },
        rating: { type: Number },
        comment: { type: String },
      },
    ],

    // ✅ PRODUCT VIDEOS
    videos: [
      {
        url: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// 🔥 INDEXES
productSchema.index({ category: 1 });
productSchema.index({ isTrending: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isSubsidy: 1 });

// ✅ prevent overwrite error
module.exports =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);