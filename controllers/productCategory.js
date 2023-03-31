const ProductCategory = require("../models/productCategory")
const asyncHandle = require("express-async-handler")

const createProductCategory = asyncHandle(async (req, res) => {
  const response = await ProductCategory.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    response
  })
})

const getProductCategories = asyncHandle(async (req, res) => {
  const response = await ProductCategory.find().select("title -_id")
  return res.status(200).json({
    success: response ? true : false,
    response
  })
})


const updateCategory = asyncHandle(async (req, res) => {
  const { pcid } = req.params
  const updatedCategory = await ProductCategory.findByIdAndUpdate(pcid, req.body, { new: true })
  return res.status(200).json({
    success: updatedCategory ? true : false,
    updatedCategory
  })
})

const deleteCategory = asyncHandle(async (req, res) => {
  const { pcid } = req.params
  const deletedCategory = await ProductCategory.findByIdAndRemove(pcid)
  return res.status(200).json({
    success: deletedCategory ? true : false,
  })
})


module.exports = {
  createProductCategory,
  getProductCategories,
  updateCategory,
  deleteCategory
}