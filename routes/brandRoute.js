const express = require('express');
const { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand } = require('../controllers/brandController');
const { authMiddleware, isAdmin } = require('../middleswares/authMiddleware');
const router = express.Router();

router.get('/',getAllBrand)
router.post('/', authMiddleware, isAdmin, createBrand)
router.get('/:id',getBrand)
router.put('/:id', authMiddleware, isAdmin, updateBrand)
router.delete('/:id', authMiddleware, isAdmin, deleteBrand)



module.exports = router;