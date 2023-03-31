const router = require('express').Router()
const { verifyAccessToken, isAdmin } = require("../middleware/checkToken")
const ctrls = require('../controllers/order')

router.post("/", [verifyAccessToken], ctrls.createOrder)
router.put("/status/:oid", [verifyAccessToken, isAdmin], ctrls.updatedStatus)
router.get("/", [verifyAccessToken], ctrls.getUserOrder)
router.get("/admin", [verifyAccessToken, isAdmin], ctrls.getOrders)



module.exports = router