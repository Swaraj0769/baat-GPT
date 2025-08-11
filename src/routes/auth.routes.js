const express = require('express')
const { getRegisterController, postRegisterController } = require('../controllers/auth.controller')

const router = express.Router()

// router.get('/register', getRegisterController)
// router.post('/register', postRegisterController)

router.route('/register')
    .get(getRegisterController)
    .post(postRegisterController)

module.exports = router