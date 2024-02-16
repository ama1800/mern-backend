const User = require("../models/userModel");
const { v1: uuidv1 } = require("uuid");
const crypto = require("crypto");
const formidable = require("formidable");
const _ = require("lodash");
const Joi = require("joi");

exports.userList = (req, res) => {
  res.json({
    users: req.users,
  });
};

exports.getOneUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;

  res.json({
    user: req.profile,
  });
};

exports.updateUser = (req, res) => {

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields) => {
    
    if (err) {
      return res.status(400).json({
        error: "Echec d'envoie de fichier!",
      });
    }

    let hashedPassword = "";
    let salt = "";
    if (fields.password) {
      await hashPass(fields.password, fields.hashed_password, fields.salt)
        .then(
          () => {
            if (data) {
              hashedPassword = data.hashed_password;
              salt = data.salt;
            }
          }
        );
    }
    if (hashedPassword && salt) {
      fields.hashed_password = hashedPassword;
      fields.salt = salt;
    }

    let user = req.profile;
    user = _.extend(user, fields);

    user.save().then((user, err) => {
      if (err) {
        return res.status(400).json({
          err: "Echec de la mise à jour du Profil!!",
        });
      }

      let {_id, name, email, role, address, phone, city, zipCode} = user
      res.json({
        _id, name, email, role, address, phone, city, zipCode
      });

    });
    
  });
};

const hashPass = (pass, hashed_password, salt) => {
  let p = new Promise((res, rej) => {
    if (pass) {
      salt = uuidv1();
      hashed_password = crypto
        .createHmac("sha1", salt)
        .update(pass)
        .digest("hex");
      res((data = { hashed_password, salt }));
    } else rej("");
  });
  return p;
};

// Delete User
exports.removeUser = (req, res) => {
  let user = req.profile;
  user.deleteOne().then((user, err) => {
    if (err) {
      return res.status(404).json({
        err: "Mauvaise requête!",
      });
    }
    res.status(204).json({});
  });
};

// Change user role
exports.updateUserRole = (req, res) => {
  User.updateOne(
    {_id: req.profile._id},
    {$set: {role: req.body.role} }
    ).then((data, err) => {
      if (err) {
        return res.status(400).json({error: err.message})
      }
      res.json(data)
    })
}