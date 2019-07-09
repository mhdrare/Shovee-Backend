'use strict'

const categoriesModel = require('../models/categories.model')

exports.findAll = async (req, res) => {
    await categoriesModel.find()
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
    await categoriesModel.findById(req.params.id)
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
    const { name } = req.body

    if (!name) {
        return res.status(400).json({
            status: 400,
            message: 'name is required'
        })
    }

    await categoriesModel.create({name})
            .then(data => {
                categoriesModel.findById(data._id)
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
    const { name } = req.body

    await categoriesModel.findByIdAndUpdate(req.params.id, {name}, {new: true})
            .then(data => {
                if (!data) {
                    return res.status(404).json({
                        status: 404,
                        message: `Category not found with id = ${req.params.id}`
                    }) 
                }

                categoriesModel.findById(data._id)
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
                        message: `Category not found with id = ${req.params.id}`,
                        data: []
                    }) 
                }

                res.status(500).json({
                    status: 500,
                    message: err.message || 'same error'
                })
            })
}

exports.delete = async (req, res) => {
    await categoriesModel.findByIdAndDelete(req.params.id)
            .then(data => {
                if (!data) {
                    return res.status(404).json({
                        status: 404,
                        message: `Category not found with id = ${req.params.id}`
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
                        message: `Category not found with id = ${req.params.id}`
                    })
                }

                res.status(500).json({
                    status: 500,
                    message: err.message || 'same error'
                })
            })
}