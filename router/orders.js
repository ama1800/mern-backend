const express = require('express');
const { userById, addProductsToUserHistory } = require('../middlewares/user');
const { requireSignin, isAdmin, isAuth } = require('../middlewares/auth');
const { createOrder, allOrders, showOrder, removeOrder, getStatus, upOrder, userOrders } = require('../controllers/orderController');
const { orderById } = require('../middlewares/order');
const { decreseOrderedProducts } = require('../middlewares/product');

const router = express.Router()

router.get('/:userId', [requireSignin, isAdmin], allOrders)
router.get('/userorders/:userId', [requireSignin, isAuth], userOrders)
router.get('/show/:orderId', [requireSignin, isAuth], showOrder)
router.get('/status/:userId', [requireSignin, isAuth, isAdmin], getStatus)
router.post('/create_order/:userId', [requireSignin, isAuth, decreseOrderedProducts, addProductsToUserHistory], createOrder)
router.put('/uporder/:orderId', [requireSignin, isAuth], upOrder)
router.delete('/remove/:orderId', [requireSignin, isAdmin], removeOrder)

router.param('userId', userById)
router.param('orderId', orderById)

module.exports = router