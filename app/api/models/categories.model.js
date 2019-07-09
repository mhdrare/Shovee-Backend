'use strict'

const mongoose = require('mongoose')

const CategoryModel = new mongoose.Schema({
    name: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Categories', CategoryModel)