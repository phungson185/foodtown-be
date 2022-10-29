const Product = require('../models/product');

const createProduct = async (productInfo, productImage) => {
    console.log(productInfo.ingredients.split(','));
    try {
        const product = new Product({
            name: productInfo.name,
            ingredients: productInfo.ingredients.split(','),
            description: productInfo.description,
            quantity: parseInt(productInfo.quantity),
            price: parseInt(productInfo.price),
            rating: 5,
            image: {
                name: productImage.originalname,
                data: productImage.buffer,
            }
        });
        await product.save();
        return product;
    } catch (error) {
        console.log({error});
    }
}

const getProductById = async (req, res) => {
    const {id} = req.params;
    console.log(id);
    try {
        const result = await Product.findById(id);
        if (!result) {
            res.status(404).send({message: "failure", error: "Product cannot be found"});
        }
        res.status(200).send({message: "success", result});
    } catch (error) {
        res.status(500).send({message: "failure", error});
    }
}

const getProducts = async (page, limit, filter, name) => {
    try {
        const products = await Product.find(name ? {name: { $regex: `${name.toUpperCase()}` }} : {}).skip((page - 1) * limit).limit(limit).sort(filter ? {[filter]: 1} : {});
        return products;
    } catch (error) {
        console.log({error});
    }
}

const updateProduct = async (product) => {
    try {
        const updateableFields = ["name", "image", "ingredients", "description", "quantity", "price"];
        const updatingFields = Object.keys(product);
        if (!product.image) {
            delete product.image;
        }
        const updatingProduct = await Product.findById(product.id);
        updatingFields.forEach((updatingField) => {
            if (updateableFields.find(updateableField => updateableField === updatingField)) {
                updatingProduct[updatingField] = product[updatingField];
            }
        })
        await updatingProduct.save();
        return updatingProduct;
    } catch (error) {
        console.log({error});
    }
}

module.exports = {
    createProduct,
    getProductById,
    getProducts,
    updateProduct
}