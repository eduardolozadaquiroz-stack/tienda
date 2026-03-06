require('dotenv').config();

var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
var logger = require('./helpers/logger');
var port = process.env.PORT || 4201;
const { createServer } = require("http");
const { Server } = require("socket.io");
const socketModule = require('./socket');

var app = express();

// Render (y otras plataformas cloud) usan un proxy inverso que añade X-Forwarded-For.
// Sin esto, express-rate-limit no puede identificar IPs reales y lanza ValidationError.
app.set('trust proxy', 1);

// ── Seguridad: headers HTTP ──────────────────────────────────────
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // permite servir imágenes al frontend
    contentSecurityPolicy: false // desactivado: el backend es solo API REST
}));

const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:8080', 'http://localhost:8081'];

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: allowedOrigins }
});
socketModule.setIo(io);

io.on("connection", (socket) => {
    socket.on('send_cart', function(data) {
        io.emit('listen_cart', data);
    });
});

var cliente_router = require('./routes/cliente');
var usuario_router = require('./routes/usuario');
var producto_router = require('./routes/producto');
var public_router = require('./routes/public');
var customer_router = require('./routes/customer');
var venta_router = require('./routes/venta');
var mercadopago_router = require('./routes/mercadopago');

// Rate limiter para login — 5 intentos en 15 min (luego la cuenta se bloquea en BD)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Demasiados intentos de inicio de sesión. Espera 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false
});

// Rate limiter general para toda la API
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 120,
    message: { message: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.' },
    standardHeaders: true,
    legacyHeaders: false
});

mongoose.set('strictQuery', true);

// Límite razonable — 50mb permite ataques DoS
app.use(bodyparser.urlencoded({ limit: '5mb', extended: true }));
app.use(bodyparser.json({ limit: '5mb', extended: true }));

// En producción, MONGODB_URI debe estar definida en .env — sin fallback para evitar
// que en producción conecte silenciosamente a un MongoDB local inexistente.
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
    console.error('ERROR FATAL: La variable MONGODB_URI no está definida en .env');
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => {
        httpServer.listen(port, () => {
            console.log('Servidor corriendo en puerto ' + port);
        });
    })
    .catch((err) => {
        console.log(err);
    });

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS');
    // Responder al preflight CORS con 204 para que el navegador permita la petición real
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    next();
});

app.use('/api/login_usuario', loginLimiter);
app.use('/api/login_cliente', loginLimiter);

// Rate limiting general en toda la API
app.use('/api', apiLimiter);

app.use('/api', cliente_router);
app.use('/api', usuario_router);
app.use('/api', producto_router);
app.use('/api', public_router);
app.use('/api', customer_router);
app.use('/api', venta_router);
app.use('/api', mercadopago_router);

// OWASP #5: Protección contra parámetros no esperados — bloquear rutas no definidas
app.use((req, res, next) => {
    res.status(404).send({ message: 'Ruta no encontrada.' });
});

// OWASP #9: Middleware global de manejo de errores con logging
app.use((err, req, res, next) => {
    logger.error('UNHANDLED_ERROR', {
        method: req.method,
        url: req.originalUrl,
        error: err.message,
        status: err.status || 500
    });
    // OWASP #5: no exponer stacktrace en producción
    const isProd = process.env.NODE_ENV === 'production';
    res.status(err.status || 500).send({
        message: isProd ? 'Error interno del servidor' : (err.message || 'Error interno del servidor')
    });
});

module.exports = app;
