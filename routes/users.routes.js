'use strict'

const express = require('express')
const router = express.Router()
const userController = require('../app/api/controllers/users.controllers')

router.post('/register', userController.create);
router.post('/authenticate', userController.auth);

module.exports = router