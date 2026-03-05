var Cliente = require('../models/cliente');
const bcrypt = require('bcrypt');
var jwt = require('../helpers/cjwt');

const registro_cliente_ecommerce = async function(req, res) {
    let data = req.body;

    // Validación mínima
    if (!data.nombres || !data.email || !data.password) {
        return res.status(400).send({ message: 'Nombre, email y contraseña son requeridos.' });
    }
    if (data.password.length < 6) {
        return res.status(400).send({ message: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    let reg = await Cliente.find({ email: data.email });

    if (reg.length >= 1) {
        res.status(200).send({ message: 'El correo electrónico ya existe' });
    } else {
        try {
            const hash = await bcrypt.hash(data.password, 10);
            data.password = hash;
            let cliente = await Cliente.create(data);
            // Nunca devolver el hash al frontend
            const { password: _, ...clienteSafe } = cliente.toObject();
            res.status(200).send(clienteSafe);
        } catch (error) {
            res.status(500).send({ message: 'No se pudo crear la cuenta.' });
        }
    }
}


const login_cliente = async function(req, res) {
    var data = req.body;

    if (!data.email || !data.password) {
        return res.status(400).send({ data: undefined, message: 'Email y contraseña son requeridos.' });
    }

    try {
        // Seleccionamos +password explícitamente porque el modelo tiene select:false
        var clientes = await Cliente.find({ email: data.email }).select('+password');

        if (clientes.length >= 1) {
            if (clientes[0].estado) {
                const match = await bcrypt.compare(data.password, clientes[0].password);
                if (match) {
                    // Eliminar el hash de la respuesta
                    const { password: _, ...clienteSafe } = clientes[0].toObject();
                    res.status(200).send({
                        token: jwt.createToken(clientes[0]),
                        cliente: clienteSafe
                    });
                } else {
                    res.status(401).send({ data: undefined, message: 'La contraseña es incorrecta.' });
                }
            } else {
                res.status(403).send({ data: undefined, message: 'Su cuenta está desactivada.' });
            }
        } else {
            res.status(401).send({ data: undefined, message: 'No se encontró el correo electrónico.' });
        }
    } catch (error) {
        res.status(500).send({ data: undefined, message: 'Error interno del servidor.' });
    }
}

module.exports = {
    registro_cliente_ecommerce,
    login_cliente
}