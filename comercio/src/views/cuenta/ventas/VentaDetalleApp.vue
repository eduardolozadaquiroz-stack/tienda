<template>
  <div>
    <!-- Loading -->
    <div v-if="load_data" class="vd-loading">
      <img src="/assets/media/reloj.gif" style="width:70px">
    </div>

    <div v-if="!load_data">
      <!-- Sin acceso -->
      <div v-if="!acceso" class="vd-noaccess">
        <h2>No tienes acceso a esta orden</h2>
        <router-link to="/" class="vd-btn-back">Volver al inicio</router-link>
      </div>

      <!-- Con acceso -->
      <div v-if="acceso" class="vd-page">
        <div class="vd-container">

          <!-- Header de la orden -->
          <div class="vd-header">
            <div class="vd-breadcrumb">
              <router-link to="/">Inicio</router-link>
              <span>/</span>
              <router-link to="/cuenta/ventas">Mis pedidos</router-link>
              <span>/</span>
              <span>Orden #{{ venta.serie.toString().padStart(6,'000000') }}</span>
            </div>
            <h1 class="vd-order-title">Orden #{{ venta.serie.toString().padStart(6,'000000') }}</h1>
            <div class="vd-order-meta">
              <span class="vd-badge">Preparando tu pedido</span>
              <span class="vd-date">{{ convertDate(venta.createdAt) }}</span>
            </div>
          </div>

          <div class="vd-grid">
            <!-- Columna principal -->
            <div class="vd-main">

              <!-- Productos -->
              <div class="vd-card">
                <h3 class="vd-card-title">Productos</h3>
                <div v-for="item in detalles" :key="item.id" class="vd-product-row">
                  <router-link :to="{name:'show-producto', params:{slug: item.detalle.producto.slug}}" class="vd-product-img-wrap">
                    <img :src="$imgSrc(item.detalle.producto.portada)" class="vd-product-img" alt="">
                  </router-link>
                  <div class="vd-product-info">
                    <router-link :to="{name:'show-producto', params:{slug: item.detalle.producto.slug}}" class="vd-product-name">
                      {{ item.detalle.producto.titulo }}
                    </router-link>
                    <span class="vd-product-variedad">{{ item.detalle.producto.str_variedad }}: {{ item.detalle.variedad.variedad }}</span>
                    <span class="vd-product-qty">Cantidad: {{ item.detalle.cantidad }}</span>
                  </div>
                  <div class="vd-product-price">
                    {{ convertCurrency(item.detalle.producto.precio * item.detalle.cantidad) }}
                  </div>
                </div>
              </div>

              <!-- Reseñas -->
              <div class="vd-card" v-for="item in detalles" :key="'review-'+item.id">
                <div v-if="item.reviews.length >= 1">
                  <h3 class="vd-card-title">Tu reseña de {{ item.detalle.producto.titulo.substr(0,30) }}</h3>
                  <div class="vd-review-stars">
                    <span v-for="n in 5" :key="n" class="vd-star" :class="{active: n <= item.reviews[0].estrellas}">★</span>
                  </div>
                  <p class="vd-review-text">{{ item.reviews[0].comentario }}</p>
                </div>
                <div v-else>
                  <h3 class="vd-card-title">¿Cómo fue tu experiencia con {{ item.detalle.producto.titulo.substr(0,30) }}?</h3>
                  <div class="vd-review-form">
                    <select v-model="review.estrellas" class="vd-select">
                      <option :value="1">★ 1 — Muy malo</option>
                      <option :value="2">★★ 2 — Malo</option>
                      <option :value="3">★★★ 3 — Regular</option>
                      <option :value="4">★★★★ 4 — Bueno</option>
                      <option :value="5">★★★★★ 5 — Excelente</option>
                    </select>
                    <div class="vd-review-input-row">
                      <input type="text" class="vd-input" placeholder="Escribe tu comentario..." v-model="review.comentario">
                      <button class="vd-btn-send" @click="enviar_review(item.detalle.producto._id)">Enviar</button>
                    </div>
                    <p v-if="msm_error" class="vd-error">{{ msm_error }}</p>
                  </div>
                </div>
              </div>

            </div>

            <!-- Sidebar -->
            <div class="vd-sidebar">

              <!-- Resumen del pedido -->
              <div class="vd-card">
                <h3 class="vd-card-title">Resumen</h3>
                <div class="vd-summary-row"><span>Subtotal</span><span>{{ convertCurrency(venta.total) }}</span></div>
                <div class="vd-summary-row"><span>Envío</span><span>{{ convertCurrency(venta.envio) }}</span></div>
                <div class="vd-summary-row total"><span>Total</span><strong>{{ convertCurrency(venta.total + venta.envio) }}</strong></div>
              </div>

              <!-- Cliente -->
              <div class="vd-card">
                <h3 class="vd-card-title">Cliente</h3>
                <p class="vd-info-text">{{ venta.cliente.nombres }} {{ venta.cliente.apellidos }}</p>
                <p class="vd-info-text muted">{{ venta.cliente.email }}</p>
              </div>

              <!-- Dirección -->
              <div class="vd-card">
                <h3 class="vd-card-title">Dirección de entrega</h3>
                <p class="vd-info-text">{{ venta.direccion.nombres }} {{ venta.direccion.apellidos }}</p>
                <p class="vd-info-text muted">{{ venta.direccion.telefono }}</p>
                <p class="vd-info-text muted">{{ venta.direccion.direccion }}</p>
                <p class="vd-info-text muted">{{ venta.direccion.ciudad }}, {{ venta.direccion.zip }}</p>
                <p class="vd-info-text muted">{{ venta.direccion.pais }}</p>
              </div>

              <!-- Sidebar del cliente -->
              <SidebarCliente/>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarCliente from '@/components/SidebarCliente.vue';
import axios from 'axios';
import moment from 'moment';
import currency_formatter from 'currency-formatter';

export default {
  name: 'VentaDetalleApp',
  data() {
    return {
      venta: {},
      detalles: [],
      acceso: false,
      load_data: true,
      stars: 3,
      review: { estrellas: 3 },
      msm_error : '',
    }
  },
  components: {
    SidebarCliente,
  },
  beforeMount() {
    this.init_venta();
  },
  methods: {
    init_venta(){
      this.load_data = true;
      axios.get(this.$url+'/obtener_informacion_venta/'+this.$route.params.id,{
          headers: {
              'Content-Type': 'application/json',
              'Authorization': this.$store.state.token
          }
      }).then((result)=>{
          if(result.data.message){
            this.acceso = false;
          }else{
            this.venta = result.data.venta;
            this.detalles = result.data.detalles;
             this.acceso = true;
          }
          this.load_data = false;
      });
    },
    convertDate(item){
      return moment(item).format('YYYY/MM/DD');
    },
    convertCurrency(number){
        return currency_formatter.format(number, { code: 'MXN' });
    },
    enviar_review(id){
      if(!this.review.comentario){
        this.msm_error = 'Ingrese un comentario';
      }else{
        this.review.producto = id;
         axios.post(this.$url+'/registrar_review_cliente',this.review,{
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': this.$store.state.token
              }
          }).then((result)=>{
              
          });
      }
    }
  }
}
</script>

<style scoped>
* { box-sizing: border-box; }
.vd-loading { display:flex; justify-content:center; align-items:center; min-height:60vh; }
.vd-noaccess { text-align:center; padding:8rem 1rem; }
.vd-page { background:#f5f5f5; min-height:100vh; padding-top:80px; }
.vd-container { max-width:1100px; margin:0 auto; padding:2rem 1rem; }
.vd-breadcrumb { font-size:12px; color:#888; margin-bottom:12px; }
.vd-breadcrumb a { color:#888; text-decoration:none; }
.vd-breadcrumb span { margin:0 6px; }
.vd-order-title { font-size:2rem; font-weight:700; margin:0 0 10px; }
.vd-order-meta { display:flex; align-items:center; gap:12px; margin-bottom:2rem; }
.vd-badge { background:#111; color:#fff; font-size:11px; padding:4px 10px; border-radius:20px; text-transform:uppercase; letter-spacing:.05em; }
.vd-date { font-size:13px; color:#888; }
.vd-grid { display:grid; grid-template-columns:1fr 320px; gap:24px; align-items:start; }
@media(max-width:900px){ .vd-grid { grid-template-columns:1fr; } }
.vd-card { background:#fff; border-radius:12px; padding:20px 24px; margin-bottom:20px; border:1px solid #eee; }
.vd-card-title { font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:.08em; color:#555; margin:0 0 16px; }
.vd-product-row { display:flex; align-items:center; gap:14px; padding:12px 0; border-bottom:1px solid #f0f0f0; }
.vd-product-row:last-child { border-bottom:none; }
.vd-product-img-wrap { flex-shrink:0; }
.vd-product-img { width:70px; height:70px; object-fit:cover; border-radius:8px; }
.vd-product-info { flex:1; display:flex; flex-direction:column; gap:4px; }
.vd-product-name { font-size:14px; font-weight:600; color:#111; text-decoration:none; }
.vd-product-variedad, .vd-product-qty { font-size:12px; color:#888; }
.vd-product-price { font-size:15px; font-weight:600; color:#111; white-space:nowrap; }
.vd-review-stars { margin-bottom:8px; }
.vd-star { font-size:20px; color:#ddd; }
.vd-star.active { color:#f59e0b; }
.vd-review-text { font-size:14px; color:#555; margin:0; }
.vd-review-form { display:flex; flex-direction:column; gap:12px; }
.vd-select { border:1px solid #ddd; border-radius:8px; padding:8px 12px; font-size:14px; }
.vd-review-input-row { display:flex; gap:8px; }
.vd-input { flex:1; border:1px solid #ddd; border-radius:8px; padding:9px 12px; font-size:14px; }
.vd-btn-send { background:#111; color:#fff; border:none; border-radius:8px; padding:9px 18px; font-size:13px; cursor:pointer; white-space:nowrap; }
.vd-error { color:#e53e3e; font-size:13px; margin:0; }
.vd-summary-row { display:flex; justify-content:space-between; font-size:14px; padding:8px 0; border-bottom:1px solid #f0f0f0; color:#555; }
.vd-summary-row:last-child { border-bottom:none; }
.vd-summary-row.total { font-size:15px; color:#111; padding-top:12px; }
.vd-info-text { font-size:13px; color:#555; margin:0 0 4px; }
.vd-info-text.muted { color:#888; }
.vd-btn-back { display:inline-block; margin-top:16px; background:#111; color:#fff; padding:10px 20px; border-radius:8px; text-decoration:none; font-size:14px; }
</style>