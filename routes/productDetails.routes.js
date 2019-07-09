'use strict'

const express = require('express');
const router = express.Router();
const productDetailsController = require('../app/api/controllers/productDetails.controller');

router.get('/', productDetailsController.findAll)
router.get('/:id', productDetailsController.findById)
router.post('/', productDetailsController.create)
router.patch('/:id', productDetailsController.update)
router.delete('/:id', productDetailsController.delete)

module.exports = router