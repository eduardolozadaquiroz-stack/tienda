import SocketIO from 'socket.io-client';

const socket = SocketIO(process.env.VUE_APP_API_URL || 'http://localhost:4201', { transports: ['polling', 'websocket'] });

export const socketPlugin = {
    install(app) {
        app.config.globalProperties.$socket = socket;
        // Compatibilidad con vue-socket.io: this.sockets.subscribe()
        app.config.globalProperties.sockets = {
            subscribe(event, callback) {
                socket.on(event, callback);
            },
            unsubscribe(event, callback) {
                if (callback) socket.off(event, callback);
                else socket.off(event);
            }
        };
    }
};

export default socket;
