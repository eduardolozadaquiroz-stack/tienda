var express       = require('express');
var cuponController = require('../controllers/cuponController');
var authenticate  = require('../middlewares/authenticate');
var api = express.Router();

// Admin
api.get('/listar_cupones_admin',        authenticate.decodeToken, cuponController.listar_cupones_admin);
api.post('/crear_cupon_admin',          authenticate.decodeToken, cuponController.crear_cupon_admin);
api.put('/toggle_cupon_admin/:id',      authenticate.decodeToken, cuponController.toggle_cupon_admin);
api.delete('/eliminar_cupon_admin/:id', authenticate.decodeToken, cuponController.eliminar_cupon_admin);

// Público — validar cupón desde el storefront
api.post('/validar_cupon', cuponController.validar_cupon);

module.exports = api;
