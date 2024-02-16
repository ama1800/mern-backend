const Category = require("../models/categoryModel");
const formidable = require("formidable");
const _ = require("lodash");
const Joi = require("joi");

exports.showAllCategory = (req, res) => {
  res.json({
    categories: req.categories,
  });
};

exports.createCategory = async (req, res) => {
  const existCat = await Category.findOne({ name: req.body.name });
  const category = new Category(req.body);
  try {
    if (existCat) {
      return res.status(400).json({
        error: "Une catégorie avec le même nom existe déjà!",
      });
    } else {
      const persistCat = await category.save();
      if (!persistCat) {
        return res.status(400).json({
          error: "Echec de creation d'une nouvelle catégorie!",
        });
      }
      res.json({
        category: persistCat,
      });
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.showCategory = (req, res) => {
  req.category.photo = undefined;
  res.json({
    category: req.category,
  });
};

exports.updateCategory = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields) => {
    if (err) {
      return res.status(400).json({
        error: "Echec d'envoie de fichier!",
      });
    }
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    let category = req.category;
    category = _.extend(category, fields);

    const { error } = schema.validate(fields);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    category.save().then((category, err) => {
      if (err) {
        return res.status(400).json({
          err: "Echec de la mise à jour du Produit!!",
        });
      }
      res.json({
        category,
      });
    });
  });
};

exports.removeCategory = (req, res) => {
  let category = req.category;
  category.deleteOne().then((category, err) => {
    if (err) {
      return res.status(404).json({
        err: "Mauvaise requête!",
      });
    }
    res.status(204).json({});
  });
};
