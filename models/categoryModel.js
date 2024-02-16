const mongoose = require('mongoose');
const slug = require("mongoose-slug-generator");

mongoose.plugin(slug);

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        maxlength: 120,
        minlength: 3,
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        require: true,
        slug: 'name'
    }
}, { timestamps: true });

// categorySchema.pre("save", function(next) {
//     this.slug = this.name.split(' ').join("-");
//     next();
// })

module.exports = mongoose.model('Category', categorySchema);