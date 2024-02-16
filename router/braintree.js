const express = require('express');
const { userById } = require('../middlewares/user');
const { requireSignin, isAdmin } = require('../middlewares/auth');
const { generateToken, processPayement } = require('../controllers/braintreeController');

const router = express.Router();

router.get('/getToken/:userId', [requireSignin], generateToken)
router.post('/pusrchase/:userId', [requireSignin], processPayement)

router.param('userById', userById)
module.exports = router