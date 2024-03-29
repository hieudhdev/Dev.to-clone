const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

const PORT = process.env.DEV_APP_PORT || 4080

// Init middlewares
app.use(bodyParser.json())

// Connect databases
require('./src/databases/init.mongodb.js')

// Init router
app.use('', require('./src/routes/index.js'))

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