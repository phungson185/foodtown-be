const Order = require('../models/order');
const Product = require('../models/product')

const createOrder = async ({userId, productId, phoneNumber, amount}) => {
    try {
        const product = await Product.findById(productId);
        if (!product) throw new Error('Product not found');
        if (product.quantity <= 0) throw new Error('Out of quantity');
        const order = new Order({userId, productId, phoneNumber, amount});
        await order.save();
        return order;
    } catch (error) {
        console.log({error});
    }
}

const cancelOrder = async ({orderId}) => {
    try {
        const order = await Order.findById(orderId);
        if (order.status === true) {
            const product = await Product.findById(order.productId);
            product.quantity++;
            await product.save();
        }
        await Order.deleteOne({_id: orderId});
        return null;
    } catch (error) {
        console.log({error});
    }
}

const getOrderByUser = async ({userId}) => {
    try {
        const orders = await Order.find({userId}).populate('productId');
        return orders;
    } catch (error) {
        console.log({error});
    }
}

module.exports = {
    createOrder,
    getOrderByUser,
    cancelOrder
}