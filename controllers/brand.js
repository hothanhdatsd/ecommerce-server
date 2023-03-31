const Brand = require("../models/brand");
const asyncHandle = require("express-async-handler")

const createBrand = asyncHandle(async (req, res) => {
  const response = await Brand.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    response
  })
})

const getBrands = asyncHandle(async (req, res) => {
  const response = await Brand.find()
  return res.status(200).json({
    success: response ? true : false,
    response
  })
})


const updateBrand = asyncHandle(async (req, res) => {
  const { brid } = req.params
  const updatedBrand = await Brand.findByIdAndUpdate(brid, req.body, { new: true })
  return res.status(200).json({
    success: updatedBrand ? true : false,
    updatedBrand
  })
})

const deleteBrand = asyncHandle(async (req, res) => {
  const { brid } = req.params
  const deletedBrand = await Brand.findByIdAndRemove(brid)
  return res.status(200).json({
    success: deletedBrand ? true : false,
  })
})


module.exports = {
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand
}