const isJsonSyntaxError = (error) => {
  return (
    error instanceof SyntaxError &&
    error.status === 400 &&
    error.type === "entity.parse.failed"
  );
};

export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    message: "API endpoint not found.",
    success: false,
  });
};

export const errorHandler = (error, req, res, next) => {
  console.error("API error:", {
    method: req.method,
    path: req.originalUrl,
    message: error?.message,
    name: error?.name,
    code: error?.code,
  });

  if (res.headersSent) {
    return next(error);
  }

  // Malformed JSON request body.
  if (isJsonSyntaxError(error)) {
    return res.status(400).json({
      message: "Invalid JSON request body.",
      success: false,
    });
  }

  // Multer upload errors.
  if (error?.name === "MulterError") {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Uploaded file must not exceed 5 MB.",
        success: false,
      });
    }

    return res.status(400).json({
      message: "Invalid file upload.",
      success: false,
    });
  }

  // Custom upload validation errors.
  if (error?.code === "INVALID_FILE_TYPE") {
    return res.status(400).json({
      message: error.message,
      success: false,
    });
  }

  // CORS rejection.
  if (error?.code === "CORS_NOT_ALLOWED") {
    return res.status(403).json({
      message: "Origin is not allowed.",
      success: false,
    });
  }

  // Mongoose validation errors.
  if (error?.name === "ValidationError") {
    return res.status(400).json({
      message: "Request contains invalid data.",
      success: false,
    });
  }

  // Mongoose malformed ObjectId errors.
  if (error?.name === "CastError") {
    return res.status(400).json({
      message: "Invalid resource identifier.",
      success: false,
    });
  }

  // Duplicate MongoDB key.
  if (error?.code === 11000) {
    return res.status(409).json({
      message: "A resource with the same unique value already exists.",
      success: false,
    });
  }

  const statusCode =
    Number.isInteger(error?.statusCode) &&
    error.statusCode >= 400 &&
    error.statusCode < 600
      ? error.statusCode
      : 500;

  const message =
    statusCode >= 500
      ? "Internal server error."
      : error.message || "Request failed.";

  return res.status(statusCode).json({
    message,
    success: false,
  });
};
