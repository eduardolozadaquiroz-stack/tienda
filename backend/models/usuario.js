var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    nombres : {type: String, required: true},
    apellidos : {type: String, required: true},
    email : {type: String, required: true, unique : true},
    rol : {type: String, required: true},
    password : {type: String, required: true, select: false},
    avatar : {type: String, default: ''},
    estado : {type: Boolean, default: true, required: true},
    // Control de intentos fallidos y bloqueo temporal
    login_intentos : {type: Number, default: 0, select: false},
    login_bloqueado_hasta : {type: Date, default: null, select: false},
    createdAt: {type: Date, default: Date.now}
});
module.exports = mongoose.model('usuario', UsuarioSchema);