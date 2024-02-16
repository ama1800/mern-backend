const mongoose = require("mongoose");
const { v1: uuidv1 } = require("uuid");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 50,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      maxlength: 150,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    zipCode: {
      type: String,
      trim: true,
      maxlength: 10,
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      match: [/^(?:(?:(?:\+|00)33[ ]?(?:\(0\)[ ]?)?)|0){1}[1-9]{1}([ .-]?)(?:\d{2}\1?){3}\d{2}$/, 'Merci de fournir un numéro valide'],
    },
    hashed_password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 50,
    },
    salt: {
      type: String,
    },
    about: {
      type: String,
      trim: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.hashed_password = this.cryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  auth: function (plainText) {
    return this.cryptPassword(plainText) === this.hashed_password;
  },
  cryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
