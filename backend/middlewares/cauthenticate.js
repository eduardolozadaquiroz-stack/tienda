var jwt = require('jsonwebtoken');

exports.decodeToken = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'NoHeadersError' });
    }

    var token = req.headers.authorization;

    try {
        var payload = jwt.verify(token, process.env.JWT_SECRET_CLIENTE);
        req.user = payload;
        next();
    } catch (error) {
        return res.status(403).send({ message: 'ErrorToken' });
    }
}