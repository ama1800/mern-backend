exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Le nom est requis!').notEmpty();
    req.check('email', 'Email valide est requis').isEmail().notEmpty();
    req.check('password', 'Le mot de passe doit contenir au moins 8 charactéres max 50!')
        .notEmpty()
        .isLength({min: 8, max: 50});

    const errors = req.validationErrors()
    if (errors) {
        let errs = []
        for( let err of errors)    errs.push(err.msg)
        return res.status(400).json({errs})
    }
    next();
}