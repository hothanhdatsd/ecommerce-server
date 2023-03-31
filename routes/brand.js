const router = require('express').Router()
const { verifyAccessToken, isAdmin } = require("../middleware/checkToken")
const ctrls = require('../controllers/brand')

router.post("/", [verifyAccessToken, isAdmin], ctrls.createBrand)
router.get("/", ctrls.getBrands)
router.put("/:brid", [verifyAccessToken, isAdmin], ctrls.updateBrand)
router.delete("/:brid", [verifyAccessToken, isAdmin], ctrls.deleteBrand)




module.exports = router