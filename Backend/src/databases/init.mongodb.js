'use strict'

const mongoose = require('mongoose')
const url = `mongodb+srv://danghieuyt2:${process.env.DB_PASSWORD}@cluster0.ihjwuhx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

class Database {

    constructor () {
        this.connect()
    }

    connect (type = 'mongodb') {
        // Set log query db in dev invironment
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }

        // Connect mongodb
        mongoose.connect(url)
        .then(() => console.log('Connect database successfully! (SINGLETON PATTERN)'))
        .catch(err => console.log('Error connect!'))
    }

    // SingleTon pattern
    static getInstance() {
        if(!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }

}

const intanceMongodb = Database.getInstance()
module.exports = intanceMongodb