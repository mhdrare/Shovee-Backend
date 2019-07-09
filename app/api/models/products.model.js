'use strict'

const mongoose = require('mongoose')

const ProductModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    sold: {
        type: Number,
        required: false,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Products', ProductModel)