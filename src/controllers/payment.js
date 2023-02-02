const Payment = require('../models/payment')

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
    await payment.save()
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
