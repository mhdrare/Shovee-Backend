const mongoose = require('mongoose')

const CheckoutModel = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    }],
    totalItem: {
        type: Number,
        default: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Wishlists', CheckoutModel)