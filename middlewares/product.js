const Product = require("../models/productModel");

// Query to get Product by id
exports.productById = (req, res, next, id) => {
  Product.findById(id)
  .populate("category", "_id name")
  .then((product, err) => {
    if (err || !product) {
      return res.status(404).json({
        error: "Erreur .., produit inexistant!",
      });
    }
    req.product = product;
    next();
  });
};

// Query to get all Products
exports.allProducts = (req, res, next) => {
  let sortby = req.query.sortby ?? "_id";
  let order = req.query.order ?? "asc";
  let limit = req.query.limit ?? 4;
  let page = req.query.page ?? 1;
  let pages = 1;
  let query = {}

  let {search, category } = req.query

  if (search) {
    query.name = {$regex: search, $options: 'i'};
  }
  if (category) {
    query.category = category
  }

  Product.countDocuments().then((count, err) =>{ return pages = count})

  Product.find(query)
    .select("-photo")
    .populate("category", "_id name")
    .sort([[sortby, order]])
    .skip((page * limit) - limit)
    .limit(limit)
    .then((products, err) => {
      if (err || !products) {
        return res.status(404).json({
          error: "Erreur .., Aucune Produit trouvé!",
        });
      }
      req.products = products;
      req.count = {pages: Math.ceil(pages/limit)};
      next();
    });
};

// Query to search Product
exports.search = (req, res, next) => {
  let sortby = req.query.sortby ?? "_id";
  let order = req.query.order ?? "asc";
  let limit = req.query.limit ?? 10;
  let skip = parseInt(req.query.skip);
  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // $gte : greater than price [0-10]
        // $lte : less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else findArgs[key] = req.body.filters[key];
    }
  }
  
  Product.find(findArgs)
    .select("-photo")
    .populate("category", "_id name")
    .sort([[sortby, order]])
    .limit(limit)
    .skip(skip)
    .then((products, err) => {
      if (err || !products) {
        return res.status(404).json({
          error: "Aucun Produit trouvé!",
        });
      }
      req.products = products;
      next();
    });
};

exports.decreseOrderedProducts = (req, res, next) => {
  
    let bulkOps = req.body.products.map((product) => {
      
      if (product.quantity - product.count < 0) {
        
        return res.status(400).json({
          err: `Echec de la commande! Il ya seulement ${product.quantity} ${product.name} disponible. Merci de modifier votre commande!`,
        });

      }
      return {
        updateOne: {
          filter: { _id: product._id },
          update: { $inc : { quantity: -product.count, sold: +product.count } }
        }
      }
    })

    Product.bulkWrite(bulkOps)
      .then((products, err) => {

        if (err) {
          return res.status(400).json({
            err: "Echec de la mise à jour du produit !",
          });
        }

        next();
      })

}
