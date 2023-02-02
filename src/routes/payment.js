const express = require('express')
const router = express.Router()
const paymentController = require('../controllers/payment')
const auth = require('../middlewares/auth')
const { ADMIN } = require('../constants/role')

router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== ADMIN) {
      return res.status(401).send({ message: 'failure', error: 'Unauthorized' })
    }

    const result = await paymentController.getAllPayments()
    return res.status(200).send({ message: 'success', result })
  } catch (error) {
    res.status(401).send({ message: 'failure', error })
  }
})

router.post('/', auth, async (req, res) => {
  const { amount, paid, bank, orderId } = req.body
  const userId = req.user._id
  try {
    const result = await paymentController.createPayment({
      userId,
      amount,
      paid,
      bank,
      orderId,
    })
    return res.status(200).send({ success: true, message: 'Create Payment Success', result })
  } catch (error) {
    res.status(400).send({ message: 'failure', error })
  }
})

module.exports = router
