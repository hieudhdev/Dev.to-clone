'use strict'

const express = require('express')
const router = express.Router()

const apiErrorHandler = require('../utils/apiErrorHandler')
const userController = require('../controllers/user.controller')
const fileUpload = require('../middlewares/fileUpload')

// router
router.get('/:userId', apiErrorHandler(userController.getUserById))
router.post('/signup', fileUpload.single('avatar'), apiErrorHandler(userController.signUp))
router.post('/login', apiErrorHandler(userController.login))
router.patch('/update/:userId', fileUpload.single('avatar'), apiErrorHandler(userController.update))
router.post('/followUser', apiErrorHandler(userController.followUser))
router.post('/unFollowUser', apiErrorHandler(userController.unFollowUser))

module.exports = router