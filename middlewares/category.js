const Category = require('../models/categoryModel')

exports.categoryById = (req, res, next, id) => {
    Category.findById(id).then((category, err) => {
        if (err || !category) {
            return res.status(404).json({
                error: 'Erreur .., category inexistant!'
            })
        }
        req.category = category;
        next();
    })
}
exports.allCategories = (req, res, next) => {
    Category.find().then((categories, err) => {
        if (err || !categories) {
            return res.status(404).json({
                error: 'Erreur .., Aucune categorie existante!'
            })
        }
        req.categories = categories;
        next();
    })
}