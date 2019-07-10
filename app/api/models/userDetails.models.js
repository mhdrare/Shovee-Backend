'use strict'

const mongoose = require('mongoose')

const UserDetailModel = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: 'String',
        trim: true,
    },
    gender: {
        type: String,
        enum : ['L', 'P']
    },
    tanggal_lahir: {
        type: String
    },
    image_profil: {
        type: String
    },
    alamat: {
        provinsi: {
            type: String
        },
        kab: {
            type: String
        },
        kec: {
            type: String
        },
        alamat_lengkap: {
            type: String
        },
        pos: {
            type: String
        }
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('UserDetails', UserDetailModel)