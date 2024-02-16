const express = require('express');
const { 
    showAllProducts, 
    createProduct, 
    showProduct, 
    updateProduct, 
    removeProduct,
    relatedProducts,
    searchProduct,
    photoProduct,
    productsCount
    } = require('../controllers/productController');
const { requireSignin, isAdmin } = require('../middlewares/auth');
const { userById } = require('../middlewares/user')
const { productById, allProducts, search } = require('../middlewares/product')

const router = express.Router()
// Product get queries
router.get('/', allProducts, showAllProducts)
router.get('/:productId', showProduct)
router.get('/related/:productId', relatedProducts)
router.get('/photo/:productId', photoProduct)
// Product post queries
router.post('/create/:userById', [requireSignin, isAdmin], createProduct)
router.post('/search', search, searchProduct)
// Product put & delete queries
router.put('/update/:productId', [requireSignin, isAdmin], updateProduct)
router.delete('/remove/:productId', [requireSignin, isAdmin], removeProduct)
// Product queries params
router.param('userById', userById)
router.param('productId', productById)
module.exports = router
