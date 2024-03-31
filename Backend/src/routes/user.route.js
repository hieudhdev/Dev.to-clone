'use strict'

const express = require('express')
const router = express.Router()
const apiErrorHandler = require('../utils/apiErrorHandler')

const userController = require('../controllers/user.controller')

// router
router.post('/signup', apiErrorHandler(userController.signUp))
router.post('/login', apiErrorHandler(userController.login))

module.exports = router