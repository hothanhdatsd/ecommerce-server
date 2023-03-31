const userRouter = require("./user");
const productRouter = require('./product')
const productCategoryRouter = require('./productCategory')
const categoryBlogRouter = require("./blogCategory")
const blogRouter = require("./blog")
const brandRouter = require("./brand")
const couponRouter = require("./coupon")
const orderRouter = require("./order")
const { notFound, errorHandler } = require("../middleware/errorHandler");

const initRoutes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/productcategory", productCategoryRouter);
  app.use("/api/blogcategory", categoryBlogRouter);
  app.use("/api/blog", blogRouter);
  app.use("/api/brand", brandRouter);
  app.use("/api/coupon", couponRouter);
  app.use("/api/order", orderRouter);

  app.use(notFound);
  app.use(errorHandler);
};

module.exports = initRoutes;
