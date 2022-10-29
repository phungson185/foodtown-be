const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const multer = require("multer");

const imageUpload = multer({
    limits: {
        fileSize: 1e12,
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(png|bmp|jpe?g)$/i)) {
            return cb(new Error("file must be image format"));
        }
        cb(null, true);
    },
});

router.post('/', imageUpload.single('image'), async (req, res) => {
    const productInfo = req.body;
    const productImage = req.file;
    try {
        const result = await productController.createProduct(productInfo, productImage);
        res.status(201).send({message: "success", result});
    } catch (error) {
        res.status(401).send({message: "failure", error});
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const result = productController.updateBlog({
            id: req.body.id,
            name: req.body.name,
            ingredients: req.body.ingredients,
            description: req.body.description,
            quantity: parseInt(req.body.quantity),
            price: parseInt(req.body.price),
            image: req.file ? {
                name: req.file?.originalname,
                data: req.file?.buffer
            } : null
        });
        res.status(201).send({message: "succcess", result});
    } catch (error) {
        res.status(401).send({message: "failure", error});
    }
});

router.get('/', async (req, res) => {
    const {page, limit, filter, name} = req.query;
    try {
        const result = await productController.getProducts(page, limit, filter, name);
        res.status(200).send({message: "succcess", result});
    } catch (error) {
        res.status(400).send({message: "failure", error});
    }
});

router.get('/:id', productController.getProductById);
module.exports = router;