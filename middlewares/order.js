const  { Order }  = require('../models/orderModel')

exports.orderById = (req, res, next, id) => {
    Order.findById(id).then((order, err) => {
        if (err || !order) {
            return res.status(404).json({
                error: 'Erreur .., Commande inexistant!'
            })
        }
        req.order = order;
        next();
    })
}