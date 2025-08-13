const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function getRegisterController(req, res) {
    res.render("register")
} 

async function postRegisterController(req, res) {
    const {username, email, password} = req.body;

    const isUserExist = await userModel.findOne({
        $or:[
            {username: username},
            {email: email}
        ]
    })

    if(isUserExist){
        return res.redirect('/auth/login')
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username: username,
        email: email,
        password: hashPassword
    })

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

    res.cookie('token', token)

    return res.redirect('/')
} 

async function getLoginController(req, res) {
    res.render('login')
}

async function postLoginController(req, res) {
    const { identifier, username, password} = req.body

    // console.log(identifier, username, password);
    const user = await userModel.findOne({
        $or:[
            {email: identifier},
            {username: identifier}
        ]
    })

    if(!user){
        return res.redirect('/login?error=User not found')
    }

    const isPasswordVaild = await bcrypt.compare(password, user.password)
    if(!isPasswordVaild){
        return res.redirect('/login?error= Invalid password')
    }

    const token =jwt.sign({id: user._id}, process.env.JWT_SECRET)

    res.cookie('token', token)
    return res.redirect('/')
}

async function userLogout(req, res) {
    res.clearCookie('token')
    
    return res.redirect('/auth/login')
}

module.exports = {
    getRegisterController,
    postRegisterController,
    getLoginController,
    postLoginController,
    userLogout
}