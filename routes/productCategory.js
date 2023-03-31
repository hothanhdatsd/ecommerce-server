const router = require("express").Router();
const { verifyAccessToken, isAdmin } = require("../middleware/checkToken")
const ctrls = require("../controllers/productCategory")

router.post("/", [verifyAccessToken, isAdmin], ctrls.createProductCategory)
router.get("/", ctrls.getProductCategories)
router.put("/:pcid", [verifyAccessToken, isAdmin], ctrls.updateCategory)
router.delete("/:pcid", [verifyAccessToken, isAdmin], ctrls.deleteCategory)



module.exports = router;