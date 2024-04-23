'use strict'

const userService = require('../services/user.service')
const HttpError = require('../core/error.response')

class UserController {

    signUp = async (req, res, next) => {
        const metadata = await userService.signUp(req)
        if (!metadata) throw new HttpError('User signup failed', 500)
        res.status(200).json(metadata)
    }

    login = async (req, res, next) => {
        const metadata = await userService.login(req.body)
        if (!metadata) throw new HttpError('User login failed', 500)

        res.status(200).json(metadata)
    }

    update = async (req, res, next) => {
        const metadata = await userService.updateUser(req)
        if (!metadata) throw new HttpError('Update user failed', 500)

        res.status(200).json(metadata)
    }

    followUser = async (req, res, next) => {
        const metadata = await userService.followUser(req.body)
        if (!metadata) throw new HttpError('Follow user failed', 500)

        res.status(200).json(metadata)
    }

    unFollowUser = async (req, res, next) => {
        const metadata = await userService.unFollowUser(req.body)
        if (!metadata) throw new HttpError('UnFollow user failed', 500)

        res.status(200).json(metadata)
    }

    getUserById = async (req, res, next) => {
        const metadata = await userService.getUserById(req.params.userId)
        if (!metadata) throw new HttpError('Get user failed', 500)

        res.status(200).json(metadata)
    }

}

module.exports = new UserController()