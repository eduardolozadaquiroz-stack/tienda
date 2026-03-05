<template>
  <div class="cart-page">

    <!-- ENCABEZADO -->
    <div class="cart-page-header">
      <div class="container">
        <nav class="cart-breadcrumb">
          <router-link to="/">Inicio</router-link>
          <span>/</span>
          <span>Carrito</span>
        </nav>
        <h1 class="cart-page-title">
          Mi carrito
          <span class="cart-count" v-if="carrito.length > 0">{{ carrito.length }}</span>
        </h1>
      </div>
    </div>

    <div class="container cart-layout">

      <!-- ── COLUMNA IZQUIERDA: items ── -->
      <div class="cart-items-col">

        <!-- LOADING -->
        <div class="cart-loading" v-if="load_data">
          <div class="spinner"></div>
          <p>Cargando tu carrito...</p>
        </div>

        <!-- CARRITO VACÍO -->
        <div class="cart-empty" v-else-if="!load_data && carrito.length === 0">
          <div class="cart-empty-icon">🛒</div>
          <h3>Tu carrito está vacío</h3>
          <p>Agrega productos desde la tienda para verlos aquí.</p>
          <router-link to="/shop" class="btn-shop">Ir a la tienda</router-link>
        </div>

        <!-- LISTA DE PRODUCTOS -->
        <template v-else>
          <!-- Cabecera de columnas -->
          <div class="ci-header">
            <span class="ci-h-product">Producto</span>
            <span class="ci-h-price">Precio</span>
            <span class="ci-h-qty">Cantidad</span>
            <span class="ci-h-sub">Subtotal</span>
            <span class="ci-h-del"></span>
          </div>

          <!-- Cada item -->
          <div class="ci-row" v-for="item in carrito" :key="item._id">
            <!-- Imagen + info -->
            <div class="ci-product">
              <router-link :to="{name:'show-producto', params:{slug: item.producto.slug}}" class="ci-img-link">
                <img :src="$url+'/obtener_portada_producto/'+item.producto.portada" :alt="item.producto.titulo" class="ci-img" />
              </router-link>
              <div class="ci-info">
                <router-link :to="{name:'show-producto', params:{slug: item.producto.slug}}" class="ci-name">
                  {{ item.producto.titulo }}
                </router-link>
                <span class="ci-variedad">{{ item.producto.str_variedad }}: <strong>{{ item.variedad.variedad }}</strong></span>
              </div>
            </div>

            <!-- Precio unitario -->
            <div class="ci-price">{{ convertCurrency(item.producto.precio) }}</div>

            <!-- Cantidad -->
            <div class="ci-qty">{{ item.cantidad }}</div>

            <!-- Subtotal -->
            <div class="ci-subtotal">{{ convertCurrency(item.producto.precio * item.cantidad) }}</div>

            <!-- Eliminar -->
            <div class="ci-del">
              <button class="ci-del-btn" @click="eliminar(item._id)" title="Eliminar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Botón continuar -->
          <div class="ci-footer">
            <router-link to="/shop" class="btn-continue">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Continuar comprando
            </router-link>
          </div>
        </template>
      </div>

      <!-- ── COLUMNA DERECHA: resumen ── -->
      <div class="cart-summary-col" v-if="!load_data && carrito.length > 0">
        <div class="summary-card">
          <h2 class="summary-title">Resumen del pedido</h2>

          <div class="summary-row">
            <span>Subtotal ({{ carrito.length }} art{{ carrito.length === 1 ? 'ículo' : 'ículos' }})</span>
            <span>{{ convertCurrency(total) }}</span>
          </div>
          <div class="summary-row">
            <span>Envío</span>
            <span>{{ convertCurrency($envio) }}</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-row summary-total">
            <span>Total</span>
            <span>{{ convertCurrency(total + $envio) }}</span>
          </div>

          <router-link to="/checkout" class="btn-checkout">
            Proceder al pago
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </router-link>

          <p class="summary-note">
            🔒 Pago seguro. El envío se calcula al finalizar el pedido.
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';
import currency_formatter from 'currency-formatter';

export default {
  data() {
    return {
      total: 0,
      carrito: [],
      load_data: true,
    };
  },
  methods: {
    convertCurrency(number) {
      return currency_formatter.format(number, { code: 'MXN' });
    },
    init_carrito() {
      if (this.$store.state.token != null) {
        this.load_data = true;
        axios.get(this.$url + '/obtener_carrito_cliente', {
          headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
        }).then((result) => {
          this.total = 0;
          for (var item of result.data.carrito_general) {
            this.total += item.producto.precio * item.cantidad;
          }
          this.carrito = result.data.carrito_general;
          this.load_data = false;
        });
      }
    },
    eliminar(id) {
      axios.delete(this.$url + '/eliminar_producto_carrito/' + id, {
        headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
      }).then(() => {
        this.init_carrito();
        this.$socket.emit('send_cart', true);
      });
    }
  },
  beforeMount() {
    this.init_carrito();
  },
};
</script>

<style scoped>
* { box-sizing: border-box; }
a { text-decoration: none; color: inherit; }

.cart-page {
  background: #f7f7f7;
  min-height: 100vh;
  padding-bottom: 80px;
}

/* ── HEADER ── */
.cart-page-header {
  background: #fff;
  border-bottom: 1px solid #ebebeb;
  padding: 28px 0 22px;
  margin-top: 80px;
}
.cart-breadcrumb {
  font-size: 12px;
  color: #aaa;
  margin-bottom: 8px;
  display: flex;
  gap: 6px;
  align-items: center;
}
.cart-breadcrumb a { color: #aaa; }
.cart-breadcrumb a:hover { color: #111; }
.cart-page-title {
  font-size: 26px;
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.cart-count {
  background: #111;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  border-radius: 999px;
  padding: 2px 9px;
  letter-spacing: 0;
}

/* ── LAYOUT ── */
.cart-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 28px;
  align-items: start;
  padding-top: 32px;
}
@media (max-width: 960px) {
  .cart-layout { grid-template-columns: 1fr; }
}

/* ── LOADING ── */
.cart-loading {
  background: #fff;
  border-radius: 14px;
  padding: 60px;
  text-align: center;
  color: #aaa;
  font-size: 14px;
}
.spinner {
  width: 36px; height: 36px;
  border: 3px solid #eee;
  border-top-color: #111;
  border-radius: 50%;
  animation: spin .7s linear infinite;
  margin: 0 auto 14px;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── EMPTY ── */
.cart-empty {
  background: #fff;
  border-radius: 14px;
  padding: 72px 40px;
  text-align: center;
}
.cart-empty-icon { font-size: 52px; margin-bottom: 16px; }
.cart-empty h3 { font-size: 20px; font-weight: 800; margin: 0 0 8px; }
.cart-empty p  { color: #999; font-size: 14px; margin: 0 0 24px; }
.btn-shop {
  display: inline-block;
  background: #111;
  color: #fff;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: background .2s;
}
.btn-shop:hover { background: #333; }

/* ── CABECERA DE COLUMNAS ── */
.ci-header {
  display: grid;
  grid-template-columns: 1fr 100px 80px 110px 40px;
  padding: 0 20px 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #aaa;
}
@media (max-width: 640px) {
  .ci-header { display: none; }
}

/* ── FILA DE ITEM ── */
.ci-row {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 12px;
  padding: 18px 20px;
  display: grid;
  grid-template-columns: 1fr 100px 80px 110px 40px;
  align-items: center;
  transition: box-shadow .2s;
}
.ci-row:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,.07);
}
@media (max-width: 640px) {
  .ci-row {
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto auto;
    gap: 8px 0;
  }
  .ci-price, .ci-qty { display: none; }
  .ci-subtotal { grid-column: 2; text-align: right; }
  .ci-del { grid-column: 2; grid-row: 1; text-align: right; }
}

/* Producto (imagen + info) */
.ci-product {
  display: flex;
  align-items: center;
  gap: 14px;
}
.ci-img-link { flex-shrink: 0; }
.ci-img {
  width: 68px;
  height: 68px;
  object-fit: cover;
  border-radius: 8px;
  background: #f3f3f3;
}
.ci-info { display: flex; flex-direction: column; gap: 4px; }
.ci-name {
  font-size: 13px;
  font-weight: 700;
  color: #111;
  line-height: 1.3;
}
.ci-name:hover { text-decoration: underline; }
.ci-variedad {
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: .5px;
}

/* Precio / Qty / Subtotal */
.ci-price, .ci-qty {
  font-size: 13px;
  color: #555;
  text-align: center;
}
.ci-subtotal {
  font-size: 14px;
  font-weight: 700;
  color: #111;
  text-align: center;
}

/* Botón eliminar */
.ci-del { text-align: center; }
.ci-del-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #ccc;
  padding: 6px;
  border-radius: 6px;
  display: inline-flex;
  transition: color .2s, background .2s;
}
.ci-del-btn:hover {
  color: #dc2626;
  background: #fef2f2;
}

/* Footer de items */
.ci-footer {
  padding: 16px 4px 0;
}
.btn-continue {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #888;
  transition: color .2s;
}
.btn-continue:hover { color: #111; }

/* ── RESUMEN ── */
.summary-card {
  background: #fff;
  border-radius: 14px;
  padding: 28px 24px;
  position: sticky;
  top: 100px;
}
.summary-title {
  font-size: 15px;
  font-weight: 900;
  letter-spacing: -.2px;
  margin: 0 0 22px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #555;
  margin-bottom: 12px;
}
.summary-divider {
  border: none;
  border-top: 1px solid #f0f0f0;
  margin: 16px 0;
}
.summary-total {
  font-size: 16px;
  font-weight: 800;
  color: #111;
  margin-bottom: 20px;
}
.btn-checkout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: #111;
  color: #fff;
  padding: 15px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: background .2s, transform .15s;
  margin-bottom: 16px;
}
.btn-checkout:hover {
  background: #333;
  transform: translateY(-1px);
}
.summary-note {
  font-size: 11px;
  color: #aaa;
  text-align: center;
  margin: 0;
  line-height: 1.5;
}
</style>