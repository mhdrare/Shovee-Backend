'use strict'

const express = require('express');
const router = express.Router();
const productsController = require('../app/api/controllers/products.controller');

// middleware
const auth = require('../app/api/middleware/auth')

router.get('/', productsController.findAll)
router.get('/:id', productsController.findById)
router.post('/', auth, productsController.create)
router.patch('/:id', auth, productsController.update)
router.delete('/:id', auth, productsController.delete)

module.exports = router