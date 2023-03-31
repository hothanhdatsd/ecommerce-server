const BlogCategory = require("../models/blogCategory")
const asyncHandle = require("express-async-handler")

const createBlogCategory = asyncHandle(async (req, res) => {
  const response = await BlogCategory.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    response
  })
})

const getBlogCategories = asyncHandle(async (req, res) => {
  const response = await BlogCategory.find().select("title -_id")
  return res.status(200).json({
    success: response ? true : false,
    response
  })
})


const updateBlogCategory = asyncHandle(async (req, res) => {
  const { bcid } = req.params
  const updatedCategory = await BlogCategory.findByIdAndUpdate(bcid, req.body, { new: true })
  return res.status(200).json({
    success: updatedCategory ? true : false,
    updatedCategory
  })
})

const deleteBlogCategory = asyncHandle(async (req, res) => {
  const { bcid } = req.params
  const deletedCategory = await BlogCategory.findByIdAndRemove(bcid)
  return res.status(200).json({
    success: deletedCategory ? true : false,
  })
})


module.exports = {
  createBlogCategory,
  getBlogCategories,
  updateBlogCategory,
  deleteBlogCategory
}