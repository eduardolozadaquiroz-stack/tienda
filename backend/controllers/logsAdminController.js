var LogSeguridad = require('../models/log_seguridad');
var logger = require('../helpers/logger');

/**
 * Retorna los logs de seguridad recientes.
 * GET /logs_seguridad_admin?page=1&limit=50&level=SECURITY&event=LOGIN_FAILURE
 */
const listar_logs_admin = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'Sin autorización' });

    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(200, parseInt(req.query.limit) || 50);
    const skip  = (page - 1) * limit;

    let filtro = {};
    if (req.query.level) filtro.level = req.query.level;
    if (req.query.event) {
        const esc = req.query.event.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filtro.event = new RegExp(esc, 'i');
    }
    if (req.query.ip) {
        const esc = req.query.ip.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filtro.ip = new RegExp(esc, 'i');
    }

    try {
        const [logs, total] = await Promise.all([
            LogSeguridad.find(filtro).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            LogSeguridad.countDocuments(filtro)
        ]);
        res.status(200).send({ data: logs, total, page, pages: Math.ceil(total / limit) });
    } catch (e) {
        logger.error('ERROR_LISTAR_LOGS', { error: e.message });
        res.status(500).send({ message: 'Error del servidor' });
    }
};

/**
 * Resumen de eventos de seguridad de las últimas 24h.
 * GET /resumen_logs_admin
 */
const resumen_logs_admin = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'Sin autorización' });
    try {
        const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const resumen = await LogSeguridad.aggregate([
            { $match: { createdAt: { $gte: hace24h } } },
            { $group: { _id: { level: '$level', event: '$event' }, count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.status(200).send(resumen);
    } catch (e) {
        res.status(500).send({ message: 'Error del servidor' });
    }
};

module.exports = { listar_logs_admin, resumen_logs_admin };
