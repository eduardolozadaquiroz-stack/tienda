var express = require('express');
var cauthenticate = require('../middlewares/cauthenticate');
var stripeController = require('../controllers/stripeController');

var api = express.Router();

api.get('/stripe_publishable_key', stripeController.get_publishable_key);
api.post('/crear_payment_intent', cauthenticate.decodeToken, stripeController.crear_payment_intent);
api.get('/verificar_pago_stripe/:payment_intent_id', cauthenticate.decodeToken, stripeController.verificar_pago_stripe);

module.exports = api;
