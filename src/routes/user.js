const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const auth = require('../middlewares/auth')
const upload = require('../services/upload')

router.post('/signup', async (req, res) => {
  const user = req.body
  try {
    const result = await userController.createUser(user)
    res.status(201).send({ message: 'Success', result })
  } catch (error) {
    res.status(401).send({ message: 'Failure', error: error.message })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const { admin } = req.query
  try {
    const result = await userController.login(email, password, admin)
    res.status(201).send({ message: 'Success', result })
  } catch (error) {
    res.status(401).send({ message: 'Failure', error: error.message })
  }
})

router.post('/logout', auth, async (req, res) => {
  try {
    const result = await userController.logout(req.user, req.token)
    res.status(201).send({ message: 'Success', result })
  } catch (error) {
    res.status(401).send({ message: 'Failure', error: error.message })
  }
})

router.get('/', auth, async (req, res) => {
  try {
    res.status(200).send({
      message: 'Success',
      result: {
        _id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
      },
    })
  } catch (error) {
    res.status(400).send({ message: 'Failure', error: error.message })
  }
})

router.get('/profile', auth, async (req, res) => {
  try {
    res.status(200).send({
      message: 'Success',
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
    })
  } catch (error) {
    res.status(400).send({ message: 'Failure', error: error.message })
  }
})

router.put('/profile', auth, upload.single('avatar'), async (req, res) => {
  try {
    const result = await userController.update(req)
    res.status(201).send({ message: 'success', result })
  } catch (error) {
    res.status(401).send({ message: 'failure', error })
  }
})

module.exports = router
