var Cupon  = require('../models/cupon');
var logger = require('../helpers/logger');

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** GET /listar_cupones_admin */
const listar_cupones_admin = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'Sin autorización' });
    try {
        const cupones = await Cupon.find().sort({ createdAt: -1 }).lean();
        res.status(200).send(cupones);
    } catch (e) {
        logger.error('ERROR_LISTAR_CUPONES', { error: e.message });
        res.status(500).send({ message: 'Error del servidor' });
    }
};

/** POST /crear_cupon_admin */
const crear_cupon_admin = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'Sin autorización' });
    const { codigo, tipo, valor, minimo_compra, limite_usos, expira } = req.body;
    if (!codigo || !tipo || valor === undefined) {
        return res.status(400).send({ message: 'Faltan campos obligatorios: codigo, tipo, valor' });
    }
    try {
        const existe = await Cupon.findOne({ codigo: String(codigo).toUpperCase() });
        if (existe) return res.status(400).send({ message: 'El código de cupón ya existe' });

        const cupon = await Cupon.create({
            codigo:        String(codigo).toUpperCase().trim(),
            tipo,
            valor:         Number(valor),
            minimo_compra: Number(minimo_compra) || 0,
            limite_usos:   Number(limite_usos) || -1,
            expira:        expira || null
        });
        logger.info('CUPON_CREADO', { adminId: req.user.sub, codigo: cupon.codigo });
        res.status(200).send({ data: cupon, message: 'Cupón creado correctamente' });
    } catch (e) {
        logger.error('ERROR_CREAR_CUPON', { error: e.message });
        res.status(500).send({ message: 'Error del servidor' });
    }
};

/** PUT /toggle_cupon_admin/:id */
const toggle_cupon_admin = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'Sin autorización' });
    try {
        const cupon = await Cupon.findById(req.params.id);
        if (!cupon) return res.status(404).send({ message: 'Cupón no encontrado' });
        cupon.activo = !cupon.activo;
        await cupon.save();
        res.status(200).send({ activo: cupon.activo, message: `Cupón ${cupon.activo ? 'activado' : 'desactivado'}` });
    } catch (e) {
        logger.error('ERROR_TOGGLE_CUPON', { error: e.message });
        res.status(500).send({ message: 'Error del servidor' });
    }
};

/** DELETE /eliminar_cupon_admin/:id */
const eliminar_cupon_admin = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'Sin autorización' });
    try {
        const cupon = await Cupon.findByIdAndDelete(req.params.id);
        if (!cupon) return res.status(404).send({ message: 'Cupón no encontrado' });
        logger.info('CUPON_ELIMINADO', { adminId: req.user.sub, codigo: cupon.codigo });
        res.status(200).send({ message: 'Cupón eliminado' });
    } catch (e) {
        logger.error('ERROR_ELIMINAR_CUPON', { error: e.message });
        res.status(500).send({ message: 'Error del servidor' });
    }
};

/**
 * POST /validar_cupon  (público — usado por el storefront)
 * body: { codigo, total }
 * Devuelve: { valido, descuento, tipo, valor, message }
 */
const validar_cupon = async function(req, res) {
    const { codigo, total } = req.body;
    if (!codigo) return res.status(400).send({ valido: false, message: 'Ingresa un código de cupón' });
    try {
        const cupon = await Cupon.findOne({ codigo: String(codigo).toUpperCase() });
        if (!cupon)        return res.status(200).send({ valido: false, message: 'Cupón no encontrado' });
        if (!cupon.activo) return res.status(200).send({ valido: false, message: 'Este cupón no está activo' });
        if (cupon.expira && new Date() > new Date(cupon.expira))
            return res.status(200).send({ valido: false, message: 'Este cupón ha expirado' });
        if (cupon.limite_usos > 0 && cupon.usos >= cupon.limite_usos)
            return res.status(200).send({ valido: false, message: 'Este cupón alcanzó su límite de usos' });
        if (cupon.minimo_compra > 0 && Number(total) < cupon.minimo_compra)
            return res.status(200).send({ valido: false, message: `El mínimo de compra es $${cupon.minimo_compra}` });

        const descuento = cupon.tipo === 'porcentaje'
            ? Math.min(Number(total) * (cupon.valor / 100), Number(total))
            : Math.min(cupon.valor, Number(total));

        res.status(200).send({ valido: true, descuento: Math.round(descuento * 100) / 100, tipo: cupon.tipo, valor: cupon.valor, codigo: cupon.codigo });
    } catch (e) {
        res.status(500).send({ valido: false, message: 'Error del servidor' });
    }
};

module.exports = {
    listar_cupones_admin,
    crear_cupon_admin,
    toggle_cupon_admin,
    eliminar_cupon_admin,
    validar_cupon
};
