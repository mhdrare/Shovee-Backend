'use strict'

const express = require('express');
const router = express.Router();
const userDetailsController = require('../app/api/controllers/userDetails.controllers');

// middleware
const auth = require('../app/api/middleware/auth')

router.get('/details', auth, userDetailsController.find)
router.patch('/details', auth, userDetailsController.setUserDetail)

module.exports = router