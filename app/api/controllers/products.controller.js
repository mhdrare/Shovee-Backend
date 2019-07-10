'use strict'

const productsModel = require('../models/products.model')
const {_doMultipleUpload} = require('../middleware/upload.middleware')

exports.findAll = async (req, res) => {
    let search = req.query.search ? req.query.search : '' 
    let limit = req.query.limit ? parseInt(req.query.limit) : 10
    let page = req.query.page ? parseInt(req.query.page) : 1
    let offset = (page - 1) * limit
    let sort = req.query.sort ? req.query.sort.toLowerCase() : 'desc'
    let totalRows

    await productsModel.countDocuments({
                'name': {$regex: search, $options: 'i'}
            })
            .then(data => totalRows = data)

    let totalPage = Math.ceil(parseInt(totalRows) / limit)

    await productsModel.find({
                'name': {$regex: search, $options: 'i'}
            })
            .populate({path: 'category', select: ['name']})
            .sort({updatedAt: sort})
            .limit(limit)
            .skip(offset)
            .then(data => (
                res.json({
                    status: 200,
                    totalRows,
                    limit,
                    page,
                    totalPage,
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
    const { name, price, category, city, description, brand, stok } = req.body
    let images
    
    if(req.files.length > 0) {
        images = _doMultipleUpload(req)
    } else {
        images = ["https://res.cloudinary.com/sobat-balkon/image/upload/v1562715024/sample.jpg"]
    }

    if (!name || !price || !category || !city || !description || !brand || !stok) {
        return res.status(400).json({
            status: 400,
            message: "name, price, thumbnail, category cannot be null"
        })
    }

    await productsModel.create({name, price, thumbnail: images[0], category, city, description, brand, stok, images})
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

    if (!name || !price || !thumbnail) {
        return res.status(400).json({
            status: 400,
            message: "name, price, thumbnail cannot be null"
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