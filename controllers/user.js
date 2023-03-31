const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/jwt");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken")
const sendMail = require("../utils/sendMail")
const crypto = require("crypto")

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    return res
      .status(400)
      .json({ success: false, message: "invalid", email, password, name });
  }
  const user = await User.findOne({ email: email });
  if (user) {
    throw new Error("User has exitsed");
  }
  const response = await User.create(req.body);
  return res.status(200).json({ success: response ? true : false, response });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.isCorrectPassword(password))) {
    const { password, role, refreshToken, ...userData } = user.toObject();
    const accessToken = generateAccessToken(user._id, role);
    const newRefreshToken = generateRefreshToken(user._id);
    await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken }, { new: true });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ success: true, userData, accessToken });
  } else {
    throw new Error("Invalid credential!");
  }
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-refreshToken -role -password');
  console.log(user);
  if (user) {
    res.status(200).json({ user, success: true });
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (cookie && cookie.refreshToken) {
    jwt.verify(cookie.refreshToken, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        throw new Error("Invalid refresh token")
      }
      const response = await User.findOne({ _id: decode._id, refresh_token: cookie.refresh_token })
      res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : "Refresh token invalid"
      })


    })
  } else {
    throw new Error("No refresh token in cookie");
  }
})

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken) {
    throw new Error("No refresh token in cookie");
  }
  await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: "" }, { new: true })
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true
  });
  return res.status(200).json({ success: true, message: "Logout is done" })
})

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) {
    throw new Error("Missng email")
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error("User not found")
  }
  const resetToken = user.createPasswordChangedToken()
  await user.save();
  const html = `nhap vao link de thay doi mat khau cua ban <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click he<a/>`
  const data = {
    email,
    html
  }
  const rs = await sendMail(data)
  return res.status(200).json({ success: true, rs })
})

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) {
    console.log(password, token);
  }
  const passwordResetToken = crypto.createHash("sha256").update(token).digest("hex")
  const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
  if (!user) {
    throw new Error("User is invalid")
  }
  user.password = password;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  user.passwordChangeAt = Date.now()
  await user.save()
  return res.status(200).json({ success: user ? true : false, message: user ? "user updated password" : "something went wrong" })

})


const getAllUsers = asyncHandler(async (req, res) => {
  const response = await User.find().select("-password -role -refreshtoken");
  return res.status(200).json({ success: response ? true : false, users: response });
})


const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) {
    throw new Error("Missing input")
  }
  const user = await User.findByIdAndDelete(_id)
  return res.status(200).json({ success: user ? true : false, deletedUser: user ? "Deleted user is done" : "Deleted user wrong" });
})


const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length == 0) {
    throw new Error("Missing input")
  }

  const user = await User.findByIdAndUpdate(_id, req.body, { new: true }).select("-password -role ")
  return res.status(200).json({ success: user ? true : false, updatedUser: user ? "Updated user is done" : "Updated user wrong", updateUser });
})


const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (!uid || Object.keys(req.body).length == 0) {
    throw new Error("Missing input")
  }
  const user = await User.findByIdAndUpdate(uid, req.body, { new: true }).select("-password -role ")
  return res.status(200).json({ success: user ? true : false, updatedUser: user ? "Updated user is done" : "Updated user wrong", user });
})


const updatedAressUser = asyncHandler(async (req, res) => {
  const { _id } = req.user
  if (!req.body.address) throw new Error("Missing input")
  const user = await User.findByIdAndUpdate(_id, { $push: { address: req.body.address } }, { new: true }).select("-password -role ")
  return res.status(200).json({ success: user ? true : false, updatedUser: user ? "Updated user is done" : "Updated user wrong", user });
})

const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user
  const { pid, quantity, color } = req.body
  if (!pid || !quantity || !color) throw new Error("Missing input")
  const user = await User.findById(_id).select("cart")
  const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid)
  console.log(alreadyProduct);
  if (alreadyProduct) {
    if (alreadyProduct.color === color) {
      const response = await User.updateOne({ cart: { $elemMatch: alreadyProduct } }, { $inc: { "cart.$.quantity": quantity } }, { upsert: true })
      return res.status(200).json({ success: response ? true : false, updatedUser: response ? "Updated user is done" : "Updated user wrong", response });

    } else {
      const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, color, quantity } } }, { new: true })
      return res.status(200).json({ success: response ? true : false, updatedUser: response ? "Updated user is done" : "Updated user wrong", response });
    }
  } else {
    const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, color, quantity } } }, { new: true })
    return res.status(200).json({ success: response ? true : false, updatedUser: response ? "Updated user is done" : "Updated user wrong", response });
  }
})



module.exports = {
  register, login, getUser,
  refreshAccessToken, logout,
  forgotPassword, resetPassword,
  getAllUsers, deleteUser,
  updateUser, updateUserByAdmin,
  updatedAressUser, updateCart
};
