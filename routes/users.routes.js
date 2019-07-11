'use strict'

const express = require('express')
const router = express.Router()
const userController = require('../app/api/controllers/users.controllers')

// middleware
const auth = require('../app/api/middleware/auth')

router.post('/register', userController.create)
router.post('/authenticate', userController.auth)
router.post('/forgetpassword', userController.forgetPassword)
router.patch('/changepassword', auth, userController.changePassword)

module.exports = router