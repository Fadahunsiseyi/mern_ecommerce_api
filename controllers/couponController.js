const Coupon = require('../models/couponModel');
const validateId = require('../utils/validateMongodbId');
const asyncHandler = require('express-async-handler');

const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json({newCoupon});
    } catch (error) {
        throw new Error(error);
    }
});

const getAllCoupon = asyncHandler(async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json({coupons});
    } catch (error) {
        throw new Error(error);
    }
});

const updateCoupon = asyncHandler(async (req, res) => {
    try {
        const {id} = req.params;
        validateId(id);
        const coupon = await Coupon.findByIdAndUpdate(id, req.body, {new:true});
        res.json({coupon});
    } catch (error) {
        throw new Error(error);
    }
});

const deleteCoupon = asyncHandler(async (req, res) => {
    try {
        const {id} = req.params;
        validateId(id);
        const coupon = await Coupon.findByIdAndDelete(id);
        res.json({coupon});
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {createCoupon, getAllCoupon, updateCoupon , deleteCoupon }