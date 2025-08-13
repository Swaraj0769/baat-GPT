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
        return res.status(400).json({
            message: "User already exists with this username or email"
        })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username: username,
        email: email,
        password: hashPassword
    })

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

    res.cookie('token', token)

    return res.status(201).json({
        message: "User register successfully", user
    })
} 

async function getLoginController(req, res) {
    res.render('login')
}

async function postLoginController(req, res) {
    const { identifier, username, password} = req.body

    console.log(identifier, username, password);
    

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
    return res.status(200).json({
        message: "User logged in Successfully",
        user: user
    })
}


module.exports = {
    getRegisterController,
    postRegisterController,
    getLoginController,
    postLoginController
}