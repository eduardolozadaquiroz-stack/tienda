// Módulo singleton para compartir la instancia de Socket.IO entre controladores
let _io = null;

module.exports = {
    setIo(io) { _io = io; },
    getIo()    { return _io; }
};
