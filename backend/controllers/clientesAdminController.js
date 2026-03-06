var Cliente = require('../models/cliente');
var Venta   = require('../models/venta');
var logger  = require('../helpers/logger');

/**
 * Lista todos los clientes con estadísticas básicas.
 * GET /listar_clientes_admin?page=1&limit=20&q=busqueda
 */
const listar_clientes_admin = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'Sin autorización' });

    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    let filtro = {};
    if (req.query.q) {
        const esc = req.query.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const rx  = new RegExp(esc, 'i');
        filtro = { $or: [{ nombres: rx }, { apellidos: rx }, { email: rx }] };
    }

    try {
        const [clientes, total] = await Promise.all([
            Cliente.find(filtro).select('+login_intentos +login_bloqueado_hasta')
                   .sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Cliente.countDocuments(filtro)
        ]);

        // Agregar conteo de ventas por cliente (batch)
        const ids = clientes.map(c => c._id);
        const ventasPorCliente = await Venta.aggregate([
            { $match: { cliente: { $in: ids } } },
            { $group: { _id: '$cliente', total: { $sum: 1 }, ultima: { $max: '$createdAt' } } }
        ]);
        const ventasMap = {};
        ventasPorCliente.forEach(v => { ventasMap[String(v._id)] = v; });

        const data = clientes.map(c => ({
            ...c,
            total_ventas: ventasMap[String(c._id)]?.total || 0,
            ultima_compra: ventasMap[String(c._id)]?.ultima || null,
            bloqueado: c.login_bloqueado_hasta && c.login_bloqueado_hasta > new Date()
        }));

        res.status(200).send({ data, total, page, pages: Math.ceil(total / limit) });
    } catch (e) {
        logger.error('ERROR_LISTAR_CLIENTES_ADMIN', { error: e.message });
        res.status(500).send({ message: 'Error del servidor' });
    }
};

/**
 * Clientes sospechosos: bloqueados actualmente o con muchos intentos fallidos.
 * GET /clientes_sospechosos_admin
 */
const clientes_sospechosos_admin = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'Sin autorización' });
    try {
        const ahora = new Date();
        const clientes = await Cliente.find({
            $or: [
                { login_bloqueado_hasta: { $gt: ahora } },
                { login_intentos: { $gte: 3 } }
            ]
        }).select('+login_intentos +login_bloqueado_hasta').sort({ login_intentos: -1 }).limit(100).lean();

        res.status(200).send(clientes.map(c => ({
            ...c,
            bloqueado: c.login_bloqueado_hasta && c.login_bloqueado_hasta > ahora
        })));
    } catch (e) {
        logger.error('ERROR_CLIENTES_SOSPECHOSOS', { error: e.message });
        res.status(500).send({ message: 'Error del servidor' });
    }
};

/**
 * Desbloquear manualmente un cliente bloqueado.
 * PUT /desbloquear_cliente_admin/:id
 */
const desbloquear_cliente_admin = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'Sin autorización' });
    try {
        const cliente = await Cliente.findByIdAndUpdate(
            req.params.id,
            { login_intentos: 0, login_bloqueado_hasta: null },
            { new: true }
        ).lean();
        if (!cliente) return res.status(404).send({ message: 'Cliente no encontrado' });
        logger.info('CLIENTE_DESBLOQUEADO_ADMIN', { adminId: req.user.sub, clienteId: req.params.id });
        res.status(200).send({ message: 'Cliente desbloqueado correctamente' });
    } catch (e) {
        logger.error('ERROR_DESBLOQUEAR_CLIENTE', { error: e.message });
        res.status(500).send({ message: 'Error del servidor' });
    }
};

module.exports = {
    listar_clientes_admin,
    clientes_sospechosos_admin,
    desbloquear_cliente_admin
};
