const Product = require("../models/productModel");
const formidable = require("formidable");
const _ = require("lodash");
const Joi = require("joi");
const fs = require("fs");

// All Products
exports.showAllProducts = (req, res) => {
  res.json({
    products: req.products,
    count: req.count
  });
};

// Create a Product
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {

    if (err) {
      return res.status(400).json({
        error: "Echec d'envoie de fichier!",
      });
    }
    const existProduct = await Product.findOne({ name: fields.name });
    const product = new Product(fields);
    try {
      if (existProduct) {
        return res.status(400).json({
          error: "Un produit avec le même nom existe déjà!",
        });
      } else {
        if (files.photo) {
          if (files.photo.size > Math.pow(10, 6)) {
            return res.status(400).json({
              error: "Le fichier dépasse la taille authoriser 1Mb!",
            });
          }
          product.photo.data = fs.readFileSync(files.photo.filepath);
          product.photo.contentType = files.photo.mimetype;
        }

        const schema = Joi.object({
          name: Joi.string().required(),
          description: Joi.string().required(),
          price: Joi.number(),
          quantity: Joi.number(),
          category: Joi.required(),
          shipping: Joi.required(),
        });

        const { error } = schema.validate(fields);

        if (error) {
          return res.status(400).json({
            error: error.details[0].message,
          });
        }
      }
    const persistProduct = await product.save();
    if (!persistProduct) {
      return res.status(400).json({
        error: "Echec de creation d'une nouveau produit!",
      });
    }
    res.json({
      product: persistProduct,
    });
    } catch (error) {
      return res.status(400).send(error);
    }
  });
};

// Show Product
exports.showProduct = (req, res) => {
  req.product.photo = undefined;
  res.json({
    product: req.product,
  });
};

// Update Product
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Echec d'envoie de fichier!",
      });
    }
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number(),
      quantity: Joi.number(),
      category: Joi.required(),
      shipping: Joi.required(),
    });

    let product = req.product;
    product = _.extend(product, fields);

    if (files.photo) {
      if (files.photo.size > Math.pow(10, 6)) {
        return res.status(400).json({
          error: "Le fichier dépasse la taille authoriser de 1Mb!",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.contentType = files.photo.mimetype;
    }

    const { error } = schema.validate(fields);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    product.save().then((product, err) => {
      if (err) {
        return res.status(400).json({
          err: "Echec de la mise à jour du Produit!!",
        });
      }
      res.json({
        product,
      });
    });
  });
};

// Delete Product
exports.removeProduct = (req, res) => {
  let product = req.product;
  product.deleteOne().then((product, err) => {
    if (err) {
      return res.status(404).json({
        err: "Mauvaise requête!",
      });
    }
    res.status(204).json({});
  });
};

// Related Products
exports.relatedProducts = (req, res) => {
  let limit = req.query.limit ?? 6;
  Product.find({
    category: req.product.category,
    _id: { $ne: req.product._id },
  })
    .select("-photo")
    .limit(limit)
    .populate("category", "_id name")
    .then((products, err) => {
      if (err || !products) {
        return res.status(404).json({
          error: "No related product found!",
        });
      }
      res.json({
        products,
      });
    });
};

// Search Product
exports.searchProduct = (req, res) => {
  res.json({
    products: req.products,
  });
};

// Get Product Photo
exports.photoProduct = (req, res) => {
  const { data, contentType } = req.product.photo;
  if (data) {
    res.set("content-type", contentType);
    return res.send(data);
  }
};
