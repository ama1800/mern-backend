const { expressjwt: jwt } = require('express-jwt');
require("dotenv/config");

exports.requireSignin = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: 'auth'
})

exports.isAuth = (req, res, next) => {

    let user = req.profile && req.auth && (req.profile._id.toString() === req.auth._id)

    if (user || req.auth.role == 1) {
        return next()
    }
    return res.status(403).json({
        error: "Accés non authoriser!"
    })
}

exports.isAdmin = (req, res, next) => {
    if(req.auth.role == 0) {
        return res.status(403).json({
            error: "Vous n'avez pas les droits d'accés!"
        })
    }
    next();
}