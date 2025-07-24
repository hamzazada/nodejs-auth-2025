const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("auth middleware is called");
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const Token = authHeader && authHeader.split(" ")[1];
  if (!Token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided",
    });
  }
  // decode this token
  try {
    const decodedToken = jwt.verify(Token, process.env.JWT_SECRET_KEY);
    console.log(decodedToken);
    req.userInfo = decodedToken;
    next();
  } catch (e) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided",
    });
  }
};
module.exports = authMiddleware;
