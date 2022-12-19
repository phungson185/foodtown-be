const Order = require('../models/order')
const Product = require('../models/product')
const { common } = require('../utils')

const createOrder = async ({ userId, products, phoneNumber, amount }) => {
  try {
    const product = await Product.find({
      _id: { $in: products },
    })

    if (product.length !== products.length) {
      throw new Error('Product not found')
    }

    const result = await Order.create({ userId, products, phoneNumber, amount, paid: amount })
    return result
  } catch (error) {
    console.log({ error })
  }
}

const cancelOrder = async ({ orderId }) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      { status: common.OrderStatusType.ORDER_CANCEL }
    )
    await Product.findByIdAndUpdate({ _id: { $in: order.products } }, { $inc: { quantity: 1 } })

    return null
  } catch (error) {
    console.log({ error })
  }
}

const getOrderByUser = async ({ userId }) => {
  try {
    const orders = await Order.find({ userId }).populate('productId')
    return orders
  } catch (error) {
    console.log({ error })
  }
}

module.exports = {
  createOrder,
  getOrderByUser,
  cancelOrder,
}
