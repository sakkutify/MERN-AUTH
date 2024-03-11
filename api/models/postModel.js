import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  image: {
    type: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
  tags: {
    type: [String],
    default: [],
  },
  text: {
    type: String,
  },
  publishDate: {
    type: Date,
  },
  owner: {
    id: {
      type: String,
    },
    title: {
      type: String,
      default: '',
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    picture: {
      type: String,
    },
  },
});

const Post = mongoose.model('Post', postSchema);

export default Post