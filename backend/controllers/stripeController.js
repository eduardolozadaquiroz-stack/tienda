const Stripe = require('stripe');
const logger = require('../helpers/logger');

function getStripe() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY no está configurada en .env');
    return Stripe(key);
}

/**
 * GET /api/stripe_publishable_key
 * Devuelve la clave publicable de Stripe al frontend (no es secreta).
 */
const get_publishable_key = function(req, res) {
    const key = process.env.STRIPE_PUBLISHABLE_KEY;
    if (!key) return res.status(500).send({ message: 'STRIPE_PUBLISHABLE_KEY no configurada.' });
    res.status(200).send({ publishable_key: key });
};

/**
 * POST /api/crear_payment_intent
 * Crea un PaymentIntent en Stripe y devuelve el clientSecret al frontend.
 * El frontend usa ese clientSecret para confirmar el pago con Stripe.js.
 */
const crear_payment_intent = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'ErrorToken' });

    const { amount, direccion } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).send({ message: 'Monto inválido.' });
    }
    if (!direccion) {
        return res.status(400).send({ message: 'Dirección requerida.' });
    }

    try {
        const stripe = getStripe();
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe usa centavos
            currency: 'mxn',
            metadata: {
                clienteId: req.user.sub,
                direccion: direccion.toString()
            },
            automatic_payment_methods: { enabled: true }
        });

        logger.info('STRIPE_PAYMENT_INTENT_CREATED', {
            clienteId: req.user.sub,
            paymentIntentId: paymentIntent.id,
            amount
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
            payment_intent_id: paymentIntent.id,
            direccion
        });
    } catch (error) {
        logger.error('STRIPE_PAYMENT_INTENT_ERROR', { error: error.message, clienteId: req.user.sub });
        res.status(500).send({ message: 'No se pudo iniciar el pago.', detail: error.message });
    }
};

/**
 * GET /api/verificar_pago_stripe/:payment_intent_id
 * Verifica el estado del PaymentIntent en Stripe.
 */
const verificar_pago_stripe = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'ErrorToken' });

    const { payment_intent_id } = req.params;
    if (!payment_intent_id) return res.status(400).send({ message: 'ID de pago requerido.' });

    try {
        const stripe = getStripe();
        const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

        logger.info('STRIPE_PAYMENT_VERIFIED', {
            clienteId: req.user.sub,
            paymentIntentId: paymentIntent.id,
            status: paymentIntent.status
        });

        res.status(200).send({
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            direccion: paymentIntent.metadata?.direccion || null
        });
    } catch (error) {
        logger.error('STRIPE_PAYMENT_VERIFY_ERROR', { error: error.message, clienteId: req.user.sub });
        res.status(500).send({ message: 'No se pudo verificar el pago.', detail: error.message });
    }
};

module.exports = { get_publishable_key, crear_payment_intent, verificar_pago_stripe };
