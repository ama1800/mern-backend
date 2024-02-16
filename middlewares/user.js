const User = require("../models/userModel");

exports.userById = (req, res, next, id) => {
  User.findById(id).then((user, err) => {
    if (err || !user) {
      return res.status(404).json({
        error: "Erreur .., utilisateur inexistant ou manque de droit!",
      });
    }
    req.profile = user;
    next();
  });
};

exports.allUsers = (req, res, next) => {
  User.find().then((users, err) => {
    if (err || !users) {
      return res.status(404).json({
        error: "Aucun utilisateur existant!",
      });
    }
    for (let user of users) {
      user.hashed_password = undefined;
      user.salt = undefined;
      user = [...users];
    }
    req.users = users;
    next();
  });
};

exports.addProductsToUserHistory = async (req, res, next) => {

  let history = {};

  history = req.body.products.map((product) => {
    return {
      _id: product._id,
      name: product.name,
      description: product.description,
      count: product.count,
      amount: product.price * product.count,
      transaction_id: req.body.transaction_id,
    };

  });

  if (history.length) {

    await User.findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { history } },
      { new: true }
    )
    .then((user, err) => {
      if (err) {
        return res.status(400).json({
          err: "Echec de la mise à jour du profil de l'utilisateur!",
        });
      }
      return next();
    });

  } else next();
  
};
