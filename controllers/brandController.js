const Brand = require('../models/BrandModel');
const asyncHandler = require('express-async-handler');
const validateId = require('../utils/validateMongodbId.js');

const createBrand = asyncHandler(async (req, res) => {
    try {
        const category = await Brand.create(req.body);
        res.status(200).json(category);
    } catch (error) {
        throw new Error(error);
    }
});


const updateBrand = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateId(id);
    try {
        const updatedCategory = await Brand.findByIdAndUpdate(id, req.body, {new:true});
        res.status(200).json(updatedCategory);
    } catch (error) {
        throw new Error(error);
    }
});


const deleteBrand = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateId(id);
    try {
        const deletedCategory = await Brand.findByIdAndDelete(id);
        res.status(200).json(deletedCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const getBrand = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateId(id);
    try {
        const category = await Brand.findById(id);
        res.status(200).json(category);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllBrand = asyncHandler(async (req, res) => {
    try {
        const categories = await Brand.find();
        res.status(200).json(categories);
    } catch (error) {
        throw new Error(error);
    }
});



module.exports = {createBrand, updateBrand,deleteBrand, getBrand, getAllBrand}