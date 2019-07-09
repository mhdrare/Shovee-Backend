'use strict'

const mongoose = require('mongoose')

const ProductDetailModel = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    },
    description: {
        type: Text,
        required: false,
    },
    stok: {
        type: Number,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    specification: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specification',
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('ProductDetails', ProductDetailModel)