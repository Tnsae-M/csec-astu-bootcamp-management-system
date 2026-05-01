const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isServerError = statusCode >= 500;

  if (isServerError) {
    console.error(err.stack);
  }

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Server error",
    error: {
      statusCode,
      details: err.details || null,
    },
  });
};

export default errorMiddleware;