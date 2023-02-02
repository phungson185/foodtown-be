const mongoose = require('mongoose')
const { common } = require('../utils')

const paymentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    paid: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: common.PaymentStatusType,
      default: common.PaymentStatusType.PENDING,
    },
    bank: {
      type: String,
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Payment = mongoose.model('Payment', paymentSchema)
module.exports = Payment
