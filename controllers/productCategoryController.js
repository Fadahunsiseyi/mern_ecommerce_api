const ProductCategory = require('../models/ProductCategoryModel');
const asyncHandler = require('express-async-handler');
const validateId = require('../utils/validateMongodbId.js');

const productCreateCategory = asyncHandler(async (req, res) => {
    try {
        const category = await ProductCategory.create(req.body);
        res.status(200).json(category);
    } catch (error) {
        throw new Error(error);
    }
});


const productUpdateCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateId(id);
    try {
        const updatedCategory = await ProductCategory.findByIdAndUpdate(id, req.body, {new:true});
        res.status(200).json(updatedCategory);
    } catch (error) {
        throw new Error(error);
    }
});


const productDeleteCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateId(id);
    try {
        const deletedCategory = await ProductCategory.findByIdAndDelete(id);
        res.status(200).json(deletedCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const productGetCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateId(id);
    try {
        const category = await ProductCategory.findById(id);
        res.status(200).json(category);
    } catch (error) {
        throw new Error(error);
    }
});

const productGetAllCategory = asyncHandler(async (req, res) => {
    try {
        const categories = await ProductCategory.find();
        res.status(200).json(categories);
    } catch (error) {
        throw new Error(error);
    }
});



module.exports = {productCreateCategory, productUpdateCategory,productDeleteCategory, productGetCategory, productGetAllCategory}