'use strict'

const checkoutModel = require('../models/checkout.model')
const sendNotification = require('../middleware/sendNotification.lib')

exports.findAllUserTransaction = async (req, res) => {
    console.log(req.params.id)
    await checkoutModel.find({
        user: req.user._id
    }).populate({path:'user', select: ['_id']}).populate('product').populate('seller')
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

exports.findById = async (req, res) => {
    await checkoutModel.findById(req.params.id)
            .then(data => (
                res.json({
                    status: 200,
                    data
                })
            ))
            .catch(err => (     
                res.status(500).json({
                    status: 500,
                    message: err.message || 'same error'
                })
            ))
}

exports.create = async (req, res) => {
    const { product, totalPrice, seller, totalItem } = req.body
    const playerId = req.query.playerId

    console.log(playerId)
    
    const user = req.user._id
    if (!user || !product || !totalPrice || !seller || !totalItem) {
        return res.status(400).json({
            status: 400,
            message: 'product, totalPrice, seller, totalItem is required'
        })
    }

    await checkoutModel.create({ user, product, totalPrice, seller, totalItem })
            .then(data => {
                checkoutModel.findById(data._id).populate({path:'user', select: ['_id']}).populate('product').populate('seller')
                    .then(createdData => (
                        res.json({
                            status: 200,
                            data: createdData
                        })
                    )).then(() => {
                        sendNotification({"en": "Your transaction is processed"}, playerId)
                        console.log('sent')
                    })
            })
            .catch(err => {
                return res.status(500).json({
                    status: 500,
                    message: err.message || 'same error'
                })
            })
}

exports.update = async (req, res) => {

    await checkoutModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(data => {
                if (!data) {
                    return res.status(404).json({
                        status: 404,
                        message: `Transaction not found with id = ${req.params.id}`
                    }) 
                }

                checkoutModel.findById(data._id)
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
