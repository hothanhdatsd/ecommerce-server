const router = require("express").Router();
const { verifyAccessToken, isAdmin } = require("../middleware/checkToken")
const ctrls = require("../controllers/product")
const uploader = require("../config/cloudinary.config")
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });






router.post("/", [verifyAccessToken, isAdmin], ctrls.createProduct)
router.get("/", ctrls.getProducts)
router.put("/ratings", verifyAccessToken, ctrls.ratings)


router.put('/uploadimage/:pid', [verifyAccessToken, isAdmin, upload.array('file', 10)], ctrls.uploadImagesProduct);


router.delete("/:pid", [verifyAccessToken, isAdmin], ctrls.deleteProduct)
router.put("/:pid", [verifyAccessToken, isAdmin], ctrls.updateProduct)
router.get("/:pid", ctrls.getProduct)



module.exports = router;