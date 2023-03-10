const Product = require("../models/productModel.js");
const asyncHandler = require("express-async-handler");
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
    const products = await Product.find();
    res.json({ products });
  } catch (error) {
    throw new Error(error);
  }
});

const updateAProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if(req.body.title) req.body.slug = slugify(req.body.title)
    const findProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});



module.exports = { createProduct, getAProduct, getAllProducts, updateAProduct,deleteProduct };
