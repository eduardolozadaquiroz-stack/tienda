var Review = require('../models/review');
var logger = require('../helpers/logger');

const listar_reviews_admin = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'Sin autorización' });
    try {
        const page  = Math.max(1, parseInt(req.query.page)  || 1);
        const limit = Math.min(50, parseInt(req.query.limit) || 20);
        const skip  = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            Review.find()
                .populate('producto', 'titulo portada')
                .populate('cliente', 'nombres apellidos email')
                .sort({ createdAt: -1 })
                .skip(skip).limit(limit).lean(),
            Review.countDocuments()
        ]);
        res.status(200).send({ data: reviews, total, page, pages: Math.ceil(total / limit) });
    } catch (e) {
        logger.error('ERROR_LISTAR_REVIEWS_ADMIN', { error: e.message });
        res.status(500).send({ message: 'Error del servidor' });
    }
};

const eliminar_review_admin = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'Sin autorización' });
    if (req.user.rol !== 'admin' && req.user.rol !== 'Administrador' && !req.user.rol?.toLowerCase().includes('admin')) {
        return res.status(403).send({ message: 'Sin permisos' });
    }
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).send({ message: 'Reseña no encontrada' });
        logger.info('REVIEW_ELIMINADA_ADMIN', { adminId: req.user.sub, reviewId: req.params.id });
        res.status(200).send({ message: 'Reseña eliminada correctamente' });
    } catch (e) {
        logger.error('ERROR_ELIMINAR_REVIEW', { error: e.message });
        res.status(500).send({ message: 'Error del servidor' });
    }
};

module.exports = { listar_reviews_admin, eliminar_review_admin };
