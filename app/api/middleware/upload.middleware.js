const { dataUri } = require('./multer.middleware')
const { uploader } = require('../../../config/cloudinary.config')

_doMultipleUpload = async (req) => {
    if (req.files) {
        const data = []

        for(let i=0;i< req.files.length;i++) {
            const file = dataUri(req.files[i]).content
            await uploader.upload(file, (result) => {data.push(result.url)})
            
        }

        return data
        
    }
}

module.exports = {_doMultipleUpload}