var express = require('express');
var cauthenticate = require('../middlewares/cauthenticate');
var mpController = require('../controllers/mercadopagoController');

var api = express.Router();

// Ambas rutas requieren que el cliente esté autenticado
api.post('/crear_preferencia_mp', cauthenticate.decodeToken, mpController.crear_preferencia);
api.get('/verificar_pago_mp/:payment_id', cauthenticate.decodeToken, mpController.verificar_pago);

module.exports = api;
