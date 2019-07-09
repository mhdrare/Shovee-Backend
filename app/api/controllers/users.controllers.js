const { userModel, validateUser } = require('../models/users.models')
const bcrypt 	= require('bcrypt')
const jwt 		= require('jsonwebtoken')


// register user
exports.create = async (req, res, next) => {

	// First Validate The Request
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).json({
        	status: 'failed',
        	message: `${error.details[0].message}`
        })
    }

    // Check if this user already exisits
    let user = await userModel.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({
        	status: 'failed',
        	message: 'That user already exisits!'
        });
    } else {
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
}

//login user
exports.auth = async (req, res, next) => {



} 