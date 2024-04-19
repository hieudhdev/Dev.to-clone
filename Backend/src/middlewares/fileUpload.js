'use strict'

const multer = require('multer')

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const fileUpload = multer({
    limits: 1000000,                    // limit of memory
    storage: multer.memoryStorage(),    // storage file in buffer
    fileFilter: (req, file, cb) => {    // file filter
        const isValid = !!MIME_TYPE_MAP[file.mimetype]    
        let error = isValid ? null : new Error(`Invalid file's type!`)
        cb(error, isValid)
    }
})

module.exports = fileUpload