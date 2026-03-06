import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '@/store/index'

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

const routes = [
  { path: '/', name: 'home', component: HomeView },
  {path: '/login',name: 'login',component: ()=> import('@/views/LoginApp.vue')},
  {path: '/shop',name: 'shop',component: ()=> import('@/views/productos/IndexProductoApp.vue')},
  {path: '/cart',name: 'cart',component: ()=> import('@/views/CarritoView.vue')},
  {path: '/producto/:slug',name: 'show-producto',component: ()=> import('@/views/productos/ShowProductoApp.vue')},

  //////////////////////////////////////////////////////////////////////////

  {path: '/cuenta/perfil',name: 'perfil',component: ()=> import('@/views/cuenta/PerfilApp.vue'), meta: { requiresAuth: true }},
  {path: '/cuenta/direcciones',name: 'direcciones',component: ()=> import('@/views/cuenta/DireccionesApp.vue'), meta: { requiresAuth: true }},
  {path: '/checkout',name: 'checkout',component: ()=> import('@/views/CheckoutView.vue'), meta: { requiresAuth: true }},
  {path: '/verificacion/:estado/:direccion?',name: 'verificacion',component: ()=> import('@/views/VerificacionView.vue'), meta: { requiresAuth: true }},
  {path: '/cuenta/venta/:id',name: 'venta',component: ()=> import('@/views/cuenta/ventas/VentaDetalleApp.vue'), meta: { requiresAuth: true }},
  {path: '/cuenta/venta',name: 'venta-index',component: ()=> import('@/views/cuenta/ventas/VentaIndexApp.vue'), meta: { requiresAuth: true }},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'instant' }
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(item => item.meta.requiresAuth)) {
    const token = store.state.token
    if (!token) {
      return next({ name: 'login' })
    }
    const decoded = parseJwt(token)
    if (!decoded || decoded.exp * 1000 <= Date.now()) {
      store.dispatch('logout')
      return next({ name: 'login' })
    }
    return next()
  }
  return next()
})

export default router

