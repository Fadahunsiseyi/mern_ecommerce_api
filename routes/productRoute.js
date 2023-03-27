
const express = require('express');
const { createProduct, getAProduct, getAllProducts, updateAProduct, deleteProduct, addToWishlist, rating } = require('../controllers/productController');
const router = express.Router()
const {isAdmin,authMiddleware} = require('../middleswares/authMiddleware')

router.post('/',authMiddleware,isAdmin,createProduct)

router.get('/:id',getAProduct)
router.get('/',getAllProducts)

router.put('/wishlist', authMiddleware, addToWishlist);
router.put('/rating', authMiddleware, rating);

router.put('/:id',authMiddleware,isAdmin,updateAProduct)

router.delete('/:id',authMiddleware,isAdmin,deleteProduct)



module.exports = router