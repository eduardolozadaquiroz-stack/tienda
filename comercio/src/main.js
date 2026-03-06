import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createBootstrap } from 'bootstrap-vue-next'
import { socketPlugin } from './plugins/socket'
import { createHead } from '@vueuse/head'

const head = createHead()

const app = createApp(App)

app.config.globalProperties.$envio = 50;
app.config.globalProperties.$paises = ['México'];
const apiUrl = (process.env.VUE_APP_API_URL || 'http://localhost:4201') + '/api';
// Nota: $token se obtiene siempre del store para mantenerse actualizado

// $imgSrc(val, endpoint): devuelve la URL de imagen correcta.
// Si val es una URL de Cloudinary (empieza con http), la usa directo.
// Si es un filename antiguo, construye la URL del endpoint backend.
const _imgSrc = function(val, endpoint = 'obtener_portada_producto') {
  if (!val) return '';
  if (val.startsWith('http')) return val;
  return apiUrl + '/' + endpoint + '/' + val;
};

app.config.globalProperties.$url = apiUrl;
app.config.globalProperties.$imgSrc = _imgSrc;

app.use(store)
app.use(router)
app.use(createBootstrap())
app.use(socketPlugin)
app.use(head)

app.mount('#app')
