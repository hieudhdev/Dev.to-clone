'use strict'

const User = require('../models/user.model')
const HttpError = require('../core/error.response')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { JWT_KEY } = process.env

class UserService {

    static async signUp (payload) {
        // check payload ?????

        const { name, email, password } = payload

        // check email (user) exist
        const foundUser = await User.findOne({ email: email })
        if (foundUser) throw new HttpError('Email registered', 400)

        // hash password
        const passHashed = await bcrypt.hash(password, 12)
        const imgUrl = 'unkhown'    // NOTE: ??????

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

}

module.exports = UserService