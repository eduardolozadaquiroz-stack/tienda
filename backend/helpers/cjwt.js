var jwt = require('jsonwebtoken');

exports.createToken = function(cliente) {
    var payload = {
        sub: cliente._id,
        nombres: cliente.nombres,
        apellidos: cliente.apellidos,
        email: cliente.email,
        genero: cliente.genero
    };
    return jwt.sign(payload, process.env.JWT_SECRET_CLIENTE, { expiresIn: '30d' });
}