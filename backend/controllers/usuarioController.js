var Usuario = require('../models/usuario');
var Producto = require('../models/producto');
const bcrypt = require('bcrypt');
var jwt = require('../helpers/jwt');
var fs = require('fs');
var path = require('path');
var cloudinaryHelper = require('../helpers/cloudinary');
var logger = require('../helpers/logger');

// Escapa caracteres especiales de RegExp para evitar Injection (OWASP #3)
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}



// Roles permitidos — OWASP #1 (Control de acceso)
const ROLES_VALIDOS = ['admin', 'vendedor', 'almacen'];

const registro_usuario_admin = async function(req, res) {
    if (req.user) {
        // OWASP #1: solo un admin puede crear usuarios
        if (req.user.rol !== 'admin') {
            logger.accessDenied(req, 'registro_usuario_admin');
            return res.status(403).send({ data: undefined, message: 'No tienes permisos para realizar esta acción.' });
        }

        let data = req.body;

        // Validación mínima de campos requeridos
        if (!data.nombres || !data.apellidos || !data.email || !data.rol) {
            return res.status(400).send({ data: undefined, message: 'Todos los campos son obligatorios.' });
        }

        // OWASP #1: validar que el rol asignado sea válido
        if (!ROLES_VALIDOS.includes(data.rol)) {
            return res.status(400).send({ data: undefined, message: 'Rol no válido.' });
        }

        // Normalizar email (OWASP #3)
        data.email = data.email.trim().toLowerCase();

        let usuarios = await Usuario.find({ email: data.email });

        if (usuarios.length >= 1) {
            res.status(200).send({ data: undefined, message: 'El correo electrónico ya existe' });
        } else {
            try {
                // OWASP #4: no usar contraseña temporal fija. Generar una temporal aleatoria.
                const tempPassword = require('crypto').randomBytes(10).toString('hex');
                const hash = await bcrypt.hash(tempPassword, 12);
                data.password = hash;
                // TODO: enviar tempPassword por correo al nuevo usuario
                let usuario = await Usuario.create(data);
                // Nunca devolver el hash al frontend
                const { password: _, ...usuarioSafe } = usuario.toObject();
                res.status(200).send({ data: usuarioSafe });
            } catch (error) {
                res.status(500).send({ data: undefined, message: 'No se pudo crear el usuario.' });
            }
        }
    } else {
        res.status(403).send({ data: undefined, message: 'ErrorToken' });
    }
}

const MAX_INTENTOS = 5;
const BLOQUEO_MS = 30 * 60 * 1000; // 30 minutos

const login_usuario = async function(req, res) {
    var data = req.body;

    if (!data.email || !data.password) {
        return res.status(400).send({ data: undefined, message: 'Email y contraseña son requeridos.' });
    }

    // Normalizar email (OWASP #3)
    data.email = data.email.trim().toLowerCase();

    try {
        var usuarios = await Usuario.find({ email: data.email })
            .select('+password +login_intentos +login_bloqueado_hasta');

        if (usuarios.length >= 1) {
            const usuario = usuarios[0];

            // Verificar bloqueo temporal por intentos fallidos
            if (usuario.login_bloqueado_hasta && usuario.login_bloqueado_hasta > new Date()) {
                const minutos = Math.ceil((usuario.login_bloqueado_hasta - new Date()) / 60000);
                logger.security('ACCOUNT_LOCKED_ATTEMPT', { ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress, email: data.email });
                return res.status(429).send({ data: undefined, message: `Cuenta bloqueada temporalmente. Intenta en ${minutos} minuto(s).` });
            }

            if (usuario.estado) {
                const match = await bcrypt.compare(data.password, usuario.password);

                if (match) {
                    // Resetear contador de intentos al login exitoso
                    await Usuario.findByIdAndUpdate(usuario._id, { login_intentos: 0, login_bloqueado_hasta: null });
                    const { password: _, login_intentos: __, login_bloqueado_hasta: ___, ...usuarioSafe } = usuario.toObject();
                    logger.loginOk(req, usuario._id, usuario.rol);
                    res.status(200).send({
                        token: jwt.createToken(usuario),
                        usuario: usuarioSafe
                    });
                } else {
                    // Incrementar contador — bloquear si llega al máximo
                    const intentos = (usuario.login_intentos || 0) + 1;
                    const update = { login_intentos: intentos };
                    if (intentos >= MAX_INTENTOS) {
                        update.login_bloqueado_hasta = new Date(Date.now() + BLOQUEO_MS);
                        logger.security('ACCOUNT_LOCKED', { email: data.email, intentos });
                    }
                    await Usuario.findByIdAndUpdate(usuario._id, update);
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
        logger.error('LOGIN_ERROR', { error: error.message });
        res.status(500).send({ data: undefined, message: 'Error interno del servidor.' });
    }
}


const listar_usuario_admin = async function(req, res) {
    if (req.user) {
        let filtro = req.params['filtro'] || '';

        try {
            // OWASP #3: escapar input antes de usarlo en RegExp
            const safeFilter = escapeRegex(filtro.trim());
            let usuarios = await Usuario.find({
                $or: [
                    { nombres: new RegExp(safeFilter, 'i') },
                    { apellidos: new RegExp(safeFilter, 'i') },
                    { email: new RegExp(safeFilter, 'i') },
                ]
            });
            res.status(200).send(usuarios);
        } catch (error) {
            res.status(500).send({ data: undefined, message: 'Error interno del servidor.' });
        }
    } else {
        res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
}


const obtener_usuario_admin = async function(req, res) {
    if (req.user) {
        let id = req.params['id'];

        try {
            let usuario = await Usuario.findById({ _id: id });

            res.status(200).send(usuario);
        } catch (error) {
            res.status(500).send({ data: undefined, message: 'Error interno del servidor.' });
        }
    } else {
        res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
}


const actualizar_usuario_admin = async function(req, res) {
    if (req.user) {
        let id = req.params['id'];
        let data = req.body;

        try {
            let usuario = await Usuario.findByIdAndUpdate({ _id: id }, {
                nombres: data.nombres,
                apellidos: data.apellidos,
                rol: data.rol,
                email: data.email,
            });

            res.status(200).send(usuario);
        } catch (error) {
            res.status(500).send({ data: undefined, message: 'Error interno del servidor.' });
        }
    } else {
        res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
}


const cambiar_password_usuario_admin = async function(req, res) {
    if (req.user) {
        // OWASP #1: solo admin puede cambiar contraseña de otro usuario
        if (req.user.rol !== 'admin') {
            logger.accessDenied(req, `cambiar_password_usuario/${req.params['id']}`);
            return res.status(403).send({ data: undefined, message: 'No tienes permisos para realizar esta acción.' });
        }
        let id = req.params['id'];
        let data = req.body;

        // OWASP #4 + #7: política de contraseña segura
        if (!data.password || data.password.length < 8 ||
            !/[A-Z]/.test(data.password) ||
            !/[a-z]/.test(data.password) ||
            !/[0-9]/.test(data.password)) {
            return res.status(400).send({ data: undefined, message: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.' });
        }

        try {
            // OWASP #2: bcrypt con factor 12 (más seguro que 10)
            const hash = await bcrypt.hash(data.password, 12);
            await Usuario.findByIdAndUpdate({ _id: id }, { password: hash });
            logger.security('PASSWORD_CHANGED', { adminId: req.user.sub, targetId: id });
            res.status(200).send({ message: 'Contraseña actualizada correctamente' });
        } catch (error) {
            res.status(500).send({ data: undefined, message: 'Error interno del servidor.' });
        }
    } else {
        res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
}


const cambiar_estado_usuario_admin = async function(req, res) {
    if (req.user) {
        let id = req.params['id'];
        let data = req.body;

        let nuevo_estado = false;

        if (data.estado) {
            nuevo_estado = false;
        } else {
            nuevo_estado = true;
        }

        try {
            let usuario = await Usuario.findByIdAndUpdate({ _id: id }, {
                estado: nuevo_estado
            });
            res.status(200).send(usuario);
        } catch (error) {
            res.status(500).send({ data: undefined, message: 'Error interno del servidor.' });
        }
    } else {
        res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
}


const subir_avatar_usuario_admin = async function(req, res) {
    if (req.user) {
        let id = req.params['id'];
        if (!req.file) {
            return res.status(200).send({ data: undefined, message: 'No se recibió ninguna imagen' });
        }
        try {
            // Eliminar avatar anterior si existe
            const usuarioActual = await Usuario.findById(id);
            if (usuarioActual && usuarioActual.avatar) {
                if (usuarioActual.avatar.startsWith('http')) {
                    await cloudinaryHelper.deleteByUrl(usuarioActual.avatar);
                } else {
                    const rutaAnterior = './uploads/avatars/' + usuarioActual.avatar;
                    if (fs.existsSync(rutaAnterior)) fs.unlinkSync(rutaAnterior);
                }
            }
            const uploadResult = await cloudinaryHelper.uploadBuffer(req.file.buffer, 'avatars');
            await Usuario.findByIdAndUpdate({ _id: id }, { avatar: uploadResult.secure_url });
            res.status(200).send({ avatar: uploadResult.secure_url });
        } catch (error) {
            res.status(500).send({ data: undefined, message: 'Error al subir la imagen' });
        }
    } else {
        res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
}

const obtener_avatar_usuario = function(req, res) {
    let img = req.params['img'];

    // OWASP #10: validar URL de Cloudinary antes de redirigir
    if (img && img.startsWith('http')) {
        try {
            const decoded = decodeURIComponent(img);
            const parsed = new URL(decoded);
            const allowed = ['res.cloudinary.com', 'cloudinary.com'];
            if (!allowed.some(h => parsed.hostname === h || parsed.hostname.endsWith('.' + h))) {
                return res.status(400).send({ message: 'URL no permitida.' });
            }
            return res.redirect(302, decoded);
        } catch (_) {
            return res.status(400).send({ message: 'URL no válida.' });
        }
    }

    // OWASP #5: evitar path traversal en archivos locales
    const safeName = require('path').basename(img);
    let pathImg = './uploads/avatars/' + safeName;
    fs.stat(pathImg, function(err) {
        if (err) {
            res.status(200).sendFile(path.resolve('./uploads/default.jpg'));
        } else {
            res.status(200).sendFile(path.resolve(pathImg));
        }
    });
}

const buscar_global_admin = async function(req, res) {
    if (req.user) {
        const q = req.params['q'] || '';
        if (!q || q.trim().length < 2) return res.status(200).send({ usuarios: [], productos: [] });
        // OWASP #3: escapar input antes de construir RegExp
        const regex = new RegExp(escapeRegex(q.trim()), 'i');
        const usuarios = await Usuario.find({
            $or: [{ nombres: regex }, { apellidos: regex }, { email: regex }]
        }).select('nombres apellidos email rol estado avatar').limit(6);
        const productos = await Producto.find({
            $or: [{ nombre: regex }, { descripcion: regex }]
        }).select('nombre precio img estado').limit(6);
        res.status(200).send({ usuarios, productos });
    } else {
        res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
}

module.exports = {
    registro_usuario_admin,
    login_usuario,
    listar_usuario_admin,
    obtener_usuario_admin,
    actualizar_usuario_admin,
    cambiar_estado_usuario_admin,
    cambiar_password_usuario_admin,
    subir_avatar_usuario_admin,
    obtener_avatar_usuario,
    buscar_global_admin
}