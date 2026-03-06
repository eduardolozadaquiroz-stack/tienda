<template>
  <div class="co-page">

    <!-- ENCABEZADO -->
    <div class="co-header">
      <div class="container">
        <nav class="co-breadcrumb">
          <router-link to="/">Inicio</router-link>
          <span>/</span>
          <router-link to="/cart">Carrito</router-link>
          <span>/</span>
          <span>Checkout</span>
        </nav>
        <h1 class="co-title">Finalizar compra</h1>
      </div>
    </div>

    <div class="container co-layout">

      <!-- ── COLUMNA IZQUIERDA ── -->
      <div class="co-left">

        <!-- DIRECCIÓN DE ENTREGA -->
        <div class="co-card">
          <div class="co-card-title">
            <span class="co-step">1</span>
            Dirección de entrega
          </div>

          <div v-if="direcciones.length === 0" class="co-empty-dir">
            <p>No tienes direcciones guardadas.</p>
            <router-link to="/cuenta/direcciones" class="co-link">+ Agregar dirección</router-link>
          </div>

          <div class="dir-grid" v-else>
            <label
              class="dir-option"
              :class="{ selected: venta.direccion === item._id }"
              v-for="item in direcciones"
              :key="item._id"
            >
              <input
                type="radio"
                name="shipping"
                :value="item._id"
                @change="selected_direccion($event)"
                hidden
              />
              <div class="dir-radio">
                <span class="dir-dot" :class="{ active: venta.direccion === item._id }"></span>
              </div>
              <div class="dir-body">
                <strong class="dir-city">{{ item.ciudad }}, {{ item.pais }}</strong>
                <span class="dir-address">{{ item.direccion }}</span>
                <span class="dir-contact">{{ item.nombre }} {{ item.apellidos }} · {{ item.telefono }}</span>
              </div>
            </label>
          </div>
        </div>

        <!-- PRODUCTOS -->
        <div class="co-card">
          <div class="co-card-title">
            <span class="co-step">2</span>
            Revisión de productos
          </div>

          <!-- Cabecera -->
          <div class="pi-header">
            <span>Producto</span>
            <span>Precio</span>
            <span>Cant.</span>
            <span>Subtotal</span>
          </div>

          <!-- Items -->
          <div class="pi-row" v-for="item in productos" :key="item._id">
            <div class="pi-product">
              <img :src="$imgSrc(item.producto.portada)" class="pi-img" :alt="item.producto.titulo" />
              <div class="pi-info">
                <span class="pi-name">{{ item.producto.titulo }}</span>
                <span class="pi-var">{{ item.producto.str_variedad }}: <strong>{{ item.variedad.variedad }}</strong></span>
              </div>
            </div>
            <div class="pi-val">{{ convertCurrency(item.producto.precio) }}</div>
            <div class="pi-val">{{ item.cantidad }}</div>
            <div class="pi-val pi-sub">{{ convertCurrency(item.producto.precio * item.cantidad) }}</div>
          </div>
        </div>

        <!-- BOTÓN VOLVER -->
        <div class="co-back">
          <router-link to="/cart" class="btn-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Volver al carrito
          </router-link>
        </div>
      </div>

      <!-- ── COLUMNA DERECHA: resumen ── -->
      <div class="co-right">

        <!-- RESUMEN -->
        <div class="co-card summary-card">
          <div class="co-card-title" style="margin-bottom:20px">
            <span class="co-step">3</span>
            Resumen del pedido
          </div>

          <div class="sum-row">
            <span>Subtotal ({{ productos.length }} art{{ productos.length === 1 ? 'ículo' : 'ículos' }})</span>
            <span>{{ convertCurrency(total) }}</span>
          </div>
          <div class="sum-row">
            <span>Envío</span>
            <span>{{ convertCurrency($envio) }}</span>
          </div>
          <div class="sum-divider"></div>
          <div class="sum-row sum-total">
            <span>Total</span>
            <span>{{ convertCurrency(total + $envio) }}</span>
          </div>
        </div>

        <!-- PAGO -->
        <div class="co-card pay-card">
          <p class="pay-label">Método de pago</p>
          <p class="pay-method">Tarjeta de crédito o débito</p>
          <img src="/assets/media/payments.png" class="pay-logos" alt="Métodos de pago" />
          <p class="pay-note">
            Al hacer clic en "Pagar ahora" serás redirigido a Mercado Pago de forma segura para completar tu compra.
          </p>

          <div class="pay-error" v-if="pay_error">{{ pay_error }}</div>

          <button
            class="btn-pay"
            @click="crearPreferencia()"
            :disabled="procesando"
          >
            <span v-if="!procesando">
              🔒 Pagar ahora — {{ convertCurrency(total + $envio) }}
            </span>
            <span v-else class="pay-spinner"></span>
          </button>

          <p class="pay-terms">
            Al pagar aceptas nuestros <a href="#">Términos y condiciones</a> y la <a href="#">Política de privacidad</a>.
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
  name: 'CheckoutView',
  data() {
    return {
      direcciones: [],
      venta: { direccion: null },
      productos: [],
      total: 0,
      load_data: true,
      items: [],
      procesando: false,
      pay_error: ''
    };
  },
  beforeMount() {
    this.init_direcciones();
    this.init_carrito();
  },
  methods: {
    convertCurrency(number) {
      return currency_formatter.format(number, { code: 'MXN' });
    },
    init_direcciones() {
      axios.get(this.$url + '/obternet_direcciones_cliente', {
        headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
      }).then((result) => {
        this.direcciones = result.data;
        if (result.data.length > 0) {
          this.venta.direccion = result.data[0]._id;
        }
      });
    },
    selected_direccion(event) {
      this.venta.direccion = event.target.value;
    },
    init_carrito() {
      if (this.$store.state.token != null) {
        axios.get(this.$url + '/obtener_carrito_cliente', {
          headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
        }).then((result) => {
          this.total = 0;
          this.items = [];
          for (var item of result.data.carrito_general) {
            this.total += item.producto.precio * item.cantidad;
            this.items.push({
              title: item.producto.titulo,
              quantity: item.cantidad,
              unit_price: item.producto.precio,
              currency_id: 'MXN'
            });
          }
          this.items.push({ title: 'Envío', quantity: 1, unit_price: this.$envio, currency_id: 'MXN' });
          this.productos = result.data.carrito_general;
          this.load_data = false;
        });
      }
    },
    crearPreferencia() {
      this.pay_error = '';
      if (!this.venta.direccion) {
        this.pay_error = 'Por favor selecciona una dirección de entrega.';
        return;
      }
      this.procesando = true;

      // La llamada va al BACKEND propio — el token de MP nunca toca el frontend
      axios.post(this.$url + '/crear_preferencia_mp', {
        items: this.items,
        direccion: this.venta.direccion
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.$store.state.token
        }
      }).then((result) => {
        // En producción usar init_point, en sandbox usar sandbox_init_point
        const url = result.data.init_point || result.data.sandbox_init_point;
        window.location.href = url;
      }).catch(() => {
        this.pay_error = 'Ocurrió un error al procesar el pago. Intenta de nuevo.';
        this.procesando = false;
      });
    }
  }
};
</script>

<style scoped>
* { box-sizing: border-box; }
a { text-decoration: none; color: inherit; }

.co-page {
  background: #f7f7f7;
  min-height: 100vh;
  padding-bottom: 80px;
}

/* ── HEADER ── */
.co-header {
  background: #fff;
  border-bottom: 1px solid #ebebeb;
  padding: 28px 0 22px;
  margin-top: 80px;
}
.co-breadcrumb {
  font-size: 12px;
  color: #aaa;
  margin-bottom: 8px;
  display: flex;
  gap: 6px;
  align-items: center;
}
.co-breadcrumb a { color: #aaa; }
.co-breadcrumb a:hover { color: #111; }
.co-title {
  font-size: 26px;
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.5px;
}

/* ── LAYOUT ── */
.co-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: start;
  padding-top: 28px;
}
@media (max-width: 960px) {
  .co-layout { grid-template-columns: 1fr; }
}

/* ── CARD BASE ── */
.co-card {
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 20px;
}
.co-card-title {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -.2px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
  text-transform: uppercase;
}
.co-step {
  background: #111;
  color: #fff;
  font-size: 11px;
  font-weight: 900;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── DIRECCIONES ── */
.co-empty-dir { font-size: 13px; color: #999; }
.co-link { color: #111; font-weight: 700; font-size: 13px; text-decoration: underline; }

.dir-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 600px) { .dir-grid { grid-template-columns: 1fr; } }

.dir-option {
  border: 1.5px solid #eee;
  border-radius: 10px;
  padding: 14px 16px;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  transition: border-color .2s, background .2s;
}
.dir-option.selected {
  border-color: #111;
  background: #fafafa;
}
.dir-radio { padding-top: 2px; flex-shrink: 0; }
.dir-dot {
  width: 16px; height: 16px;
  border: 2px solid #ccc;
  border-radius: 50%;
  display: block;
  transition: border-color .2s;
  position: relative;
}
.dir-dot.active {
  border-color: #111;
}
.dir-dot.active::after {
  content: '';
  position: absolute;
  inset: 3px;
  background: #111;
  border-radius: 50%;
}
.dir-body { display: flex; flex-direction: column; gap: 3px; }
.dir-city { font-size: 13px; font-weight: 700; text-transform: uppercase; }
.dir-address, .dir-contact { font-size: 12px; color: #888; }

/* ── PRODUCTOS ── */
.pi-header {
  display: grid;
  grid-template-columns: 1fr 90px 60px 100px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #bbb;
  padding: 0 0 10px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 4px;
}
@media (max-width: 600px) { .pi-header { display: none; } }

.pi-row {
  display: grid;
  grid-template-columns: 1fr 90px 60px 100px;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f7f7f7;
}
.pi-row:last-child { border-bottom: none; }

.pi-product { display: flex; align-items: center; gap: 12px; }
.pi-img {
  width: 56px; height: 56px;
  object-fit: cover;
  border-radius: 8px;
  background: #f3f3f3;
  flex-shrink: 0;
}
.pi-info { display: flex; flex-direction: column; gap: 3px; }
.pi-name { font-size: 13px; font-weight: 700; color: #111; line-height: 1.3; }
.pi-var { font-size: 11px; color: #999; }
.pi-val { font-size: 13px; color: #555; text-align: center; }
.pi-sub { font-weight: 700; color: #111; }

/* ── VOLVER ── */
.co-back { margin-top: 4px; }
.btn-back {
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
.btn-back:hover { color: #111; }

/* ── COLUMNA DERECHA ── */
.co-right { position: sticky; top: 100px; }
.summary-card { margin-bottom: 16px; }

.sum-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #555;
  margin-bottom: 10px;
}
.sum-divider { border: none; border-top: 1px solid #f0f0f0; margin: 14px 0; }
.sum-total { font-size: 16px; font-weight: 800; color: #111; margin-bottom: 0; }

/* ── PAGO ── */
.pay-card { }
.pay-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #aaa;
  margin: 0 0 4px;
}
.pay-method { font-size: 14px; font-weight: 700; margin: 0 0 10px; }
.pay-logos { width: 160px; display: block; margin-bottom: 12px; }
.pay-note { font-size: 11px; color: #aaa; line-height: 1.5; margin-bottom: 14px; }

.pay-error {
  background: #fef2f2;
  color: #dc2626;
  font-size: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 14px;
  border: 1px solid #fca5a5;
}

.btn-pay {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: #111;
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .5px;
  cursor: pointer;
  margin-bottom: 14px;
  transition: background .2s, transform .15s, opacity .2s;
}
.btn-pay:hover:not(:disabled) { background: #333; transform: translateY(-1px); }
.btn-pay:disabled { opacity: .6; cursor: not-allowed; }

.pay-spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .7s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

.pay-terms { font-size: 11px; color: #bbb; text-align: center; margin: 0; line-height: 1.5; }
.pay-terms a { color: #888; text-decoration: underline; }
</style>