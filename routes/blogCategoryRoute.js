const express = require('express');
const { blogCreateCategory, blogUpdateCategory, blogDeleteCategory, blogGetCategory, blogGetAllCategory } = require('../controllers/blogCategoryController');
const { authMiddleware, isAdmin } = require('../middleswares/authMiddleware');
const router = express.Router();

router.get('/',blogGetAllCategory)
router.post('/', authMiddleware, isAdmin, blogCreateCategory)
router.get('/:id',blogGetCategory)
router.put('/:id', authMiddleware, isAdmin, blogUpdateCategory)
router.delete('/:id', authMiddleware, isAdmin, blogDeleteCategory)



module.exports = router;