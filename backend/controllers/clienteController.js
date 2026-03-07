var Cliente = require('../models/cliente');
const bcrypt = require('bcrypt');
var jwt = require('../helpers/cjwt');
var logger = require('../helpers/logger');

const registro_cliente_ecommerce = async function(req, res) {
    let data = req.body;

    // Validación mínima
    if (!data.nombres || !data.email || !data.password) {
        return res.status(400).send({ message: 'Nombre, email y contraseña son requeridos.' });
    }

    // Normalizar email
    data.email = data.email.trim().toLowerCase();

    // Validar formato de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return res.status(400).send({ message: 'El formato del correo electrónico no es válido.' });
    }

    // Política de contraseña segura
    if (data.password.length < 8 ||
        !/[A-Z]/.test(data.password) ||
        !/[a-z]/.test(data.password) ||
        !/[0-9]/.test(data.password)) {
        return res.status(400).send({ message: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.' });
    }

    let reg = await Cliente.find({ email: data.email });

    if (reg.length >= 1) {
        res.status(200).send({ message: 'El correo electrónico ya existe' });
    } else {
        try {
            // OWASP #2: bcrypt con factor 12
            const hash = await bcrypt.hash(data.password, 12);
            data.password = hash;
            let cliente = await Cliente.create(data);
            // Nunca devolver el hash al frontend
            const { password: _, ...clienteSafe } = cliente.toObject();
            res.status(200).send({ token: jwt.createToken(cliente), cliente: clienteSafe });
        } catch (error) {
            res.status(500).send({ message: 'No se pudo crear la cuenta.' });
        }
    }
}


const MAX_INTENTOS = 5;
const BLOQUEO_MS = 30 * 60 * 1000; // 30 minutos

const login_cliente = async function(req, res) {
    var data = req.body;

    if (!data.email || !data.password) {
        return res.status(400).send({ data: undefined, message: 'Email y contraseña son requeridos.' });
    }

    data.email = data.email.trim().toLowerCase();

    try {
        var clientes = await Cliente.find({ email: data.email })
            .select('+password +login_intentos +login_bloqueado_hasta');

        if (clientes.length >= 1) {
            const cliente = clientes[0];

            // Verificar bloqueo temporal
            if (cliente.login_bloqueado_hasta && cliente.login_bloqueado_hasta > new Date()) {
                const minutos = Math.ceil((cliente.login_bloqueado_hasta - new Date()) / 60000);
                logger.security('ACCOUNT_LOCKED_ATTEMPT', { ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress, email: data.email });
                return res.status(429).send({ data: undefined, message: `Cuenta bloqueada temporalmente. Intenta en ${minutos} minuto(s).` });
            }

            if (cliente.estado) {
                const match = await bcrypt.compare(data.password, cliente.password);
                if (match) {
                    // Resetear contador al login exitoso
                    await Cliente.findByIdAndUpdate(cliente._id, { login_intentos: 0, login_bloqueado_hasta: null });
                    const { password: _, login_intentos: __, login_bloqueado_hasta: ___, ...clienteSafe } = cliente.toObject();
                    logger.loginOk(req, cliente._id, 'cliente');
                    res.status(200).send({
                        token: jwt.createToken(cliente),
                        cliente: clienteSafe
                    });
                } else {
                    // Incrementar contador y bloquear si llega al máximo
                    const intentos = (cliente.login_intentos || 0) + 1;
                    const update = { login_intentos: intentos };
                    if (intentos >= MAX_INTENTOS) {
                        update.login_bloqueado_hasta = new Date(Date.now() + BLOQUEO_MS);
                        logger.security('ACCOUNT_LOCKED', { email: data.email, intentos });
                    }
                    await Cliente.findByIdAndUpdate(cliente._id, update);
                    logger.loginFail(req, data.email);
                    res.status(401).send({ data: undefined, message: 'Credenciales incorrectas.' });
                }
            } else {
                logger.loginFail(req, data.email);
                res.status(403).send({ data: undefined, message: 'Su cuenta está desactivada.' });
            }
        } else {
            logger.loginFail(req, data.email);
            res.status(401).send({ data: undefined, message: 'Credenciales incorrectas.' });
        }
    } catch (error) {
        res.status(500).send({ data: undefined, message: 'Error interno del servidor.' });
    }
}

module.exports = {
    registro_cliente_ecommerce,
    login_cliente
}