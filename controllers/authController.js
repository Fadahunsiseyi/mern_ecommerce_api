const generateToken = require("../config/generateToken.js");
const User = require("../models/UserModel.js");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const validateId = require("../utils/validateMongodbId.js");
const generateRefreshToken = require("../config/refreshToken.js");
const sendEmail = require("./emailController.js");
const crypto = require("crypto");
const Cart = require("../models/cartModel.js");
const Product = require("../models/productModel.js");
const Coupon = require("../models/couponModel.js");
const Order = require("../models/orderModel.js");
const { v4: uuidv4 } = require('uuid');

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

//Admin Login

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not authorized");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const { id } = findAdmin;
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
    const { firstName, lastName, email, _id, mobile } = findAdmin;
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

const handleRefreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new Error("No refresh token found in cookies");
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No refresh token found in the database");
  jwt.verify(refreshToken, process.env.JWT, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with the refresh token");
    } else {
      const accessToken = generateToken(decoded.id);
      res.json({ accessToken });
    }
  });
});

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

const saveAddress = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateId(id);
  try {
    const { id } = req.user;
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        address: req?.body?.address,
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

const logout = asyncHandler(async (req, res) => {
  const cookie = req.refreshToken;
  const user = await User.findOne(cookie);
  if (!user) {
    throw new Error("User not found");
  } else {
    await User.findOneAndUpdate(cookie, {
      refreshToken: "",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({ success: true });
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

const updatePassword = async (req, res) => {
  const { id } = req.user;
  validateId(id);
  const { password } = req.body;
  try {
    const user = await User.findById(id);
    user.resetPasswordToken();
    if (password) {
      user.password = password;
      const updatedPaassword = await user.save();
      res.json({ updatedPaassword });
    } else {
      res.json({ user });
    }
  } catch (error) {
    throw new Error("Invalid Id", error);
  }
};

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  try {
    const token = await user.resetPasswordToken(); //da78
    await user.save();
    const resetUrl = `Please follow this link to reset your password  <a href="http://localhost:4000/api/user/reset-password/${token}" >Click here</a> `;
    const data = {
      to: email,
      text: "Hello user",
      subject: "Forgot password link",
      html: resetUrl,
    };
    sendEmail(data);
    res.json({ token });
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token expired, try again");
  user.password = password;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();
  res.status(200).json({ user });
});

const getWishlist = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const findUser = await User.findById(id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { id } = req.user;
  validateId(id);
  try {
    const products = [];
    const user = await User.findById(id);
    const alreadyExistCart = await Cart.findOne({ orderBy: user._id });
    if (alreadyExistCart) alreadyExistCart.remove();
    for (let i = 0; i < cart.length; i++) {
      const obj = {};
      obj.product = cart[i].id;
      obj.count = cart[i].count;
      obj.color = cart[i].color;
      let getPrice = await Product.findById(cart[i].id).select("price").exec();
      obj.price = getPrice.price;
      products.push(obj);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderBy: user?.id,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateId(id);
  try {
    const cart = await Cart.findOne({ orderBy: id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateId(id);
  try {
    const user = await User.findById(id);
    const cart = await Cart.findOneAndDelete({ orderBy: user.id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { id } = req.user;
  validateId(id);
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) throw new Error("Invalid Coupon");
  const user = await User.findById(id);
  const { cartTotal } = await Cart.findOne({ orderBy: user.id }).populate(
    "products.product"
  );
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderBy: user.id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});

const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { id } = req.user;
  validateId(id);
  try {
    if (!COD) throw new Error("Create cash order failed");
    const user = await User.findById(id);
    const userCart = await Cart.findOne({ orderBy: user.id });
    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount * 100;
    } else {
      finalAmount = userCart.cartTotal * 100;
    }
   await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uuidv4(),
        method: "COD",
        amount: finalAmount,
        status: "Cash On Delivery",
        created: Date.now(),
        currency: "usd"
      },
      orderBy: user.id,
      orderStatus: "Cash On Delivery"
    }).save()
    let update = userCart.products.map((item)=>{
      return{
        updateOne: {
          filter: {_id: item.product._id},
          update: {$inc: { quantity: -item.count, sold: +item.count}}
        }
      }
    })
    const updated = await Product.bulkWrite(update, {})
    res.json({message:'Success', updated})
  } catch (error) {
    throw new Error(error);
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateId(id);
  try {
    const userorders = await Order.findOne({orderBy: id}).populate('products.product').exec()
    res.json(userorders)
  } catch (error) {
    throw new Error(error)
  }
})


const updateOrderStatus = asyncHandler(async (req, res) => {
  const {status} = req.body
  const {id} = req.params
  validateId(id)
try {
  const findOrder = await Order.findByIdAndUpdate(id,{
    orderStatus: status,
    paymentIntent: {
      status
    }
  }, {new: true}
  )
  res.json(findOrder)
} catch (error) {
  throw new Error(error)
}
})



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
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus
};
