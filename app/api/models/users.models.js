const mongoose 		= require('mongoose')
const bcrypt 		= require('bcrypt')
const saltRounds 	= 10
const Joi 		 	= require('@hapi/joi')

const jwt			= require('jsonwebtoken')
const config 		= require('config')

//Define a schema
const Schema = mongoose.Schema

const UserSchema = new Schema({
	name: {
		type: 'String',
		trim: true,  
  		required: true,
  		minlength: 5,
        maxlength: 50
	},
 	email: {
  		type: String,
  		trim: true,
  		required: true,
  		minlength: 5,
        maxlength: 255,
        unique: true
 	},
	username: {
		type: String,
		trim: true,
		required: true,
		minlength: 5,
        maxlength: 20,
        unique: true
	},
	phone: {
		type: String,
		trim: true,
		required: true
	},
	password: {
  		type: String,
  		trim: true,
  		required: true,
  		minlength: 6,
        maxlength: 1024
 	}
}, {
    timestamps: true
})

// hash user password before saving into database
UserSchema.pre('save', function(next) {
	this.password = bcrypt.hashSync(this.password, saltRounds)
	next()
});

// method for generate auto token
UserSchema.methods.generateAuthToken = function() {
	const token = jwt.sign({_id: this._id}, config.get('PrivateKey'))
	return token
}

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        username: Joi.string().min(5).max(20).required(),
        phone: Joi.required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        password_confirmation: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } })
    };
    return Joi.validate(user, schema);
}

const Users = mongoose.model('User', UserSchema)

exports.userModel = Users;
exports.validateUser = validateUser
