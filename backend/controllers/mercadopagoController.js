/**
 * MercadoPago Controller
 * Toda la comunicación con la API de MercadoPago ocurre en el servidor.
 * El Access Token NUNCA se expone al frontend. (OWASP #2 / #5)
 */
const axios = require('axios');
const logger = require('../helpers/logger');

const MP_BASE = 'https://api.mercadopago.com';

// El token se lee SOLO desde variables de entorno — jamás desde el código
function getToken() {
    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) {
        throw new Error('MP_ACCESS_TOKEN no está configurado en .env');
    }
    return token;
}

/**
 * POST /api/crear_preferencia_mp
 * Recibe los items y back_urls desde el frontend (autenticado),
 * crea la preferencia en MercadoPago y devuelve solo el init_point.
 */
const crear_preferencia = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'ErrorToken' });

    const { items, direccion } = req.body;

    // Validar que vengan items y una dirección
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).send({ message: 'Se requieren items para crear la preferencia.' });
    }
    if (!direccion) {
        return res.status(400).send({ message: 'Se requiere una dirección de entrega.' });
    }

    // Validar que cada item tenga los campos mínimos y valores numéricos positivos
    for (const item of items) {
        if (!item.title || typeof item.unit_price !== 'number' || item.unit_price <= 0
            || typeof item.quantity !== 'number' || item.quantity <= 0) {
            return res.status(400).send({ message: 'Formato de items inválido.' });
        }
    }

    const STORE_URL = process.env.STORE_URL || 'https://oversizemx.pages.dev';

    // Cuotas máximas (puedes cambiar a 3, 6, 12, 18 o 24)
    const MAX_CUOTAS = parseInt(process.env.MP_MAX_CUOTAS) || 3;

    const payload = {
        items,
        back_urls: {
            success: `${STORE_URL}/verificacion/success/${direccion}`,
            pending: `${STORE_URL}/verificacion/pending`,
            failure: `${STORE_URL}/verificacion/failure`
        },
        auto_return: 'approved',
        // Solo tarjetas de crédito y débito — excluye efectivo y transferencias
        payment_methods: {
            excluded_payment_types: [
                { id: 'ticket' },       // OXXO y similares
                { id: 'atm' },          // cajeros
                { id: 'bank_transfer' } // SPEI
            ],
            installments: MAX_CUOTAS   // máximo de meses sin intereses a mostrar
        }
    };

    try {
        const { data } = await axios.post(`${MP_BASE}/checkout/preferences`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            timeout: 10000
        });

        logger.info('MP_PREFERENCE_CREATED', { clienteId: req.user.sub, preferenceId: data.id });

        // Solo devolver el init_point al frontend — nunca el objeto completo de MP
        res.status(200).send({
            init_point: data.init_point,
            sandbox_init_point: data.sandbox_init_point
        });
    } catch (error) {
        logger.error('MP_PREFERENCE_ERROR', { error: error.message, clienteId: req.user.sub });
        res.status(500).send({ message: 'No se pudo crear la preferencia de pago.' });
    }
};

/**
 * GET /api/verificar_pago_mp/:payment_id
 * Verifica en MercadoPago si el pago fue aprobado.
 * El frontend nunca habla directamente con MP.
 */
const verificar_pago = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'ErrorToken' });

    const { payment_id } = req.params;

    // Validar formato básico del payment_id (solo dígitos)
    if (!payment_id || !/^\d+$/.test(payment_id)) {
        logger.suspiciousInput(req, `payment_id inválido: ${payment_id}`);
        return res.status(400).send({ message: 'payment_id inválido.' });
    }

    try {
        const { data } = await axios.get(`${MP_BASE}/v1/payments/${payment_id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            timeout: 10000
        });

        logger.info('MP_PAYMENT_VERIFIED', {
            clienteId: req.user.sub,
            paymentId: payment_id,
            status: data.status
        });

        // Solo devolver lo estrictamente necesario — sin datos sensibles del pagador
        res.status(200).send({
            status: data.status,           // 'approved', 'pending', 'rejected'
            payment_id: data.id,
            transaction_amount: data.transaction_amount,
            currency_id: data.currency_id
        });
    } catch (error) {
        const status = error.response?.status;
        if (status === 404) {
            return res.status(404).send({ message: 'Pago no encontrado.' });
        }
        logger.error('MP_VERIFY_ERROR', { error: error.message, clienteId: req.user.sub, paymentId: payment_id });
        res.status(500).send({ message: 'No se pudo verificar el pago.' });
    }
};

module.exports = { crear_preferencia, verificar_pago };
