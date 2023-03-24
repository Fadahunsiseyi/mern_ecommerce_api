const Blog = require("../models/BlogModel");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const validateId = require("../utils/validateMongodbId.js");
const { validate } = require("../models/productModel");

const createBlog = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(200).json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updateBlog);
  } catch (error) {
    throw new Error(error);
  }
});


module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlog,
  deleteBlog,
  likeBlog,
  disLikeBlog,
};
