'use strict'

const { Types } = require('mongoose')

const ConvertToObjectId = (id) => {
    return new Types.ObjectId(id)
}   

module.exports = {
    ConvertToObjectId
}