'use strict'

const express = require('express');
const router = express.Router();
const cartController = require('../app/api/controllers/cart.controller');

// middleware
const auth = require('../app/api/middleware/auth')

router.get('/', auth, cartController.findAllUserCart)
router.post('/', auth, cartController.create)
router.delete('/:id', auth, cartController.delete)

module.exports = router