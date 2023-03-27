const Product = require("../models/productModel.js");
const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json({ newProduct });
  } catch (error) {
    throw new Error(error);
  }
});

const getAProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json({ findProduct });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedField = ["page", "sort", "limit", "fields"];
    excludedField.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));

    //Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //Limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //Pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const next = (page - 1) * limit;
    query = query.skip(next).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      console.log(productCount);
      if (next >= productCount) throw new Error("This page does not exist");
    }

    const products = await query;
    res.json({ products });
  } catch (error) {
    throw new Error(error);
  }
});

const updateAProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) req.body.slug = slugify(req.body.title);
    const findProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

const addToWishlist = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { postId } = req.body;
  try {
    const user = await User.findById(id);
    const userExist = user.wishlist.find((item) => item.toString() == postId);
    if (userExist) {
      let user = await User.findByIdAndUpdate(
        id,
        {
          $pull: { wishlist: postId },
        },
        { new: true }
      );
      res.json({ user });
    } else {
      let user = await User.findByIdAndUpdate(
        id,
        {
          $push: { wishlist: postId },
        },
        { new: true }
      );
      res.json({ user });
    }
  } catch (error) {
    throw new Error(error);
  }
});



module.exports = {
  createProduct,
  getAProduct,
  getAllProducts,
  updateAProduct,
  deleteProduct,
  addToWishlist,
  rating,
};
