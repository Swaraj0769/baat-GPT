const userModel = require('../models/user.model')

async function getRegisterController(req, res) {
    res.render("register")
} 

async function postRegisterController(req, res) {
    const {username, email, password} = req.body;

    
} 


module.exports = {
    getRegisterController,
    postRegisterController
}