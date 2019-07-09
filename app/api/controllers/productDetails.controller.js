'use strict'

const productDetailsModel = require('../models/productDetails.model')

exports.findAll = async (req, res) => {
    await productDetailsModel.find().populate({
        path : 'product',
        populate : {
          path : 'category'
        }
      })
            .sort({updatedAt: 'desc'})
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
    await productDetailsModel.findById(req.params.id)
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
    const { product, description, stok, brand } = req.body

    if (!product || !description || !stok || !brand) {
        return res.status(400).json({
            status: 400,
            message: "product, description, stok, brand cannot be null"
        })
    }

    await productDetailsModel.create({product, description, stok, brand})
            .then(data => {
                productDetailsModel.findById(data._id).populate('product')
                    .then(createdData => (
                        res.json({
                            status: 200,
                            data: createdData
                        })
                    ))
            })
            .catch(err => (
                res.status(500).json({
                    status: 500,
                    message: err.message || 'same error'
                })
            ))
}

exports.update = async (req, res) => {
    const { description, stok, brand } = req.body

    await productDetailsModel.findByIdAndUpdate(req.params.id, {description, stok, brand}, {new: true})
            .then(data => {
                if (!data) {
                    return res.status(404).json({
                        status: 404,
                        message: `Product details not found with id = ${req.params.id}`
                    }) 
                }

                productDetailsModel.findById(data._id)
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
                        message: `Product details not found with id = ${req.params.id}`
                    }) 
                }

                res.status(500).json({
                    status: 500,
                    message: err.message || 'same error'
                })
            })
}

exports.delete = async (req, res) => {
    await productDetailsModel.findByIdAndDelete(req.params.id)
            .then(data => {
                if (!data) {
                    return res.status(404).json({
                        status: 404,
                        message: `Product details not found with id = ${req.params.id}`
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
                        message: `Product details not found with id = ${req.params.id}`
                    })
                }

                res.status(500).json({
                    status: 500,
                    message: err.message || 'same error'
                })
            })
}