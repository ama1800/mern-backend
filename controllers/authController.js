const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

exports.signup = async (req, res) => {
    const user = new User(req.body);
    try {
        const persistedUser = await user.save()
        persistedUser.hashed_password = undefined
        persistedUser.salt = undefined
        res.send(persistedUser)
    } catch (error) {
        return res.status(400).send(error)
    }
};

exports.signin = async (req, res) => {
    const {email, password } = req.body;
    const user = await User.findOne({email})
    try {
        if (!user || !user.auth(password)) {
            return res.status(401).json({
                error: 'Informations d\'identification invalides'
            })
        }
        const token = jwt.sign({_id: user._id, role: user.role},process.env.JWT_SECRET);
        res.cookie('token', token, {expire: new Date() + 18000})
        const {_id, name, email, role, address, phone, city, zipCode} = user
        return res.json({
            token, user: {_id, name, email, role, address, phone, city, zipCode}
        })
    } catch (error) {
        return res.status(400).send(error)
    }

};

    exports.signout = (req, res) => {
        res.clearCookie('token');
        res.json({
            message: 'Utilisateur déconnecté!'
        })
    };
