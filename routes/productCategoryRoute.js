const express = require('express');
const { productCreateCategory, productUpdateCategory, productDeleteCategory, productGetCategory, productGetAllCategory } = require('../controllers/productCategoryController');
const { authMiddleware, isAdmin } = require('../middleswares/authMiddleware');
const router = express.Router();

router.get('/',productGetAllCategory)
router.post('/', authMiddleware, isAdmin, productCreateCategory)
router.get('/:id',productGetCategory)
router.put('/:id', authMiddleware, isAdmin, productUpdateCategory)
router.delete('/:id', authMiddleware, isAdmin, productDeleteCategory)



module.exports = router;