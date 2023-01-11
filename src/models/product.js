const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    ingredients: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    quantity: {
      type: Number,
    },
    comments: [
      {
        userId: mongoose.Types.ObjectId,
        content: String,
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.model('Product', productSchema)
module.exports = Product
