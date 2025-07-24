const httpResponses = {
  200: "OK",
  201: "Created",
  204: "No Content",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  422: "Unprocessable Entity",
  429: "Too Many Requests",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
};

const sendResponse = (res, statusCode, customMessage = null, data = null) => {
  const message = customMessage || httpResponses[statusCode] || "Unknown Error";
  const success = statusCode >= 200 && statusCode < 400;

  return res.status(statusCode).json({
    success,
    statusCode,
    message,
    data: data || null,
  });
};

module.exports = {
  sendResponse,
  httpResponses,
};
