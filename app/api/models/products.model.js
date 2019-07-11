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
    },
    city: {
        type: String,
        required: true
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
    },
    condition: {
        type: String,
        enum: ['Baru', 'Bekas'],
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetails'
    },
    images: {
        type: Array,
        requied: true
    },
    favorites: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Products', ProductModel)