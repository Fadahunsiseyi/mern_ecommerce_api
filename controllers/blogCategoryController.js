const BlogCategory = require('../models/blogCategoryModel');
const asyncHandler = require('express-async-handler');
const validateId = require('../utils/validateMongodbId.js');

const blogCreateCategory = asyncHandler(async (req, res) => {
    try {
        const category = await BlogCategory.create(req.body);
        res.status(200).json(category);
    } catch (error) {
        throw new Error(error);
    }
});


const blogUpdateCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateId(id);
    try {
        const updatedCategory = await BlogCategory.findByIdAndUpdate(id, req.body, {new:true});
        res.status(200).json(updatedCategory);
    } catch (error) {
        throw new Error(error);
    }
});


const blogDeleteCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateId(id);
    try {
        const deletedCategory = await BlogCategory.findByIdAndDelete(id);
        res.status(200).json(deletedCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const blogGetCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateId(id);
    try {
        const category = await BlogCategory.findById(id);
        res.status(200).json(category);
    } catch (error) {
        throw new Error(error);
    }
});

const blogGetAllCategory = asyncHandler(async (req, res) => {
    try {
        const categories = await BlogCategory.find();
        res.status(200).json(categories);
    } catch (error) {
        throw new Error(error);
    }
});



module.exports = {blogCreateCategory, blogUpdateCategory,blogDeleteCategory, blogGetCategory, blogGetAllCategory}