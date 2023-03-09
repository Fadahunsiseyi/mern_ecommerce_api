const generateToken = require("../config/generateToken.js");
const User = require("../models/UserModel.js");
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken')
const validateId = require("../utils/validateMongodbId.js");
const generateRefreshToken = require("../config/refreshToken.js");

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
    const { id } = findUser;
    const refreshToken = await generateRefreshToken(id);
    await User.findByIdAndUpdate(
      id,
      {
        refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
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


const handleRefreshToken = asyncHandler( async (req,res) =>{
  const {refreshToken} = req.cookies
  if(!refreshToken) throw new Error("No refresh token found in cookies");
  const user = await User.findOne({refreshToken});
  if(!user) throw new Error("No refresh token found in the database")
  jwt.verify(refreshToken,process.env.JWT,(err,decoded) =>{
    if(err || user.id !== decoded.id){
      throw new Error('There is something wrong with the refresh token')
    }else {
      const accessToken = generateToken(decoded.id)
      res.json({accessToken})
    }
  })
})

const updateAUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    validateId(id);
    const { firstName, lastName, email, mobile } = req.body;
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        mobile,
      },
      {
        new: true,
      }
    );
    res.json({ updateUser });
  } catch (error) {
    throw new Error(error);
  }
});


const logout = asyncHandler(async (req, res) => {
  const cookie = req.refreshToken
  const user = await User.findOne(cookie)
  if(!user){
    throw new Error('User not found')
  }else{
    await User.findOneAndUpdate(cookie,{
      "refreshToken": ''
    })
    res.clearCookie("refreshToken",{
      httpOnly: true,
      secure:true
    })
    res.status(200).json({success: true})
  }
})

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json({ users: allUsers });
  } catch (error) {
    throw new Error(error);
  }
});

const getAUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const getUser = await User.findById(id);
    res.json({ usersss: getUser });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({ deleteUser });
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = async (req, res) => {
  const { id } = req.user;
  validateId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({ message: "User has been blocked", user: block });
  } catch (error) {
    throw new Error(error);
  }
};
const unblockUser = async (req, res) => {
  const { id } = req.user;
  validateId(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({ message: "User has been unblocked", user: unblock });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUser,
  getAUser,
  deleteAUser,
  updateAUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout
};
