import mongoose from "mongoose"
import Post from "./postModel.js"
// import Url from "./urlModel.js"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// For ensuring the integrity of the database
userSchema.pre(
  "deleteOne",
  { document: true}, //to load the document otherwise it will give null
  async function (next) {
    try {
      const posts = await Post.find({ user: this._id })
      await Post.deleteMany({ user: this._id })
      next()
    } catch (error) {
      next(error)
    }
  }
)

const User = mongoose.model("User", userSchema)

export default User
