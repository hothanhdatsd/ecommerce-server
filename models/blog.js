const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  numberViews: {
    type: Number,
    default: 0
  },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  ],
  disLikes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  ],
  images:
  {
    type: String,
    default: "https://cdn3.wpbeginner.com/wp-content/uploads/2020/04/featuredimageswp-og.png"
  },
  author: {
    type: String,
    default: "Admin"
  }
}, {
  timestamps: true,
  JSON: { virtuals: true },
  toObject: { virtuals: true },
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);