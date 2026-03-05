import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createBootstrap } from 'bootstrap-vue-next'
import { socketPlugin } from './plugins/socket'

const app = createApp(App)

app.config.globalProperties.$envio = 50;
app.config.globalProperties.$paises = ['México'];
app.config.globalProperties.$url = (process.env.VUE_APP_API_URL || 'http://localhost:4201') + '/api';
// Nota: $token se obtiene siempre del store para mantenerse actualizado

app.use(store)
app.use(router)
app.use(createBootstrap())
app.use(socketPlugin)

app.mount('#app')
