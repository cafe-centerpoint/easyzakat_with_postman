const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('auth-token');
    if(!token) return res.status(403).send({ message: 'Access denied'});
    const { TokenExpiredError } = jwt;
    const catchError = (err, res) => {
        if (err instanceof TokenExpiredError) {
            return res.status(401).send("Access denied! Token was expired!");
        }
    }

    try {
        const verified = jwt.verify(
            token, 
            process.env.TOKEN_SECRET, 
            (err, decoded) => {
                if (err) {
                    return catchError(err, res);
                }
                req.user = decoded.id;
                next();
            }
        );
        // req.user = verified;
        // next();
    } catch (err){
        res.status(400).send('Invalid token');
    }
}