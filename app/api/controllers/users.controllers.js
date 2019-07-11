const { userModel, validateUser } = require('../models/users.models')
const userDetailModel = require('../models/userDetails.models')
const bcrypt 	= require('bcrypt')
const Joi 		= require('@hapi/joi')
const _ 		= require('lodash')

const jwt           = require('jsonwebtoken')
const config        = require('config')

const crypto    = require('crypto')
const nodemailer = require('nodemailer')

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
	    user = new userModel({
			email: req.body.email,
			username: req.body.username,
			phone: req.body.phone,
			password: req.body.password
		})

		await user.save()
		.then(data => {
			userModel.findById(data._id)
			.then(dataRegister => {

				// const token = jwt.sign({ _id: users._id }, config.get('PrivateKey'))
				const token = user.generateAuthToken()

                let address = {
                    provinsi: '',
                    kab: '',
                    kec: '',
                    alamat_lengkap: '',
                    pos: ''
                }

                const userDetail = new userDetailModel({
                    user: dataRegister._id,
                    name: '',
                    gender: 'L',
                    tanggal_lahir: '',
                    image_profil: '',
                    alamat: address
                })

                userDetail.save()

				res.json({
					status: 'success',
					message: "User added successfully",
					data: _.pick(dataRegister, ['_id', 'email', 'username', 'phone']),
                    token: token
				})
			})
		})
		.catch(err => {
			return res.status(500).json({
	            status: 500,
	            message: err.message || 'some error'
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

    // const token = jwt.sign({ _id: user._id }, config.get('PrivateKey'))
    const token = user.generateAuthToken()

    res.json({
    	status: 'success',
    	data: _.pick(user, ['_id', 'email', 'username', 'phone']),
    	token: token
    })

} 

exports.forgetPassword = async (req, res) => {
    if (!req.body.email) {
        return res.status(400).json({
            status: 400,
            message: "email cannot be null"
        })
    }

    let user = await userModel.findOne({ email: req.body.email })
    
    
        if(!user){
            return res.status(404).json({
                status: 'failed',
                message: 'user not found'
            })
        }

        const tokenResetPassword = jwt.sign({email: req.body.email}, config.get('PrivateKey'))
        
        const serviceEmail  = process.env.EMAIL_ADDRESS || 'clone.shovee@gmail.com';
        const servicePass   = process.env.EMAIL_PASSWORD || 'shovee12345!@#$%';
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: serviceEmail,
                pass: servicePass
            }
        })

        let linkResetPassword = req.protocol + '://' + req.get('host') + '/resetpassword?tokenResetPassword=' + tokenResetPassword;

        const templateEmail = {
            form: `${serviceEmail}`,
            to: `${req.body.email}`,
            subject: `Atur Ulang Password Shopee Kamu`,
            html: 
                `<p>Halo ${user.username}</p>
                <p>Kami telah menerima permintaan untuk atur ulang password. </p>
                <br>
                <p>Untuk mengatur ulang, silahkan <a href='${linkResetPassword}'>klik di sini</a> atau salin alamat di bawah ini di browser kamu.
                <br>${linkResetPassword}</p>`
        }

        transporter.sendMail(templateEmail, (err, response) => {
            if(err){
                console.error(err);
            }
            else{
                console.log(response);
                res.json({
                    status: 'success',
                    tokenResetPassword
                })
            }
        })

}

exports.changePassword = async (req, res) => {

    let user = await userModel.findById(req.user)

    if(!req.body.old_password || !req.body.new_password || !req.body.new_password_confirmation){
        return res.status(400).json({
            status: 'failed',
            message: 'not null'
        })
    }

    // validate password
    const validPassword = await bcrypt.compare(req.body.old_password, user.password)

    if(!validPassword) {
        return res.status(400).json({
            status: 'failed',
            message: 'Wrong password.'
        });
    }

    // const token = jwt.sign({ _id: user._id }, config.get('PrivateKey'))
    if(req.body.new_password != req.body.new_password_confirmation){
        return res.status(400).json({
            status: 'failed',
            message: 'not same'
        })
    }

    req.body.new_password = bcrypt.hashSync(req.body.new_password, saltRounds)
    await userModel.findOneAndUpdate({_id: req.user}, {password: req.body.new_password})
    .then(data=>{
        userModel.findOne({_id: req.user})
        .then(dataUpdate => {
            const token = user.generateAuthToken()
            res.json({
                status: 'success',
                data: dataUpdate,
                token: token
            })
        })
    })
    .catch(err=>{
        return res.status(500).json({
            status: 'failed',
            message: err.message
        })
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
