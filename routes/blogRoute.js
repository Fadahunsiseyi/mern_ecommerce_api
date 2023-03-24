const express = require("express");
const { authMiddleware, isAdmin } = require("../middleswares/authMiddleware");
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlog,
  deleteBlog,
  likeBlog,
  disLikeBlog,
} = require("../controllers/blogController");
const router = express.Router();

router.put("/likes", authMiddleware, likeBlog);
router.put("/dislikes", authMiddleware, disLikeBlog);
router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id", getBlog);
router.get("/", getAllBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router;
