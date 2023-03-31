const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const { query } = require('express')

const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length == 0) throw new Error("Missing input")
  if (req.body && req.body.title) {
    req.body.slug = slugify(req.body.title)
  }
  const newProduct = await Product.create(req.body)
  return res.status(200).json({
    success: newProduct ? true : false,
    message: newProduct ? "Product created successfully" : "Product not created successfully",
    newProduct
  })
})


const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid);
  if (!product) {
    throw new Error("Not found product")
  }
  return res.status(200).json({
    success: product ? true : false,
    product
  })
})


const getProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query }

  const excludeFields = ['limit', 'sort', 'page', 'fields']
  excludeFields.forEach(el => delete queries[el])

  let queryString = JSON.stringify(queries)
  queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`)

  //filter
  const formatedQueries = JSON.parse(queryString)
  if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: "i" }

  let queryCommand = Product.find(formatedQueries)

  //sort
  if (req.query.sort) {
    console.log(req.query.sort);
    const sortBy = req.query.sort.split(",").join(" ")
    queryCommand = queryCommand.sort(sortBy)
  }

  //field
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields)
  }

  //panigation
  const page = +req.query.page || 1
  const limit = +req.query.limit || process.env.LIMIT_PRODUCT
  const skip = (page - 1) * limit
  queryCommand.skip(skip).limit(limit)

  const response = await queryCommand.exec();

  if (!response) {
    throw new Error("Cannot get products");
  }

  const counts = await Product.find(formatedQueries).countDocuments();
  return res.status(200).json({
    success: true,
    counts,
    products: response,
  });


})

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (req.body && req.body.title) {
    req.body.slug = slugify(req.body.title)
  }
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true });
  if (!updatedProduct) {
    throw new Error("Not found product")
  }
  return res.status(200).json({
    success: updatedProduct ? true : false,
    updatedProduct
  })
})



const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(pid);
  if (!deletedProduct) {
    throw new Error("Not found product")
  }
  return res.status(200).json({
    success: deletedProduct ? true : false,
    deletedProduct
  })
})


const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid } = req.body;
  if (!star || !pid) {
    throw new Error("Missing input")
  }
  const ratingProduct = await Product.findById(pid);
  const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id)
  if (alreadyRating) {
    await Product.updateOne({
      ratings: { $elemMatch: alreadyRating }
    },
      { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
      { new: true })
  } else {
    await Product.findByIdAndUpdate(pid, { $push: { ratings: { star, postedBy: _id, comment } } }, { new: true })
  }

  //sum ratings
  const updatedProduct = await Product.findById(pid)
  const ratingCount = updatedProduct.ratings.length
  const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + +el.star, 0)
  updatedProduct.totalRatings = Math.round(sumRatings * 10 / ratingCount) / 10
  await updatedProduct.save()



  return res.status(200).json({
    success: true,
    updatedProduct
  })
})


const uploadImagesProduct = asyncHandler(async (req, res) => {
  if (!req.files) {
    throw new Error("Missing input")
  }
  const { pid } = req.params
  const response = await Product.findByIdAndUpdate(pid, { $push: { images: { $each: req.files.map(el => el.path) } } }, { new: true })
  return res.json({
    success: response ? true : false,
    response
  })
})

module.exports = {
  createProduct, getProduct,
  getProducts, updateProduct,
  deleteProduct, ratings,
  uploadImagesProduct
}