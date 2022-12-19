const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    products: {
      type: Object,
      require: true,
    },
    phoneNumber: {
      type: String,
      require: true,
      trim: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    paid: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
