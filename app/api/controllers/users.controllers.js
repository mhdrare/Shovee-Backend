const userModel = require('../models/users.models')
const bcrypt 	= require('bcrypt')
const jwt 		= require('jsonwebtoken')


// register user
exports.create = async (req, res, next) => {

	if(
		!req.body.name || 
		!req.body.email || 
		!req.body.username || 
		!req.body.phone || 
		!req.body.password){

		return res.status(400).json({
            status: 400,
            message: 'name, email, username, phone and password not be empty'
        })

	}

	const users = new userModel({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		phone: req.body.phone,
		password: req.body.password
	})

	await users.save()
	.then(data => {
		userModel.findById(data._id)
		.then(dataRegister => {
			res.json({
				status: 'success',
				message: "User added successfully",
				data: dataRegister
			})
		})
	})
	.catch(err => {
		return res.status(500).json({
            status: 500,
            message: err.message || 'same error'
        })
	})
}

//login user
exports.auth = async (req, res, next) => {

	

} 