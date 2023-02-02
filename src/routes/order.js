const express = require('express')
const router = express.Router()
const orderController = require('../controllers/order')
const auth = require('../middlewares/auth')

router.get('/', auth, async (req, res) => {
  const userId = req.user._id
  try {
    const result = await orderController.getOrderByUser({ userId })
    return res.status(201).send({ message: 'success', result })
  } catch (error) {
    res.status(401).send({ message: 'failure', error })
  }
})

router.post('/', auth, async (req, res) => {
  const { products, amount, phoneNumber, address } = req.body
  const userId = req.user._id
  try {
    const result = await orderController.createOrder({
      userId,
      products,
      phoneNumber,
      amount,
      address,
    })
    return res.status(201).send({ success: true, message: 'Create Order Success', result })
  } catch (error) {
    res.status(401).send({ message: 'failure', error })
  }
})

router.delete('/', auth, async (req, res) => {
  const { orderId } = req.body
  try {
    const result = await orderController.cancelOrder({ orderId })
    res.status(201).send({ message: 'success', result })
  } catch (error) {
    res.status(401).send({ message: 'failure', error })
  }
})

module.exports = router
