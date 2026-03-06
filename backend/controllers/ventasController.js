var Venta = require('../models/venta');
var Venta_detalle = require('../models/venta_detalle');
var logger = require('../helpers/logger');

const ESTADOS_VALIDOS = ['PENDIENTE', 'EN_CAMINO', 'COMPLETADO', 'CANCELADO'];

const obtener_ventas_admin = async function(req, res) {
    if (req.user) {
        let inicio = req.params['inicio'];
        let hasta = req.params['hasta'];

        var ventas = await Venta.find({
            createdAt: {
                $gte: new Date(inicio + 'T00:00:00'),
                $lt: new Date(hasta + 'T00:00:00'),
            }
        });
        res.status(200).send(ventas);
    } else {
        res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
}

const obtener_detalles_venta_admin = async function(req, res) {
    if (req.user) {
        let id = req.params['id'];

        var venta = await Venta.findById(id).populate('cliente');
        var detalles = await Venta_detalle.find({ venta: id }).populate('producto').populate('variedad');
        res.status(200).send({ venta, detalles });
    } else {
        res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
}



const actualizar_estado_venta_admin = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'Sin autorización' });
    const { id } = req.params;
    const { estado } = req.body;
    if (!ESTADOS_VALIDOS.includes(estado)) {
        return res.status(400).send({ message: 'Estado no válido. Use: ' + ESTADOS_VALIDOS.join(', ') });
    }
    try {
        const venta = await Venta.findByIdAndUpdate(id, { estado }, { new: true });
        if (!venta) return res.status(404).send({ message: 'Venta no encontrada' });
        logger.info('VENTA_ESTADO_ACTUALIZADO', { adminId: req.user.sub, ventaId: id, estado });
        res.status(200).send(venta);
    } catch (e) {
        res.status(500).send({ message: 'Error al actualizar estado' });
    }
};

const resumen_ventas_admin = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'Sin autorización' });
    try {
        const ahora = new Date();
        const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        const [totalMes, pendientes, enCamino, completadas, canceladas, ingresoMes] = await Promise.all([
            Venta.countDocuments({ createdAt: { $gte: inicioMes } }),
            Venta.countDocuments({ createdAt: { $gte: inicioMes }, estado: 'PENDIENTE' }),
            Venta.countDocuments({ createdAt: { $gte: inicioMes }, estado: 'EN_CAMINO' }),
            Venta.countDocuments({ createdAt: { $gte: inicioMes }, estado: 'COMPLETADO' }),
            Venta.countDocuments({ createdAt: { $gte: inicioMes }, estado: 'CANCELADO' }),
            Venta.aggregate([
                { $match: { createdAt: { $gte: inicioMes }, estado: { $ne: 'CANCELADO' } } },
                { $group: { _id: null, total: { $sum: { $add: ['$total', '$envio'] } } } }
            ])
        ]);
        // ventas por día últimos 30 días para gráfica
        const hace30 = new Date(ahora); hace30.setDate(hace30.getDate() - 29);
        const porDia = await Venta.aggregate([
            { $match: { createdAt: { $gte: hace30 }, estado: { $ne: 'CANCELADO' } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: { $add: ['$total', '$envio'] } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        res.status(200).send({
            totalMes, pendientes, enCamino, completadas, canceladas,
            ingresoMes: ingresoMes[0]?.total || 0,
            porDia
        });
    } catch (e) {
        res.status(500).send({ message: 'Error al obtener resumen' });
    }
};

module.exports = {
    obtener_ventas_admin,
    obtener_detalles_venta_admin,
    actualizar_estado_venta_admin,
    resumen_ventas_admin
}