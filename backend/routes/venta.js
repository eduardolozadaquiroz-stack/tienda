var express = require('express');
var ventasController = require('../controllers/ventasController');
var clientesAdminController = require('../controllers/clientesAdminController');
var logsAdminController = require('../controllers/logsAdminController');
var authenticate = require('../middlewares/authenticate');
var api = express.Router();

api.get('/obtener_ventas_admin/:inicio/:hasta', authenticate.decodeToken, ventasController.obtener_ventas_admin);
api.get('/obtener_detalles_venta_admin/:id', authenticate.decodeToken, ventasController.obtener_detalles_venta_admin);

// Clientes (gestión admin)
api.get('/listar_clientes_admin', authenticate.decodeToken, clientesAdminController.listar_clientes_admin);
api.get('/clientes_sospechosos_admin', authenticate.decodeToken, clientesAdminController.clientes_sospechosos_admin);
api.put('/desbloquear_cliente_admin/:id', authenticate.decodeToken, clientesAdminController.desbloquear_cliente_admin);

// Logs de seguridad
api.get('/logs_seguridad_admin', authenticate.decodeToken, logsAdminController.listar_logs_admin);
api.get('/resumen_logs_admin', authenticate.decodeToken, logsAdminController.resumen_logs_admin);

module.exports = api;

module.exports = api;