const Product = require("../models/productModel.js");
const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const slugify = require("slugify");
const validateId = require('../utils/validateMongodbId.js');
const cloudinaryUploadImage = require("../utils/cloudinary.js");
const fs = require("fs");



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

const rating = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (prod) => prod.postedBy.toString() === id.toString()
    );
    if (alreadyRated) {
      await Product.updateOne(
        { ratings: { $elemMatch: alreadyRated } },
        { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
        { new: true }
      );
    } else {
      await Product.findByIdAndUpdate(
        prodId,
        { $push: { ratings: { star: star, postedBy: id, comment: comment } } },
        { new: true }
      );
    }
    const singleProduct = await Product.findById(prodId);
    const totalRating = singleProduct.ratings.length;
    const sumRating = singleProduct.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    const averageRating = Math.round(sumRating / totalRating);
    const finalProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: averageRating,
      },
      { new: true }
    );
    res.json({ finalProduct });
  } catch (error) {
    throw new Error(error);
  }
});


const uploadImages = asyncHandler(async (req, res) => {
  const {id} = req.params;
  validateId(id)
  try {
    const uploader = (path) => cloudinaryUploadImage(path, "images")
    const url = []
    const {files} = req
    for (const file of files) {
      const {path} = file;
      const newPath = await uploader(path)
      url.push(newPath)
      fs.unlinkSync(path)
    }
    const product = await Product.findByIdAndUpdate(id,{
      images: url.map((file) =>{
        return {
          url: file.url,
        }
      })
    },{new: true})
    res.json(product)
  }
  catch (error){
    throw new Error(error)
  }
})

module.exports = {
  createProduct,
  getAProduct,
  getAllProducts,
  updateAProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImages
};
