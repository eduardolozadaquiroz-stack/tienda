var jwt = require('jsonwebtoken');

exports.createToken = function(usuario) {
    var payload = {
        sub: usuario._id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
}