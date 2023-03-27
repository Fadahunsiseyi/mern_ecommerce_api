const express = require('express');
const { createCoupon, getAllCoupon, updateCoupon, deleteCoupon } = require('../controllers/couponController');
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middleswares/authMiddleware");



router.post('/', authMiddleware, isAdmin, createCoupon)
router.get('/', authMiddleware, isAdmin, getAllCoupon)
router.put('/:id', authMiddleware, isAdmin, updateCoupon)
router.delete('/:id', authMiddleware, isAdmin, deleteCoupon)




module.exports = router;