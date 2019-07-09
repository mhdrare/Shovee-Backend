'use strict'

const express = require('express');
const router = express.Router();
const productsController = require('../app/api/controllers/products.controller');

router.get('/', productsController.findAll)
router.get('/:id', productsController.findById)
router.post('/', productsController.create)
router.patch('/:id', productsController.update)
router.delete('/:id', productsController.delete)

module.exports = router