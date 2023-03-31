const Coupon = require("../models/coupon")
const asyncHandle = require("express-async-handler")

const createCoupon = asyncHandle(async (req, res) => {
  const { name, discount, expiry } = req.body
  if (!name || !discount || !expiry) {
    throw new Error("Missing input")
  }
  const response = await Coupon.create(
    { name, discount, expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000 }
  );
  return res.status(200).json({
    success: response ? true : false,
    response
  })
})

const getCoupons = asyncHandle(async (req, res) => {
  const response = await Coupon.find().select("-createdAt -updatedAt")
  return res.status(200).json({
    success: response ? true : false,
    response
  })
})


const updateCoupon = asyncHandle(async (req, res) => {
  const { cid } = req.params
  if (Object.keys(req.body).length === 0) {
    throw new Error("Missing input")
  }
  if (req.body.expiry) {
    req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000
  }
  const updatedCategory = await Coupon.findByIdAndUpdate(cid, req.body, { new: true })
  return res.status(200).json({
    success: updatedCategory ? true : false,
    updatedCategory
  })
})

const deleteCoupon = asyncHandle(async (req, res) => {
  const { cid } = req.params
  const deletedCategory = await Coupon.findByIdAndRemove(cid)
  return res.status(200).json({
    success: deletedCategory ? true : false,
  })
})


module.exports = {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon
}