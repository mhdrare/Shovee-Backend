'use strict'
const multer = require('multer')
const DataUri = require('datauri')
const path = require('path')

const storage = multer.memoryStorage()

const multerUploads = multer({ storage }).single('image')
const dUri = new DataUri()

const dataUri = req => (
    dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer)
)

exports.multerUploads = multerUploads
exports.dataUri = dataUri