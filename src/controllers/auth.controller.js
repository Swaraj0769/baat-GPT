async function getRegisterController(req, res) {
    res.render("register")
} 

async function postRegisterController(req, res) {
    // res.render("register")
} 


module.exports = {
    getRegisterController,
    postRegisterController
}