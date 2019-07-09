'use strict'

const productsModel = require('../models/products.model')

exports.findAll = async (req, res) => {
    await productsModel.find().populate('category')
            .sort({updatedAt: 'desc'})
            .then(data => (
                res.json(data)
            ))
            .catch(err => {
                console.log(`error: ${err}`)
            })
}

exports.create = async (req, res) => {
    const { name, price, thumbnail, category } = req.body

    await productsModel.create({name, price, thumbnail, category}, (err, result) => {
        if (err) {
            console.log(`error: ${err}`)
        } else {
            res.json(result)
        }
    })
}