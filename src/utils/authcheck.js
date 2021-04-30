const jwt = require("jsonwebtoken");
const { secretKey } = require("../../config");
const { AuthenticationError } = require("apollo-server");
const checkAuth = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, secretKey);
        return user;
      } catch (err) {
        throw new AuthenticationError("invalid token");
      }
    }
    throw new AuthenticationError(
      "The token has be in the format Bearer token"
    );
  }
  throw new AuthenticationError("Authorization header not provided");
};

module.exports = checkAuth;
