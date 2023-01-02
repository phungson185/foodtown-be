const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../middlewares/auth");
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

router.post("/signup", async (req, res) => {
  const user = req.body;
  try {
    const result = await userController.createUser(user);
    res.status(201).send({ message: "Success", result });
  } catch (error) {
    res.status(401).send({ message: "Failure", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { admin } = req.query;
  try {
    const result = await userController.login(email, password, admin);
    res.status(201).send({ message: "Success", result });
  } catch (error) {
    res.status(401).send({ message: "Failure", error: error.message });
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    const result = await userController.logout(req.user, req.token);
    res.status(201).send({ message: "Success", result });
  } catch (error) {
    res.status(401).send({ message: "Failure", error: error.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    res.status(200).send({
      message: "Success",
      result: {
        _id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
      },
    });
  } catch (error) {
    res.status(400).send({ message: "Failure", error: error.message });
  }
});

router.get("/profile", auth, async (req, res) => {
  try {
    res.status(200).send({
      message: "Success",
      result: {
        _id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        phoneNumber: req.user.phoneNumber,
        address: req.user.address,
      },
    });
  } catch (error) {
    res.status(400).send({ message: "Failure", error: error.message });
  }
});

router.put("/profile", auth, imageUpload.single("thumbnail"), async(req, res) => {
  try {
    const result = await userController.update(req);
    res.status(201).send({ message: "success", result });
  } catch (error) {
    res.status(401).send({ message: "failure", error });
  }
})

module.exports = router;
