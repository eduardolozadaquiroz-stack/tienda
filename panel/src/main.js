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

app.config.globalProperties.$url = socketUrl + '/api';
// $ganancia: margen comercial configurable vía VUE_APP_GANANCIA en .env
app.config.globalProperties.$ganancia = Number(process.env.VUE_APP_GANANCIA) || 30;
app.config.globalProperties.$socket = socket;

app.use(store)
app.use(router)
app.use(Notifications)
app.use(createBootstrap())

app.mount('#app')
