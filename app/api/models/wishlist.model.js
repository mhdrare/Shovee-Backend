const mongoose = require('mongoose')

const WishlistModel = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'Users'
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Products'
    }
})

module.exports = mongoose.model('Wishlists', WishlistModel)