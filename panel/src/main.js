import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Notifications from '@kyvg/vue3-notification'
import { createBootstrap } from 'bootstrap-vue-next'
import { io } from 'socket.io-client'
import axios from 'axios'

// Interceptor global: si el backend responde 401 o 403, limpiar sesión y redirigir al login
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      store.dispatch('logout');
      router.push('/');
    }
    return Promise.reject(error);
  }
);

const app = createApp(App)

const socketUrl = process.env.VUE_APP_API_URL || 'http://localhost:4201';
const socket = io(socketUrl, { transports: ['websocket'] });

const panelApiUrl = socketUrl + '/api';

// $imgSrc(val, endpoint): devuelve la URL de imagen correcta.
// Si val es una URL de Cloudinary, la usa directo. Si es filename antiguo, usa el endpoint backend.
const _panelImgSrc = function(val, endpoint = 'obtener_portada_producto') {
  if (!val) return '';
  if (val.startsWith('http')) return val;
  return panelApiUrl + '/' + endpoint + '/' + val;
};

app.config.globalProperties.$url = panelApiUrl;
app.config.globalProperties.$ganancia = Number(process.env.VUE_APP_GANANCIA) || 30;
app.config.globalProperties.$socket = socket;
app.config.globalProperties.$imgSrc = _panelImgSrc;

app.use(store)
app.use(router)
app.use(Notifications)
app.use(createBootstrap())

app.mount('#app')
