const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')

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
        password: password
    })

    return res.status(201).json({
        message: "User register successfully", user
    })
} 


module.exports = {
    getRegisterController,
    postRegisterController
}