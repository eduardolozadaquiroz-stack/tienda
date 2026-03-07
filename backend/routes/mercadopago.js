var express = require('express');
var cauthenticate = require('../middlewares/cauthenticate');
var mpController = require('../controllers/mercadopagoController');

var api = express.Router();

// Public key — no requiere auth (la Public Key no es secreta)
api.get('/mp_public_key', mpController.get_public_key);

// Rutas que requieren que el cliente esté autenticado
api.post('/crear_preferencia_mp', cauthenticate.decodeToken, mpController.crear_preferencia);
api.get('/verificar_pago_mp/:payment_id', cauthenticate.decodeToken, mpController.verificar_pago);
api.post('/procesar_pago_mp', cauthenticate.decodeToken, mpController.procesar_pago);

module.exports = api;
