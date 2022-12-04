const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    description: {
      type: String,
      require: true,
    },
    thumbnail: {
      name: {
        type: String,
        trim: true,
      },
      data: {
        type: Buffer,
      },
    },
    content: {
      type: String,
      require: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
    },
    viewCount: {
      type: Number,
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          require: true,
        },
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          require: true,
          ref: "User",
        },
        content: {
          type: String,
          trim: true,
          require: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
