const generateToken = require("../config/generateToken.js");
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

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const { firstName, lastName, email, _id, mobile } = findUser;
    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user: {
        _id,
        firstName,
        lastName,
        email,
        mobile,
        token: generateToken(_id),
      },
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

module.exports = { createUser, loginUser };
