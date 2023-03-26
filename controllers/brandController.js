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





module.exports = {createBrand, updateBrand,deleteBrand, getBrand, getAllBrand}