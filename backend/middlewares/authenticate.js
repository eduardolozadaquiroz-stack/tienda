var jwt = require('jsonwebtoken');
var logger = require('../helpers/logger');

exports.decodeToken = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'NoHeadersError' });
    }

    var token = req.headers.authorization;

    // OWASP #8: rechazar tokens sin algoritmo o con algoritmo 'none'
    try {
        const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
        if (!header.alg || header.alg.toLowerCase() === 'none') {
            logger.tokenInvalid(req);
            return res.status(401).send({ message: 'ErrorToken' });
        }
    } catch (_) {
        return res.status(401).send({ message: 'ErrorToken' });
    }

    try {
        // OWASP #8: forzar algoritmo HS256 explícitamente
        var payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        req.user = payload;
        next();
    } catch (error) {
        // OWASP #9: registrar tokens inválidos
        logger.tokenInvalid(req);
        return res.status(401).send({ message: 'ErrorToken' });
    }
}
