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

const updateAUser = async (req, res) => {
  try {
    const {id} = req.params;
    const {firstName, lastName, email, mobile} = req.body;
    const updateUser = await User.findByIdAndUpdate(id,{
      firstName,
      lastName,
      email,
      mobile
    },{
      new: true,
    })
    res.json({updateUser})
  } catch (error) {
    throw new Error(error)
  }
}

const getAllUser = asyncHandler(async (req,res) => {
  try {
    const allUsers = await User.find()
    res.json({users: allUsers})
  } catch (error) {
    throw new Error(error)
  }
})




module.exports = { createUser, loginUser, getAllUser,getAUser,deleteAUser, updateAUser };
