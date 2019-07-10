const userDetailModel = require('../models/userDetails.models')
const {_doMultipleUpload} = require('../middleware/upload.middleware')

exports.find = async (req, res) => {
	let user = req.user

	await userDetailModel.findOne({user}).populate('user')
	.then(data => {
		res.json(data)
	})
	.catch(err => {
		return res.status(500).json({
	        status: 500,
            message: err.message || 'some error'
	    })
	})
}

exports.setUserDetail = async (req, res) => {
	let user = req.user
	let images

	// res.json(req.body);
	if(req.files) {
        images = await _doMultipleUpload(req)
        console.log('iyes')
    	req.body.image_profil = images[0];
    }


	await userDetailModel.findOneAndUpdate({user}, req.body)
	.then(data => {
		userDetailModel.findOne({_id: data._id})
		.populate('user', '-password')
		.then(dataUpdate => {
			res.json({
				status: 'success',
				data: dataUpdate
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