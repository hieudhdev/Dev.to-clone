'use strict'

const { Types } = require('mongoose')
const path = require('path')
const cloudinary = require('../configs/cloudinary.config')
const DatauriParser = require('datauri/parser')
const parser = new DatauriParser()

const ConvertToObjectId = (id) => {
    return new Types.ObjectId(id)
}   

const uploadToCloudinary = async (file) => {
    try {
        const extName = path.extname(file.originalname).toString()
        const file64 = parser.format(extName, file.buffer)

        const uploadResult =  await cloudinary.uploader.upload(file64.content, {
            upload_preset: 'devto'
        })

        return uploadResult.url
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    ConvertToObjectId,
    uploadToCloudinary
}