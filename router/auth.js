const express = require('express')
const {requireSignin} = require('../middlewares/auth')
const {signup, signin, signout} = require("../controllers/authController")
const {userSignupValidator} = require('../middlewares/userValidator')
const router = express.Router();

router.post('/signup', userSignupValidator, signup)
router.post('/signin', signin)
router.get('/signout', signout)

module.exports = router