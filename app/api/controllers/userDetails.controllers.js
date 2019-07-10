const userDetailModel = require('../models/userDetails.models')

exports.find = async (req, res) => {
	let user = req.user

	await userDetailModel.findOne({user}).populate('user')
	.then(data => {
		res.json(data)
	})
}

exports.setUserDetail = async (req, res) => {
	let user = req.user

	// res.json(req.body);
	await userDetailModel.findOneAndUpdate({user}, req.body)
	.then(data => {
		
		userDetailModel.findOne({_id: data._id})
		.populate('user', '-password')
		.then(dataUpdate => {
			res.json(dataUpdate)
		})

	})
}