const Payment = require('../models/payment')
const Order = require('../models/order')
const { PaymentStatusType, OrderStatusType } = require('../utils/common')

const createPayment = async ({ userId, amount, paid, bank, orderId }) => {
  try {
    const newPayment = new Payment({
      userId,
      amount,
      paid,
      bank,
      orderId,
    })
    await newPayment.save()
  } catch (error) {
    console.log({ error })
  }
}

const updatePayment = async ({ paymentId, status, paid }) => {
  try {
    const payment = await Payment.findByIdAndUpdate({ _id: paymentId }, { $set: { status, paid } })

    const order = await Order.findOne({ _id: payment.orderId })

    if (status === PaymentStatusType.APPROVED) {
      order.status = OrderStatusType.ORDER_PAYMENT_COMPLETED
    } else if (status === PaymentStatusType.LACK) {
      order.status = OrderStatusType.ORDER_PAYMENT_LACK
    } else if (status === PaymentStatusType.REJECTED) {
      order.status = OrderStatusType.ORDER_PAYMENT_REJECTED
    } else {
      order.status = OrderStatusType.ORDER_FAIL
    }

    order.amountLack = order.amount - paid
    await payment.save()
    await order.save()
  } catch (error) {
    console.log({ error })
  }
}

const getAllPayments = async () => {
  try {
    const payments = await Payment.find().sort({ createdAt: 1 })
    return payments
  } catch (error) {
    console.log({ error })
  }
}

module.exports = {
  createPayment,
  getAllPayments,
  updatePayment,
}
