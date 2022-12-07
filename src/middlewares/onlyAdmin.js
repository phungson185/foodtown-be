const jwt = require("jsonwebtoken");
const { ADMIN } = require("../constants/role");
const User = require("../models/user");

const onlyAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "secretkey");
    const user = await User.findOne({
      _id: decoded._id,
    });
    if (!user) {
      throw new Error("Unauthorized!");
    }
    if (user.role !== ADMIN) {
      throw new Error("Only admin can execute this action!");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = onlyAdmin;
