const express = require("express");
const {
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
  updateOrderStatus,
} = require("../controllers/authController");
const { authMiddleware, isAdmin } = require("../middleswares/authMiddleware");
const { updateOne } = require("../models/UserModel");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post('/forgot-password',forgotPasswordToken)
router.post('/login-admin',loginAdmin)
router.put('/reset-password/:token',resetPassword)
router.put('/password', authMiddleware, updatePassword)
router.post('/cart',authMiddleware,  userCart)
router.post('/cart/applycoupon',authMiddleware, applyCoupon)
router.post('/cart/cash-order',authMiddleware, createOrder)


router.get("/allUser", getAllUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout",authMiddleware,logout);
router.get('/getwishlist',authMiddleware,getWishlist)
router.get('/getcart',authMiddleware,getUserCart)
router.delete('/empty-cart',authMiddleware,emptyCart)
router.get('/get-orders',authMiddleware,getOrders)
router.get("/:id", authMiddleware, isAdmin, getAUser);

router.put("/edit-user", authMiddleware, updateAUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put('/order/update-order/:id',authMiddleware,isAdmin,updateOrderStatus)
router.put("/block-user/:id", authMiddleware,isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware,isAdmin, unblockUser);

router.delete("/:id", deleteAUser);

module.exports = router;
