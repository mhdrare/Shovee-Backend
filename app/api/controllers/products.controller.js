'use strict'

const productsModel = require('../models/products.model')
const userDetailsModel = require('../models/userDetails.models')
const {_doMultipleUpload} = require('../middleware/upload.middleware')

exports.findAll = async (req, res) => {
    let search = req.query.search ? req.query.search : '' 
    let limit = req.query.limit ? parseInt(req.query.limit) : 10
    let filter = req.query.filter ? req.query.filter : 'updatedAt'
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
            .populate({path: 'category', select: ['name']}).populate({path: 'seller', select: ['name', 'alamat'], populate: {path: 'user', select: ['_id']}})
            .sort({[filter]: sort})
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
    //const seller = req.user._id
    let images
    
    const seller = await userDetailsModel.findOne({user: req.user})
                .then(result => result)
                .catch(err => res.status(500).json({
                    message: err
                }))
    console.log(seller)
    if(req.files.length > 0) {
        images = await _doMultipleUpload(req)
        console.log('iyes')
    } else {
        images = ["https://res.cloudinary.com/sobat-balkon/image/upload/v1562715024/sample.jpg"]
    }

    console.log(images)

    if (!name || !price || !category || !city || !description || !brand || !stok || !seller) {
        return res.status(400).json({
            status: 400,
            message: "name, price, thumbnail, category cannot be null"
        })
    }

    await productsModel.create({name, price, thumbnail: images[0], category, city, description, brand, stok, images, seller: seller._id})
            .then(data => {
                productsModel.findById(data._id).populate({path: 'category', select: ['name']}).populate({path: 'seller', select: ['name'], populate: {path: 'user', select: ['_id']}})
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