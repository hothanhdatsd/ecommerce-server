const router = require('express').Router()
const { verifyAccessToken, isAdmin } = require("../middleware/checkToken")
const ctrls = require('../controllers/coupon')

router.post("/", [verifyAccessToken, isAdmin], ctrls.createCoupon)
router.get("/", ctrls.getCoupons)
router.put("/:cid", [verifyAccessToken, isAdmin], ctrls.updateCoupon)
router.delete("/:cid", [verifyAccessToken, isAdmin], ctrls.deleteCoupon)




module.exports = router