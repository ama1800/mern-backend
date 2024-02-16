const express = require('express')
const { getOneUser, updateUser, userList, removeUser, updateUserRole } = require('../controllers/userController')
const { userById, allUsers } = require('../middlewares/user')
const { requireSignin, isAuth, isAdmin } = require('../middlewares/auth')

const router = express.Router()

router.get('/', requireSignin, isAdmin, allUsers, userList)
router.get('/profile/:userId', [requireSignin, isAuth], getOneUser)
router.put('/profile/:userId', [requireSignin, isAuth], updateUser)
router.delete('/remove/:userId', [requireSignin, isAdmin], removeUser)
router.patch('/profile/role/:userId', [requireSignin, isAuth, isAdmin], updateUserRole)

router.param('userId', userById)

module.exports = router