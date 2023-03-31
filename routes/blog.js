const router = require('express').Router()
const { verifyAccessToken, isAdmin } = require("../middleware/checkToken")
const ctrls = require('../controllers/blog')
const multer = require('multer');
const upload = multer({ dest: 'uploads' });


router.post("/", [verifyAccessToken, isAdmin], ctrls.createBlog)
router.get("/", ctrls.getAllBlog)
router.get("/one/:bid", ctrls.getBlog)
router.put("/uploadimage/:bid", [verifyAccessToken, isAdmin, upload.single("file")], ctrls.uploadImageBlog)
router.put("/like/:bid", verifyAccessToken, ctrls.likeBlog)
router.put("/dislike/:bid", verifyAccessToken, ctrls.disLikeBlog)
router.put("/:bid", [verifyAccessToken, isAdmin], ctrls.updateBlog)
router.delete("/:bid", ctrls.deleteBlog)


module.exports = router