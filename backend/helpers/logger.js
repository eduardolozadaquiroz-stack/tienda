/**
 * Logger de seguridad — OWASP #9 (Fallos de registro y supervisión)
 * Registra eventos críticos con timestamp, IP y contexto.
 * Persiste en MongoDB (colección log_seguridad) para visualización en panel admin.
 */

const LOG_LEVELS = { INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR', SECURITY: 'SECURITY' };

// Carga lazy del modelo para evitar circular dependencies al iniciar
function getLogModel() {
    try { return require('../models/log_seguridad'); } catch { return null; }
}

function formatEntry(level, event, meta = {}) {
    return JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        event,
        ...meta
    });
}

function getIp(req) {
    return (req && (req.headers['x-forwarded-for'] || req.socket?.remoteAddress)) || 'unknown';
}

function persistLog(level, event, meta = {}) {
    const LogModel = getLogModel();
    if (!LogModel) return;
    // fire-and-forget — no bloquear el request
    const { ip, userId, email, role, resource, detail, ...extra } = meta;
    LogModel.create({ level, event, ip: ip || 'unknown', userId, email, role, resource, detail, extra: Object.keys(extra).length ? extra : null })
        .catch(() => {}); // silenciar errores de BD para no interferir con la app
}

const logger = {
    info(event, meta)     { console.log(formatEntry(LOG_LEVELS.INFO,     event, meta)); persistLog(LOG_LEVELS.INFO,     event, meta); },
    warn(event, meta)     { console.warn(formatEntry(LOG_LEVELS.WARN,    event, meta)); persistLog(LOG_LEVELS.WARN,     event, meta); },
    error(event, meta)    { console.error(formatEntry(LOG_LEVELS.ERROR,  event, meta)); persistLog(LOG_LEVELS.ERROR,    event, meta); },
    security(event, meta) { console.warn(formatEntry(LOG_LEVELS.SECURITY, event, meta)); persistLog(LOG_LEVELS.SECURITY, event, meta); },

    // Atajos semánticos
    loginOk(req, userId, role)    { this.security('LOGIN_SUCCESS',  { ip: getIp(req), userId, role }); },
    loginFail(req, email)         { this.security('LOGIN_FAILURE',  { ip: getIp(req), email }); },
    accessDenied(req, resource)   { this.security('ACCESS_DENIED',  { ip: getIp(req), resource, userId: req.user?.sub }); },
    tokenInvalid(req)             { this.security('INVALID_TOKEN',  { ip: getIp(req) }); },
    suspiciousInput(req, detail)  { this.security('SUSPICIOUS_INPUT', { ip: getIp(req), detail }); },
};

module.exports = logger;
