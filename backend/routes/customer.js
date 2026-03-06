var express = require('express');
var customerController = require('../controllers/customerController');
var cauthenticate = require('../middlewares/cauthenticate');
var multer = require('multer');
var pathModule = require('path');

var uploadDiseno = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb){ cb(null, './uploads/diseños'); },
        filename: function(req, file, cb){ cb(null, Date.now() + pathModule.extname(file.originalname)); }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB máximo
    fileFilter: function(req, file, cb){
        const allowed = /jpeg|jpg|png|webp/;
        cb(null, allowed.test(pathModule.extname(file.originalname).toLowerCase()));
    }
});

var api = express.Router();

api.post('/crear_producto_carrito', cauthenticate.decodeToken, uploadDiseno.fields([{name:'imagen_diseno', maxCount:1}]), customerController.crear_producto_carrito);
api.get('/obtener_imagen_diseno/:name', customerController.obtener_imagen_diseno);
api.get('/obtener_carrito_cliente', cauthenticate.decodeToken, customerController.obtener_carrito_cliente);
api.delete('/eliminar_producto_carrito/:id',cauthenticate.decodeToken, customerController.eliminar_producto_carrito);
api.post('/crear_direccion_cliente', cauthenticate.decodeToken, customerController.crear_direccion_cliente);
api.get('/obternet_direcciones_cliente',cauthenticate.decodeToken, customerController.obternet_direcciones_cliente);
api.delete('/eliminar_direccion_cliente/:id',cauthenticate.decodeToken, customerController.eliminar_direccion_cliente);
api.get('/validar_payment_id_venta/:payment_id',cauthenticate.decodeToken, customerController.validar_payment_id_venta);
api.post('/crear_venta_cliente', cauthenticate.decodeToken, customerController.crear_venta_cliente);

api.get('/obtener_informacion_venta/:id', cauthenticate.decodeToken, customerController.obtener_informacion_venta);
api.get('/obtener_ventas_cliente', cauthenticate.decodeToken, customerController.obtener_ventas_cliente);
api.post('/registrar_review_cliente', cauthenticate.decodeToken, customerController.registrar_review_cliente);

// ── PERFIL ──────────────────────────────────────────────────────────────────
var uploadAvatar = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB máximo para avatares
    fileFilter: function(req, file, cb){
        const allowed = /jpeg|jpg|png|webp/;
        cb(null, allowed.test(pathModule.extname(file.originalname).toLowerCase()));
    }
});

api.get('/obtener_perfil_cliente', cauthenticate.decodeToken, customerController.obtener_perfil_cliente);
api.put('/actualizar_perfil_cliente', cauthenticate.decodeToken, uploadAvatar.fields([{name:'avatar', maxCount:1}]), customerController.actualizar_perfil_cliente);
api.put('/cambiar_password_cliente', cauthenticate.decodeToken, customerController.cambiar_password_cliente);
api.get('/obtener_avatar_cliente/:name', customerController.obtener_avatar_cliente);

module.exports = api;