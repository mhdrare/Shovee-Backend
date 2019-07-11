'use strict'

const cartModel = require('../models/cart.model')

exports.findAllUserCart = async (req, res) => {
    await cartModel.find({
        user: req.user._id
    }).populate({path:'user', select: ['_id']}).populate('product')
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

    await cartModel.create({ user, product })
            .then(data => {
                cartModel.findById(data._id).populate('user').populate('product')
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

exports.delete = async (req, res) => {
    await cartModel.findByIdAndDelete(req.params.id)
            .then(data => {
                if (!data) {
                    return res.status(404).json({
                        status: 404,
                        message: `cart not found with id = ${req.params.id}`
                    }) 
                }

                res.json({
                    status: 200,
                    _id: req.params.id
                })
            })
            .catch(err => {
                if(err.kind === 'ObjectId') {
                    res.status(404).json({
                        status: 404,
                        message: `cart not found with id = ${req.params.id}`
                    })
                }

                res.status(500).json({
                    status: 500,
                    message: err.message || 'same error'
                })
            })
}