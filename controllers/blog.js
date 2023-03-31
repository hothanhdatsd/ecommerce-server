const Blog = require("../models/blog")
const asyncHandle = require("express-async-handler")

const createBlog = asyncHandle(async (req, res) => {
  const { title, description, category } = req.body
  if (!title || !description | !category) throw new Error("Missing input")
  const response = await Blog.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    response
  })
})


const getAllBlog = asyncHandle(async (req, res) => {
  const response = await Blog.find();
  return res.status(200).json({
    success: response ? true : false,
    response
  })
})

const updateBlog = asyncHandle(async (req, res) => {
  const { bid } = req.params
  if (Object.keys(req.body).length === 0) throw new Error("Missing input")
  const response = await Blog.findOneAndUpdate(bid, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    response
  })
})

const uploadImageBlog = asyncHandle(async (req, res) => {
  if (!req.file) {
    throw new Error("Missing input")
  }
  console.log(req.file)
  const { bid } = req.params
  const response = await Blog.findByIdAndUpdate(bid, { images: req.file.path }, { new: true })
  return res.json({
    success: response ? true : false,
    response
  })
})

const likeBlog = asyncHandle(async (req, res) => {
  const { _id } = req.user
  const { bid } = req.params
  if (!bid) {
    throw new Error("Missing input")
  }
  const blog = await Blog.findById(bid)


  const alreadyDisliked = blog?.disLikes?.find(el => el.toString() === _id)
  if (alreadyDisliked) {
    const response = await Blog.findByIdAndUpdate(bid, { $pull: { disLikes: _id } }, { new: true })
    return res.json({
      success: response ? true : false,
      response
    })
  }

  const isLiked = blog?.likes?.find(el => el.toString() === _id)
  if (isLiked) {
    const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true })
    return res.json({
      success: response ? true : false,
      response
    })
  } else {
    const response = await Blog.findByIdAndUpdate(bid, { $push: { likes: _id } }, { new: true })
    return res.json({
      success: response ? true : false,
      response
    })
  }
})


const disLikeBlog = asyncHandle(async (req, res) => {
  const { _id } = req.user
  const { bid } = req.params
  if (!bid) {
    throw new Error("Missing input")
  }
  const blog = await Blog.findById(bid)


  const alreadyLiked = blog?.likes?.find(el => el.toString() === _id)
  if (alreadyLiked) {
    const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true })
    return res.json({
      success: response ? true : false,
      response
    })
  }

  const isDisLiked = blog?.disLikes?.find(el => el.toString() === _id)
  if (isDisLiked) {
    const response = await Blog.findByIdAndUpdate(bid, { $pull: { disLikes: _id } }, { new: true })
    return res.json({
      success: response ? true : false,
      response
    })
  } else {
    const response = await Blog.findByIdAndUpdate(bid, { $push: { disLikes: _id } }, { new: true })
    return res.json({
      success: response ? true : false,
      response
    })
  }
})

const includeFields = "name email"
const getBlog = asyncHandle(async (req, res) => {
  const { bid } = req.params
  const blog = await Blog.findByIdAndUpdate(bid, { $inc: { numberViews: 1 } }, { new: true }).populate('likes', includeFields).populate("disLikes", includeFields)
  return res.json({
    success: blog ? true : false
    , blog
  })
})


const deleteBlog = asyncHandle(async (req, res) => {
  const { bid } = req.params
  const blog = await Blog.findByIdAndDelete(bid)
  res.json({
    success: blog ? true : false
  })

})



module.exports = {
  createBlog,
  getAllBlog,
  updateBlog,
  likeBlog,
  disLikeBlog,
  getBlog,
  deleteBlog,
  uploadImageBlog
}