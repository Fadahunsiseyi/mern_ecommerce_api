
const express = require('express');
const { createUser, loginUser, getAllUser, getAUser, deleteAUser, updateAUser } = require('../controllers/authController');
const router = express.Router();


router.post('/register',createUser)
router.post('/login',loginUser)
router.get('/allUser',getAllUser)
router.get('/:id',getAUser)
router.delete('/:id',deleteAUser)
router.put('/:id',updateAUser)



module.exports = router;