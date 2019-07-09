'use strict'

const productsModel = require('../models/products.model')

exports.findAll = async (req, res) => {
    await productsModel.find().populate('category')
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
    await productsModel.findById(req.params.id)
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
    const { name, price, thumbnail, category, city } = req.body

    if (!name || !price || !thumbnail || !category || !city) {
        return res.status(400).json({
            status: 400,
            message: "name, price, thumbnail, category cannot be null"
        })
    }

    await productsModel.create({name, price, thumbnail, category, city})
            .then(data => {
                productsModel.findById(data._id).populate('category')
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
    const { name, price, thumbnail } = req.body

    if (!name || !price || thumbnail) {
        return res.status(400).json({
            status: 400,
            message: "name, price, thumbnail, category cannot be null"
        })
    }

    await productsModel.findByIdAndUpdate(req.params.id, {name, price, thumbnail}, {new: true})
            .then(data => {
                if (!data) {
                    return res.status(404).json({
                        status: 404,
                        message: `Product not found with id = ${req.params.id}`
                    }) 
                }

                productsModel.findById(data._id)
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
                        message: `Product not found with id = ${req.params.id}`
                    }) 
                }

                res.status(500).json({
                    status: 500,
                    message: err.message || 'same error'
                })
            })
}

exports.delete = async (req, res) => {
    await productsModel.findByIdAndDelete(req.params.id)
            .then(data => {
                if (!data) {
                    return res.status(404).json({
                        status: 404,
                        message: `Product not found with id = ${req.params.id}`
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
                        message: `Product not found with id = ${req.params.id}`
                    })
                }

                res.status(500).json({
                    status: 500,
                    message: err.message || 'same error'
                })
            })
}