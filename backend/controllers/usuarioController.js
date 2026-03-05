var Usuario = require('../models/usuario');
var Producto = require('../models/producto');
const bcrypt = require('bcrypt');
var jwt = require('../helpers/jwt');
var fs = require('fs');
var path = require('path');



const registro_usuario_admin = async function(req, res) {
    if (req.user) {
        let data = req.body;

        // Validación mínima de campos requeridos
        if (!data.nombres || !data.apellidos || !data.email || !data.rol) {
            return res.status(400).send({ data: undefined, message: 'Todos los campos son obligatorios.' });
        }

        let usuarios = await Usuario.find({ email: data.email });

        if (usuarios.length >= 1) {
            res.status(200).send({ data: undefined, message: 'El correo electrónico ya existe' });
        } else {
            try {
                const hash = await bcrypt.hash('123456', 10);
                data.password = hash;
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

const login_usuario = async function(req, res) {
    var data = req.body;

    if (!data.email || !data.password) {
        return res.status(400).send({ data: undefined, message: 'Email y contraseña son requeridos.' });
    }

    try {
        // Seleccionamos +password explícitamente porque el modelo tiene select:false
        var usuarios = await Usuario.find({ email: data.email }).select('+password');

        if (usuarios.length >= 1) {
            if (usuarios[0].estado) {
                const match = await bcrypt.compare(data.password, usuarios[0].password);

                if (match) {
                    // Eliminar el hash de la respuesta
                    const { password: _, ...usuarioSafe } = usuarios[0].toObject();
                    res.status(200).send({
                        token: jwt.createToken(usuarios[0]),
                        usuario: usuarioSafe
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


const listar_usuario_admin = async function(req, res) {
    if (req.user) {
        let filtro = req.params['filtro'];

        try {
            let usuarios = await Usuario.find({
                $or: [
                    { nombres: new RegExp(filtro, 'i') },
                    { apellidos: new RegExp(filtro, 'i') },
                    { email: new RegExp(filtro, 'i') },
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
        let id = req.params['id'];
        let data = req.body;

        if (!data.password || data.password.length < 6) {
            return res.status(200).send({ data: undefined, message: 'La contraseña debe tener al menos 6 caracteres' });
        }

        try {
            const hash = await bcrypt.hash(data.password, 10);
            await Usuario.findByIdAndUpdate({ _id: id }, { password: hash });
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
                const rutaAnterior = './uploads/avatars/' + usuarioActual.avatar;
                if (fs.existsSync(rutaAnterior)) fs.unlinkSync(rutaAnterior);
            }
            await Usuario.findByIdAndUpdate({ _id: id }, { avatar: req.file.filename });
            res.status(200).send({ avatar: req.file.filename });
        } catch (error) {
            res.status(500).send({ data: undefined, message: 'Error al subir la imagen' });
        }
    } else {
        res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
}

const obtener_avatar_usuario = function(req, res) {
    let img = req.params['img'];
    let pathImg = './uploads/avatars/' + img;
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
        const regex = new RegExp(q.trim(), 'i');
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