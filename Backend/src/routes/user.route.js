'use strict'

const express = require('express')
const router = express.Router()
const apiErrorHandler = require('../utils/apiErrorHandler')

const userController = require('../controllers/user.controller')

// router
router.post('/signup', apiErrorHandler(userController.signUp))
router.post('/login', apiErrorHandler(userController.login))
router.post('/update/:userId', apiErrorHandler(userController.update))
router.post('/followUser', apiErrorHandler(userController.followUser))
router.post('/unFollowUser', apiErrorHandler(userController.unFollowUser))

module.exports = router