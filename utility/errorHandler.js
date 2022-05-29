// Handle errors appropriately
exports.errorResponse = (res, message, statusCode = 500, moreInfo = {}) => {
  return res.status(statusCode).json({
    error: {
      statusCode,
      message,
      moreInfo
    },
  });
};
