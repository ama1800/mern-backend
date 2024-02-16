const express = require('express');
const { userById } = require('../middlewares/user');
const { requireSignin, isAdmin } = require('../middlewares/auth');
const { showAllCategory, createCategory, showCategory, updateCategory, removeCategory } = require('../controllers/categoryController')
const { categoryById, allCategories } = require('../middlewares/category');

const router = express.Router()


router.get('/', allCategories, showAllCategory)
router.post('/create/:userById', [requireSignin, isAdmin], createCategory)
router.put('/update/:categoryId', [requireSignin, isAdmin], updateCategory)
router.delete('/remove/:categoryId', [requireSignin, isAdmin], removeCategory)
router.get('/:categoryId', showCategory)

router.param('userById', userById)
router.param('categoryId', categoryById)

module.exports = router

