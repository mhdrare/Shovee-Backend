'use strict'

const express = require('express');
const router = express.Router();
const checkoutController = require('../app/api/controllers/checkout.controller');
// middleware
const auth = require('../app/api/middleware/auth')

router.get('/:id',auth, checkoutController.findAllUserTransaction)
router.get('/:id',auth, checkoutController.findById)
router.post('/',auth, checkoutController.create)
router.patch('/:id',auth, checkoutController.update)

module.exports = router