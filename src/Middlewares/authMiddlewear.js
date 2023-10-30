import jwt from "jsonwebtoken";
import * as response from "../Utils/responses.js";

// Middleware to verify authentication token
const authVerify = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return response.errResponse(
      res,
      401,
      "Authentication failed: No token provided."
    );
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = verified._id; // Attach the user object to the request for later use
    next();
  } catch (err) {
    return response.errResponse(res, 401, "Authentication failed: Invalid token.");
  }
};

// Middleware to check for authentication and return user object
export const authCheck = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return false;

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return verified._id;
  } catch (err) {
    return false;
  }
};

export default authVerify;
