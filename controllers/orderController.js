const { Order } = require("../models/orderModel");
const mongoose = require('mongoose');

// Oreder create
exports.createOrder = async (req, res) => {
  // Avoid liners
  const existOrder = await Order.findOne({
    transaction_id: req.body.transaction_id,
  });

  try {
    // If already exist
    if (existOrder) {
      return res.status(400).json({
        error: "Votre commande est déjà faite!",
      });
    } else {
      // Add user to order
      req.body = {
        ...req.body,
        user: req.profile._id,
      };
      // New order
      const order = new Order(req.body);
      const persistOrder = await order.save();

      if (!persistOrder) {
        return res.status(500).json({
          error:
            "Echec de creation de votre commande veuillez réessayer. Merci!",
        });
      }

      res.json({
        order: persistOrder,
      });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

// Get all orders
exports.allOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name email")
    .sort("-createdAt")
    .then((orders, err) => {
      if (err) {
        return res.status(404).json({
          error: err.message,
        });
      }
      res.json({
        orders,
      });
    });
};

// Get Order by Id
exports.showOrder = (req, res) => {
  req.order.photo = undefined;
  res.json({
    order: req.order,
  });
};

// Remove an order
exports.removeOrder = (req, res) => {
  let order = req.order;
  order.deleteOne().then((order, err) => {
    if (err) {
      return res.status(404).json({
        err: "Mauvaise requête!",
      });
    }
    res.status(204).json({});
  });
};

// Get all possible status of an order
exports.getStatus = (req, res) => {
  res.json({ status: Order.schema.path("status").enumValues });
};

// Update order status
exports.upOrder = (req, res) => {
  let order = req.order;
  order.status = req.query.status
  order.save()
    .then((order, err) => {
    if (err) {
      return res.status(404).json({
        err: "Mauvaise requête! Status n'est pas mise à jour",
        error: err.message
      });
    }
    res.json({ order });
  });
};

// Get all user's orders
exports.userOrders = (req, res) => {
  
  let id = new mongoose.Types.ObjectId(req.auth._id)
  Order.find({user: id})
    .populate("user", "_id name email")
    .sort("-createdAt")
    .then((orders, err) => {
      if (err) {
        return res.status(404).json({
          error: err.message,
        });
      }
      res.json({
        orders,
      });
    });
}
