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

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const findBlog = await Blog.findById(id).populate('likes').populate('disLikes')
    await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      {
        new: true,
      }
    );
    res.status(200).json(findBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlog = asyncHandler(async (req, res) => {
  try {
    const getAll = await Blog.find();
    res.status(200).json(getAll);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const updateBlog = await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog deleted successfully", updateBlog });
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
