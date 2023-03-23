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
} = require("../controllers/authController");
const { authMiddleware, isAdmin } = require("../middleswares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post('/forgot-password',forgotPasswordToken)
router.put('/reset-password/:token',resetPassword)
router.put('/password', authMiddleware, updatePassword)


router.get("/allUser", getAllUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout",authMiddleware,logout);
router.get("/:id", authMiddleware, isAdmin, getAUser);

router.put("/edit-user", authMiddleware, updateAUser);
router.put("/block-user/:id", authMiddleware,isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware,isAdmin, unblockUser);

router.delete("/:id", deleteAUser);

module.exports = router;
