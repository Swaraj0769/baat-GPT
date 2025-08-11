const userModel = require('../models/user.model')

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
} 


module.exports = {
    getRegisterController,
    postRegisterController
}