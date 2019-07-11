'use strict'

const express = require('express')
const router = express.Router()
const forgetPasswordController = require('../app/api/controllers/forgetPassword.controllers')

const jwt = require('jsonwebtoken');
const config = require('config');

router.get('/resetpassword', forgetPasswordController.resetpassword)

router.post('/resetpassword', forgetPasswordController.resetpasswordProccess)


module.exports = router