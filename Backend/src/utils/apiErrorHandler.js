'use strict'

// handle error api middleware
const apiErrorHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

module.exports = apiErrorHandler