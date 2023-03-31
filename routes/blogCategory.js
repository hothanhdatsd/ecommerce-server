const router = require("express").Router();
const { verifyAccessToken, isAdmin } = require("../middleware/checkToken")
const ctrls = require("../controllers/blogCategory")

router.post("/", [verifyAccessToken, isAdmin], ctrls.createBlogCategory)
router.get("/", ctrls.getBlogCategories)
router.put("/:bcid", [verifyAccessToken, isAdmin], ctrls.updateBlogCategory)
router.delete("/:bcid", [verifyAccessToken, isAdmin], ctrls.deleteBlogCategory)



module.exports = router;