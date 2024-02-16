const mongoose = require('mongoose');
const slug = require("mongoose-slug-generator");
const { ObjectId } = mongoose.Schema;

mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        maxlength: 150,
        trim: true
    },
    description: {
        type: String,
        require: true,
        minlength: 10,
        maxlength: 3000
    },
    slug: {
        type: String,
        require: true,
        slug: 'name'
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    shipping: {
        type: Boolean,
        require: true,
        default: false
    },
    category: {
        type: ObjectId,
        ref: 'Category',
        require: true
    },
    sold: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);