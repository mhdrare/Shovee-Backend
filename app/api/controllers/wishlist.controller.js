'use strict'

const wishlistModel = require('../models/wishlist.model')

exports.findAllUserWishlist = async (req, res) => {
    await wishlistModel.find({
        user: req.param.id
    }).populate('user').populate('product').populate('seller')
            .then(data => (
                res.json({
                    status: 200,
                    data
                })
            ))
            .catch(err => {
                return res.status(500).json({
                    status: 500,
                    message: err.message || 'same error'
                })
            })
}

exports.create = async (req, res) => {
    const { product } = req.body
    const user = req.user._id
    if (!user || !product) {
        return res.status(400).json({
            status: 400,
            message: 'product is required'
        })
    }

    await wishlistModel.create({ user, product })
            .then(data => {
                wishlistModel.findById(data._id).populate('user').populate('product')
                    .then(createdData => (
                        res.json({
                            status: 200,
                            data: createdData
                        })
                    ))
            })
            .catch(err => {
                return res.status(500).json({
                    status: 500,
                    message: err.message || 'same error'
                })
            })
}

exports.update = async (req, res) => {

    await wishlistModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(data => {
                if (!data) {
                    return res.status(404).json({
                        status: 404,
                        message: `Transaction not found with id = ${req.params.id}`
                    }) 
                }

                wishlistModel.findById(data._id)
                    .then(updatedData => (
                        res.json({
                            status: 200,
                            data: updatedData
                        })
                    ))
            })
            .catch(err => {
                if(err.kind === 'ObjectId') {
                    return res.status(404).json({
                        status: 404,
                        message: `Transaction not found with id = ${req.params.id}`,
                        data: []
                    }) 
                }

                res.status(500).json({
                    status: 500,
                    message: err.message || 'same error'
                })
            })
}
