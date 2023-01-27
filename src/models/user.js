const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { ADMIN, USER } = require('../constants/role')

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    require: true,
    trim: true,
  },
  lastName: {
    type: String,
    require: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  // tokens: [
  //   {
  //     token: {
  //       type: String,
  //       require: true,
  //     },
  //   },
  // ],
  role: {
    type: String,
    enum: [ADMIN, USER],
    default: USER,
  },
  avatar: {
    type: String,
    default: '',
  },
  address: {
    type: Object,
  },
})

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.__v
  return userObject
}

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id, email: user.email }, 'secretkey')
  return token
}

userSchema.statics.findByCredential = async function (email, password) {
  const user = await User.findOne({ email })
  if (!user) {
    throw Error('User is not found')
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw Error('Password is not match')
  }
  return user
}

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
