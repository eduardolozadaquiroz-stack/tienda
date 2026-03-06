var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogSeguridadSchema = Schema({
    level:     { type: String, required: true },  // INFO | WARN | ERROR | SECURITY
    event:     { type: String, required: true },  // LOGIN_SUCCESS | LOGIN_FAILURE | etc.
    ip:        { type: String, default: 'unknown' },
    userId:    { type: String, default: null },
    email:     { type: String, default: null },
    role:      { type: String, default: null },
    resource:  { type: String, default: null },
    detail:    { type: String, default: null },
    extra:     { type: Schema.Types.Mixed, default: null },
    createdAt: { type: Date, default: Date.now, index: true }
});

// TTL: borrar logs con más de 90 días para no llenar la BD
LogSeguridadSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

module.exports = mongoose.model('log_seguridad', LogSeguridadSchema);
