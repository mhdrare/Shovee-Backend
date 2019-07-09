'use strict'

const express = require('express');
const router = express.Router();
const categoriesController = require('../app/api/controllers/categories.controller');

router.get('/', categoriesController.findAll)
router.get('/:id', categoriesController.findById)
router.post('/', categoriesController.create)
router.patch('/:id', categoriesController.update)
router.delete('/:id', categoriesController.delete)

module.exports = router