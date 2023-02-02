const express = require('express')
require('dotenv').config()
const userRouter = require('./routes/user')
const productRouter = require('./routes/product')
const blogRouter = require('./routes/blog')
const orderRouter = require('./routes/order')
const sponsorRouter = require('./routes/sponsor')
const paymentRouter = require('./routes/payment')

require('./job/getAuthToken')
require('./job/verifyOrder')
const cors = require('cors')
require('./db/mongoose')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors({ credentials: true, origin: process.env.ORIGIN }))
app.use('/users', userRouter)
app.use('/products', productRouter)
app.use('/blogs', blogRouter)
app.use('/sponsors', sponsorRouter)
app.use('/orders', orderRouter)
app.use('/payments', paymentRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
