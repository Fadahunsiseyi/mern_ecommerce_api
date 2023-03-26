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






module.exports = {createBrand, updateBrand,deleteBrand, getBrand, getAllBrand}