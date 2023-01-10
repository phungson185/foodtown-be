const Order = require('../models/order')
const Product = require('../models/product')
const { common } = require('../utils')

const createOrder = async ({ userId, products, phoneNumber, amount, address }) => {
  try {
    for (let i = 0; i < products.length; i++) {
      const product = await Product.findById(products[i].id);
      if (product.quantity === 0) {
        throw new Error("Product out of stock");
      }
    }
    const order = new Order({
      userId,
      products,
      phoneNumber,
      amount,
      address
    });
    await order.save();
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
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return orders;
  } catch (error) {
    console.log({ error })
  }
}

module.exports = {
  createOrder,
  getOrderByUser,
  cancelOrder,
}
