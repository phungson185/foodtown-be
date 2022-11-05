const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const auth = require('../middlewares/auth');

router.get('/', auth, async (req, res) => {
    const userId = req.user._id;
    try {
        const result = await orderController.getOrderByUser({userId});
        res.status(201).send({message: "success", result});
    } catch (error) {
        res.status(401).send({message: "failure", error});
    }
})

router.post('/', auth, async (req, res) => {
    const { productId, amount } = req.body;
    const userId = req.user._id;
    const phoneNumber = req.user.phoneNumber;
    try {
        const result = await orderController.createOrder({userId, productId, phoneNumber, amount});
        res.status(201).send({message: "success", result});
    } catch (error) {
        res.status(401).send({message: "failure", error});
    }
})

router.delete('/', auth, async (req, res) => {
    const { orderId } = req.body;
    try {
        const result = await orderController.cancelOrder({orderId});
        res.status(201).send({message: "success", result});
    } catch (error) {
        res.status(401).send({message: "failure", error});
    }
})

module.exports = router;