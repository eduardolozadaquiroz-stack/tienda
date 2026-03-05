import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  {path: '/login',name: 'login',component: ()=> import('@/views/LoginApp.vue')},
  {path: '/shop',name: 'shop',component: ()=> import('@/views/productos/IndexProductoApp.vue')},
  {path: '/cart',name: 'cart',component: ()=> import('@/views/CarritoView.vue')},
  {path: '/producto/:slug',name: 'show-producto',component: ()=> import('@/views/productos/ShowProductoApp.vue')},

  //////////////////////////////////////////////////////////////////////////

  {path: '/cuenta/perfil',name: 'perfil',component: ()=> import('@/views/cuenta/PerfilApp.vue')},
  {path: '/cuenta/direcciones',name: 'direcciones',component: ()=> import('@/views/cuenta/DireccionesApp.vue')},
  {path: '/checkout',name: 'checkout',component: ()=> import('@/views/CheckoutView.vue')},
  {path: '/verificacion/:estado/:direccion?',name: 'verificacion',component: ()=> import('@/views/VerificacionView.vue')},
  {path: '/cuenta/venta/:id',name: 'venta',component: ()=> import('@/views/cuenta/ventas/VentaDetalleApp.vue')},
  {path: '/cuenta/venta',name: 'venta-index',component: ()=> import('@/views/cuenta/ventas/VentaIndexApp.vue')},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'instant' }
  }
})

export default router
