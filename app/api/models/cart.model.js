const mongoose = require('mongoose')

const CartModel = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Products'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Carts', CartModel)