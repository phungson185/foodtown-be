const Product = require("../models/product");

const createProduct = async (productInfo, productImage) => {
  try {
    const product = new Product({
      name: productInfo.name,
      ingredients: productInfo.ingredients.split(","),
      description: productInfo.description,
      quantity: parseInt(productInfo.quantity),
      price: parseInt(productInfo.price),
      rating: 5,
      image: {
        name: productImage.originalname,
        data: productImage.buffer,
      },
    });
    await product.save();
    return product;
  } catch (error) {
    console.log({ error });
  }
};

const getProductById = async (id) => {
  try {
    const result = await Product.findById(id);
    if (!result) {
      throw new Error("Product cannot be found");
    }
    return result;
  } catch (error) {
    console.log({ error });
  }
};

const getProducts = async (page, limit, filter, name) => {
  try {
    const products = await Product.find(
      name ? { name: { $regex: `${name.toUpperCase()}` } } : {}
    )
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(filter ? { [filter]: 1 } : {});
    return products;
  } catch (error) {
    console.log({ error });
  }
};

const updateProduct = async (product) => {
  try {
    const updateableFields = [
      "name",
      "image",
      "ingredients",
      "description",
      "quantity",
      "price",
    ];
    const updatingFields = Object.keys(product);
    if (!product.image) {
      delete product.image;
    }
    const updatingProduct = await Product.findById(product.id);
    updatingFields.forEach((updatingField) => {
      if (
        updateableFields.find(
          (updateableField) => updateableField === updatingField
        )
      ) {
        updatingProduct[updatingField] = product[updatingField];
      }
    });
    await updatingProduct.save();
    return updatingProduct;
  } catch (error) {
    console.log({ error });
  }
};

module.exports = {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
};
