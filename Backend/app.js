const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.DEV_APP_PORT || 4080

// Connect databases
require('./src/databases/init.mongodb.js')

app.get('/', (req, res) => {
    res.send('hello')
})

// Error handling
app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,  
        message: error.message || 'Internal Server Error',
        stack: error.stack
    })
})

app.listen(PORT, (req, res) => {
    console.log(`App listen on port ${PORT}!`)
})