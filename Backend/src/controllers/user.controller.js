'use strict'

const userService = require('../services/user.service')
const HttpError = require('../core/error.response')

class UserController {

    signUp = async (req, res, next) => {
        const metadata = await userService.signUp(req.body)
        if (!metadata) throw new HttpError('User signup failed', 500)

        res.status(200).json(metadata)
    }

    login = async (req, res, next) => {
        const metadata = await userService.login(req.body)
        if (!metadata) throw new HttpError('User login failed', 500)

        res.status(200).json(metadata)
    }

}

module.exports = new UserController()