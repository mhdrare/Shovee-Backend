'use strict'

const categoriesModel = require('../models/categories.model')

exports.create = async (req, res) => {
    const { name } = req.body

    await categoriesModel.create({name}, (err, result) => {
        if (err) {
            console.log(`error: ${err}`)
        } else {
            res.json(result)
        }
    })
}

exports.findAll = async (req, res) => {
    await categoriesModel.find({}, (err, result) => {
        if (err) {
            console.log(`error: ${err}`)
        } else {
            res.json(result)
        }
    })
}