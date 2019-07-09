const { userModel, validateUser } = require('../models/users.models')
const bcrypt 	= require('bcrypt')
const jwt 		= require('jsonwebtoken')
const Joi 		= require('@hapi/joi')
const _ 		= require('lodash')

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
					data: _.pick(dataRegister, ['_id', 'name', 'email', 'username', 'phone'])
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

	// First Validate The HTTP Request
    const { error } = validateLogin(req.body);
    if (error) {
        return res.status(400).json({
        	status: 'failed',
        	message: error.details[0].message
        });
    }

    //  Now find the user by their email address
    let user = await userModel.findOne({ email: req.body.user })
    if (!user) {
        user = await userModel.findOne({ username: req.body.user })
	    if (!user) {
	     	user = await userModel.findOne({ phone: req.body.user })
		    if (!user) {
		     	return res.status(400).json({
        			status: 'failed',
        			message: 'User not found.'
        		}); 
		    } 
	    }
    }

    // validate password
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) {
    	return res.status(400).json({
        	status: 'failed',
        	message: 'Wrong password.'
        });
    }

    const token = jwt.sign({ _id: user._id }, 'PrivateKey')

    res.json({
    	status: 'success',
    	data: _.pick(user, ['_id', 'name', 'email', 'username', 'phone']),
    	token: token
    })

} 

// validate login
function validateLogin(req) {
    const schema = {
        user: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(req, schema);
}