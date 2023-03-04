const User = require("../models/UserModel.js");
const asyncHandler = require("express-async-handler");

const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    const user = await User.create(req.body);
    res
      .status(201)
      .json({ message: "User created successfully", success: true, user });
  } else {
    throw new Error("User already exists");
  }
});

module.exports = { createUser };
