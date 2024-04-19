'use strict'

const User = require('../models/user.model')
const HttpError = require('../core/error.response')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator');
const { ConvertToObjectId, uploadToCloudinary } = require('../utils/index')
const NotificationService = require('../services/notification.service')

const defaultAvatar = 'https://res.cloudinary.com/dzu5qbyzq/image/upload/v1713546846/devto/DENO_jx87zz.jpg'
const { JWT_KEY } = process.env

class UserService {

    // NOT DONE
    static async getUserById (userId) {
        const foundUser = await User.findById(userId, '-password')
        .populate({     // getter
            path: 'post',
            populate: {
                path: 'tags'
            }
        })
        .populate({     // getter
            path: 'followedTags'
        })

        if (!foundUser) throw new HttpError('User not found', 404)

        return {
            user: foundUser.toObject({ getters: true }) // same as .lean() but included any getter defined in foundUser
        }
    }

    static async signUp (req) {
        // check payload
        const error = validationResult(req)
        if (!error.isEmpty()) throw new HttpError('Invalid inputs passed, please check your data', 422)

        const { name, email, password } = JSON.parse(req.body.userInfo)

        // check email (user) exist
        const foundUser = await User.findOne({ email: email })
        if (foundUser) throw new HttpError('Email registered', 400)
               
        // hash password
        const passHashed = await bcrypt.hash(password, 12)

        // upload image to cloud
        const imgUrl = await uploadToCloudinary(req.file) || defaultAvatar
        if (req.file || !imgUrl) throw new HttpError ('Upload avatar fail')

        // save user
        const newUser = await User.create({ 
            name: name,
            email: email,
            password: passHashed,
            avatar: imgUrl
        })
        if (!newUser) throw new HttpError('Signup failed', 500)

        /* JWT with Asyncmmetrical : Genarate publicKey and privateKey
            + privateKey for jwt.sign, and then remove from server
            + publicKey is stored in the db, and used for jwt.verify 
        */
        // JWT with Syncmmetrical : Use a common SecretKey for sign and verify
        /*  
            In this project, for simplicity, i use Syncmmetrical JWT methods
            and SecretKey will be stored in .ENV
        */

        // genarate a token 
        const token = await jwt.sign({
            userId: newUser._id,
            email: newUser.email
        }, JWT_KEY, 
        {
            expiresIn: '1h'
        })

        return {
            code: 200,
            newUser,
            token
        }
    }

    static async login (payload) {
        // check payload ???

        const { email, password } = payload

        // check email (user)
        const foundUser = await User.findOne({ email: email }).lean()   // FIND WITH FOLLOWING TAG
        if (!foundUser) throw new HttpError('Email not registed!', 404)
        console.log(foundUser)        
        // check password
        const isValidPasss = await bcrypt.compare(password, foundUser.password)
        if (!isValidPasss) throw new HttpError('Password is not correct!', 500)

        //gen a token
        const token = await jwt.sign({
            userId: foundUser._id,
            email: foundUser.email
        }, JWT_KEY, {
            expiresIn: '1h'
        })

        return {
            code: 200,
            foundUser,
            token
        }
    }

    static async updateUser (params, payload) {
        // check payload

        const userId = params.userId
        
        // upload avatar (file)
        const imgUrl = 'not build yet'
        const bodyUpdate = { ...payload, avatar: imgUrl }

        const updateUser = await User.findByIdAndUpdate( ConvertToObjectId(userId), bodyUpdate, { new: true })
        if (!updateUser) throw new HttpError('User update failed!', 500)

        return updateUser
    }

    static async followUser (payload) {
        const { userId, followId } = payload

        // Transaction require -> Not build yet because i'm lazy
        const userUpdate = await User.findByIdAndUpdate(
            ConvertToObjectId(userId),
            { $addToSet: { following: followId }}, 
            { new: true }
        )

        const followerUpdate = await User.findByIdAndUpdate(
            ConvertToObjectId(followId),
            { $addToSet: { followers: userId} }, 
            { new: true }
        )

        if (!userUpdate || !followerUpdate) throw new Error('Follow user fail, Pls Rollback DB!')
        
        // Push noti
        const notiPush = await NotificationService.followNotification({ userId, followId })
        if (!notiPush) throw new Error('Notification push fail!')

        return userUpdate
    }

    static async unFollowUser (payload) {
        const { userId, unFollowId } = payload

        // Transaction require -> Not build yet because i'm lazy
        const userUpdate = await User.findByIdAndUpdate(
            ConvertToObjectId(userId),
            { $pull: { following: unFollowId }}, 
            { new: true }
        )

        const unFollowerUpdate = await User.findByIdAndUpdate(
            ConvertToObjectId(unFollowId),
            { $pull: { followers: userId} }, 
            { new: true }
        )

        if (!userUpdate || !unFollowerUpdate) throw new Error('Unfollow user fail, Pls Rollback DB!')

        return userUpdate
    }

}

module.exports = UserService