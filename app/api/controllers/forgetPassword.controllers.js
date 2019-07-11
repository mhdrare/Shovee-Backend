const { userModel } = require('../models/users.models')

const jwt           = require('jsonwebtoken')
const config        = require('config')

const bcrypt 		= require('bcrypt')
const saltRounds 	= 10

exports.resetpassword = async (req, res, next) => {

	let token = req.query.tokenResetPassword;
	if(!token){
		res.send(`<p>Access Denied</p>`)
	}

	try {
        let email = jwt.decode(token, config.get('PrivateKey')).email;
        
        res.send(
			`<form action="/resetpassword" method="POST">
	        	<input type="hidden" name="token" value="${token}" />
	        	<input type="teaxt" name="email" value="${email}" disabled />
	        	<input type="password" name="password" value="" placeholder="New password..." required />
	        	<input type="password" name="password2" value="" placeholder="Confirm new password..." required />
	        	<input type="submit" value="Reset Password" />
	    	</form>`);

    }
    catch (err) {
        // res.status(400).json({
        //     status: 'failed',
        //     message: 'Invalid Link.'
        // });
        res.send(`<p>Invalid token reset password</p>`)
    }
}

exports.resetpasswordProccess = async (req, res, next) => {

	let token = req.body.token;
	if(!token){
		res.send(`<p>Access Denied</p>`)
	}

	try {
        let email = jwt.decode(token, config.get('PrivateKey')).email;

        if(req.body.password != req.body.password2){
        	let linkback = req.protocol + '://' + req.get('host') + '/resetpassword?tokenResetPassword=' + token;
        	return res.send(`
        		<p>Failed reset password</p>
        		<p><a href="${linkback}">Back</a></p>
        	`)
        }

        req.body.password = bcrypt.hashSync(req.body.password, saltRounds)
        
        await userModel.findOneAndUpdate({email}, {password: req.body.password})
		.then(data => {
			
			res.send(
				`success update password user ${email}`
			);

		})
		.catch(err => {
			return res.status(500).json({
		        status: 500,
	            message: err.message || 'some error'
		    })
		})

    }
    catch (err) {
        // res.status(400).json({
        //     status: 'failed',
        //     message: 'Invalid Link.'
        // });
        res.send(`<p>Invalid token reset password</p>`)
    }

}