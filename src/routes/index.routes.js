const express = require('express')

const route = express.Router()

route.get('/', (req, res)=>{
    console.log("hello world");
    
    return res.status(201).json({
        message: "ho gaya log In"
    })
} )


module.exports = route