const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const multer = require("multer");
const onlyAdmin = require("../middlewares/onlyAdmin");
const auth = require("../middlewares/auth");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "DEV",
  },
});

const upload = multer({ storage: storage });
// const imageUpload = multer({
//   limits: {
//     fileSize: 1e12,
//   },
//   fileFilter: (req, file, cb) => {
//     if (!file.originalname.match(/\.(png|bmp|jpe?g)$/i)) {
//       return cb(new Error("file must be image format"));
//     }
//     cb(null, true);
//   },
// });

router.post("/", onlyAdmin, upload.single("image"), async (req, res) => {
  const productInfo = req.body;
  const productImage = req.file.path;
  try {
    if (!productImage) {
      res.status(401).send({ message: "failure", error: "image is required" });
    }

    const result = await productController.createProduct(
      productInfo,
      productImage
    );

    res.status(201).send({ message: "success", result });
  } catch (error) {
    res.status(401).send({ message: "failure", error });
  }
});

router.patch("/:id", onlyAdmin, upload.single("image"), async (req, res) => {
  try {
    const result = await productController.updateProduct({
      id: req.body.id,
      name: req.body.name,
      ingredients: req.body.ingredients,
      description: req.body.description,
      quantity: parseInt(req.body.quantity),
      price: parseInt(req.body.price),
      image: req.file.path,
    });
    res.status(201).send({ message: "success", result });
  } catch (error) {
    res.status(401).send({ message: "failure", error });
  }
});

router.get("/", async (req, res) => {
  const { page, limit, filter, name } = req.query;
  try {
    const result = await productController.getProducts(
      page,
      limit,
      filter,
      name
    );
    res.status(200).send({ message: "succcess", result });
  } catch (error) {
    res.status(400).send({ message: "failure", error });
  }
});

router.get("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await productController.getProductById(id);
    res.status(200).send({ message: "succcess", result });
  } catch (error) {
    res.status(400).send({ message: "failure", error });
  }
});

module.exports = router;
