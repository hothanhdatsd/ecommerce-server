const notFound = (req, res) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  res.status(404).send(error);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    success: false,
    message: error?.message,
  });
};
module.exports = { errorHandler, notFound };
