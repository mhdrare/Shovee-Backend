'use strict'

const mongoose = require('mongoose')

const ProductDetailModel = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    },
    description: {
        type: String,
        required: false,
    },
    stok: {
        type: Number,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('ProductDetails', ProductDetailModel)