const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    collection: "admins",
  }
);

module.exports =
  mongoose.models.Admin ||
  mongoose.model("Admin", adminSchema);