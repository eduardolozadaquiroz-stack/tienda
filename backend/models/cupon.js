var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CuponSchema = Schema({
    codigo      : { type: String, required: true, uppercase: true, trim: true },
    tipo        : { type: String, required: true, enum: ['porcentaje', 'fijo'] },
    valor       : { type: Number, required: true, min: 0 },
    minimo_compra : { type: Number, default: 0 },
    limite_usos : { type: Number, default: -1 },   // -1 = ilimitado
    usos        : { type: Number, default: 0 },
    activo      : { type: Boolean, default: true },
    expira      : { type: Date, default: null },
    createdAt   : { type: Date, default: Date.now }
});

module.exports = mongoose.model('cupon', CuponSchema);
