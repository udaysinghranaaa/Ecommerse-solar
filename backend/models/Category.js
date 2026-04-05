const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    // 🔥 NEW FIELD (IMPORTANT)
    image: {
      type: String,
      default: "", // agar admin image na de to empty rahega
    },
  },
  { timestamps: true }
);

// 🔥 AUTO SLUG GENERATION
categorySchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }
});

module.exports =
  mongoose.models.Category ||
  mongoose.model("Category", categorySchema);