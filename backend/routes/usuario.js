var express = require('express');
var usuarioController = require('../controllers/usuarioController');
var api = express.Router();
var authenticate = require('../middlewares/authenticate');
var multer = require('multer');
var pathModule = require('path');

var avatarStorage = multer.diskStorage({
    destination: function(req, file, cb) { cb(null, './uploads/avatars'); },
    filename: function(req, file, cb) { cb(null, Date.now() + pathModule.extname(file.originalname)); }
});
var uploadAvatar = multer({ storage: avatarStorage });


api.post('/registro_usuario_admin',authenticate.decodeToken,usuarioController.registro_usuario_admin);
api.post('/login_usuario',usuarioController.login_usuario);

api.get('/listar_usuario_admin/:filtro?', authenticate.decodeToken, usuarioController.listar_usuario_admin);
api.get('/obtener_usuario_admin/:id', authenticate.decodeToken, usuarioController.obtener_usuario_admin);
api.put('/actualizar_usuario_admin/:id', authenticate.decodeToken, usuarioController.actualizar_usuario_admin);
api.put('/cambiar_estado_usuario_admin/:id', authenticate.decodeToken, usuarioController.cambiar_estado_usuario_admin);
api.put('/cambiar_password_usuario_admin/:id', authenticate.decodeToken, usuarioController.cambiar_password_usuario_admin);
api.post('/subir_avatar_usuario_admin/:id', authenticate.decodeToken, uploadAvatar.single('avatar'), usuarioController.subir_avatar_usuario_admin);
api.get('/obtener_avatar_usuario/:img', usuarioController.obtener_avatar_usuario);
api.get('/buscar_global_admin/:q', authenticate.decodeToken, usuarioController.buscar_global_admin);

module.exports = api;