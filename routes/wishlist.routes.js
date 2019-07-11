'use strict'

const express = require('express');
const router = express.Router();
const wishlistController = require('../app/api/controllers/wishlist.controller');
const {multerUploads} = require('../app/api/middleware/multer.middleware')

// middleware
const auth = require('../app/api/middleware/auth')

router.get('/:id', wishlistController.findAllUserWishlist)
router.post('/', auth, wishlistController.create)
router.delete('/:id', auth, wishlistController.delete)

module.exports = router