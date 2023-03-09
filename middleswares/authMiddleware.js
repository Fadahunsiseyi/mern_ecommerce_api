const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization) {
    token = authorization.split(" ")[1];
    try {
      const decode = jwt.verify(token, process.env.JWT);
      const user = await User.findById(decode?.id);
      req.user = user;
      next();
    } catch (error) {
      throw new Error("Not authorized, token expired.Please login");
    }
  } else {
    throw new Error("There is no token attached to the request");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin") {
    throw new Error("You are not an admin");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
