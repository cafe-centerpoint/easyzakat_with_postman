const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    res.cookie('jwt', '', { maxAge: 1} );
    next();
}