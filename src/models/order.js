const mongoose = require('mongoose')
const { common } = require('../utils')

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Product',
      },
    ],
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
      type: Number,
      enum: common.OrderStatusType,
      default: common.OrderStatusType.ORDER_PAYMENT_COMPLETED,
    },
  },
  {
    timestamps: true,
  }
)

const Order = mongoose.model('Order', orderSchema)
module.exports = Order
