require('dotenv').config()
const express = require('express')
const indexRoutes = require('./routes/index.routes')
const authRoutes = require('./routes/auth.routes')
const cookieParser = require('cookie-parser')

const app = express()

app.set("view engine", "ejs")

app.use(express.static('public')) //it shows the css, and js file in browser 

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())

app.use('/', indexRoutes)
app.use('/auth', authRoutes)

module.exports = app