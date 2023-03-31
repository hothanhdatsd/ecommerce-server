const Order = require("../models/order")
const User = require("../models/user")
const Coupon = require("../models/coupon")
const asyncHandle = require("express-async-handler")

const createOrder = asyncHandle(async (req, res) => {
  const { _id } = req.user
  const { coupon } = req.body
  const userCart = await User.findById(_id).select("cart").populate("cart.product", "title price")
  const products = userCart?.cart?.map(el => (
    {
      product: el.product._id,
      count: el.quantity,
      color: el.color
    }
  ))
  let total = userCart?.cart?.reduce((sum, el) => el.product.price * el.quantity + sum, 0)
  const createdData = { products, total, orderBy: _id }
  if (coupon) {
    const selectedCoupon = await Coupon.findById(coupon)
    total = Math.round(total * (1 - (selectedCoupon?.discount / 100)) / 1000) * 1000 || total
    createdData.total = total
    createdData.coupon = coupon
  }
  const rs = await Order.create(createdData)
  return res.json(
    { success: rs ? rs : false }
  )
})



const updatedStatus = asyncHandle(async (req, res) => {
  const { oid } = req.params
  const { status } = req.body
  if (!status) {
    throw new Error("Missing input")
  }
  const rs = await Order.findByIdAndUpdate(oid, { status }, { new: true })
  return res.json(
    { success: rs ? true : false }
  )
})


const getUserOrder = asyncHandle(async (req, res) => {
  const { _id } = req.user

  const rs = await Order.find({ orderBy: _id })
  return res.json(
    { success: rs ? rs : false }
  )
})

const getOrders = asyncHandle(async (req, res) => {
  const rs = await Order.find()
  return res.json(
    { success: rs ? rs : false }
  )
})


module.exports = {
  createOrder,
  updatedStatus,
  getUserOrder,
  getOrders
}