const { ADMIN } = require('../constants/role')
const User = require('../models/user')

const createUser = async (user) => {
  try {
    const newUser = new User(user)
    const token = await newUser.generateAuthToken()
    await newUser.save()
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token,
    }
  } catch (error) {
    throw new Error(error)
  }
}

const login = async (email, password, isLoginAdmin) => {
  try {
    const user = await User.findByCredential(email, password)
    const token = await user.generateAuthToken()
    if (isLoginAdmin === 'true' && user.role !== ADMIN) {
      throw new Error('You cannot login as an admin')
    }
    await user.save()
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token,
    }
  } catch (error) {
    throw new Error(error)
  }
}

const logout = async (user, token) => {
  try {
    user.tokens = user.tokens.filter((userToken) => userToken === token)
    await user.save()
    return null
  } catch (error) {
    console.log({ error })
  }
}

const getAllUsers = async () => {
  try {
    const users = await User.find({})
    return users
  } catch (error) {
    console.log({ error })
  }
}

const update = async (req) => {
  const newUser = {
    firstName: req.body?.firstName,
    lastName: req.body?.lastName,
    phoneNumber: req.body?.phoneNumber,
    avatar: req?.file?.path,
    address: req.body?.address,
  }
  try {
    const updated = await User.findByIdAndUpdate(req.user._id, newUser, {
      new: true,
    })
    return updated
  } catch (error) {
    console.log({ error })
  }
}

module.exports = {
  createUser,
  login,
  logout,
  getAllUsers,
  update,
}
