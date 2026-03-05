<template>
  <div class="dir-page">

    <!-- ENCABEZADO -->
    <div class="dir-header">
      <div class="container">
        <nav class="dir-breadcrumb">
          <router-link to="/">Inicio</router-link>
          <span>/</span>
          <span>Mis direcciones</span>
        </nav>
        <h1 class="dir-title">Mis direcciones</h1>
      </div>
    </div>

    <div class="container dir-layout">

      <!-- ── COLUMNA PRINCIPAL ── -->
      <div class="dir-main">

        <!-- FORMULARIO NUEVA DIRECCIÓN -->
        <div class="dir-card">
          <div class="dir-card-title">
            <span class="dir-step">+</span>
            Nueva dirección
          </div>

          <div class="dir-form-grid">
            <div class="df-group">
              <label class="df-label">Nombres</label>
              <input class="df-input" type="text" placeholder="Juan" v-model="direccion.nombres" />
            </div>
            <div class="df-group">
              <label class="df-label">Apellidos</label>
              <input class="df-input" type="text" placeholder="Ramírez" v-model="direccion.apellidos" />
            </div>
            <div class="df-group">
              <label class="df-label">Documento / ID</label>
              <input class="df-input" type="text" placeholder="123456789" v-model="direccion.documento" />
            </div>
            <div class="df-group">
              <label class="df-label">Teléfono</label>
              <input class="df-input" type="text" placeholder="(+52) 55 1234 5678" v-model="direccion.telefono" />
            </div>
            <div class="df-group">
              <label class="df-label">País</label>
              <select class="df-input" v-model="direccion.pais">
                <option value="" disabled>Seleccionar país</option>
                <option :value="item" v-for="item in $paises" :key="item">{{ item }}</option>
              </select>
            </div>
            <div class="df-group">
              <label class="df-label">Ciudad / Municipio</label>
              <input class="df-input" type="text" placeholder="Chalco / Miraflores" v-model="direccion.ciudad" />
            </div>
            <div class="df-group">
              <label class="df-label">Código postal</label>
              <input class="df-input" type="text" placeholder="56640" v-model="direccion.zip" />
            </div>
            <div class="df-group">
              <label class="df-label">Dirección</label>
              <input class="df-input" type="text" placeholder="Calle Miraflores #123, Col. Centro" v-model="direccion.direccion" />
            </div>
          </div>

          <div class="df-error" v-if="msm_error">{{ msm_error }}</div>

          <div class="df-actions">
            <button class="df-btn" type="button" @click="crear_direccion()">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
              </svg>
              Guardar dirección
            </button>
          </div>
        </div>

        <!-- LISTA DE DIRECCIONES -->
        <div class="dir-card" v-if="!load_dir">

          <!-- Vacío -->
          <div class="dir-empty" v-if="direcciones.length === 0">
            <div class="dir-empty-icon">📍</div>
            <h3>Sin direcciones guardadas</h3>
            <p>Agrega tu primera dirección usando el formulario de arriba.</p>
          </div>

          <!-- Tarjetas -->
          <template v-else>
            <div class="dir-list-title">
              Guardadas ({{ direcciones.length }})
            </div>
            <div class="dir-cards-grid">
              <div class="dir-addr-card" v-for="item in direcciones" :key="item._id">
                <div class="dac-top">
                  <div class="dac-pin">📍</div>
                  <button class="dac-del" @click="eliminar_direccion(item._id)" title="Eliminar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/>
                      <path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
                <p class="dac-name">{{ item.nombres }} {{ item.apellidos }}</p>
                <p class="dac-loc">{{ item.ciudad }}, {{ item.pais }} · C.P. {{ item.zip }}</p>
                <p class="dac-addr">{{ item.direccion }}</p>
                <p class="dac-contact">{{ item.telefono }}</p>
              </div>
            </div>
          </template>
        </div>

      </div>

      <!-- ── SIDEBAR ── -->
      <div class="dir-sidebar">
        <SidebarCliente />
      </div>

    </div>

    <!-- TOAST ÉXITO -->
    <transition name="toast-anim">
      <div class="dir-toast" v-if="toast_visible">
        ✓ Dirección guardada correctamente
      </div>
    </transition>

  </div>
</template>

<script>
import axios from 'axios';
import SidebarCliente from '@/components/SidebarCliente.vue';

export default {
  components: { SidebarCliente },
  data() {
    return {
      direccion: { pais: '' },
      msm_error: '',
      direcciones: [],
      load_dir: true,
      toast_visible: false,
    };
  },
  beforeMount() {
    this.init_direcciones();
  },
  methods: {
    init_direcciones() {
      this.load_dir = true;
      axios.get(this.$url + '/obternet_direcciones_cliente', {
        headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
      }).then((result) => {
        this.direcciones = result.data;
        this.load_dir = false;
      });
    },
    eliminar_direccion(id) {
      axios.delete(this.$url + '/eliminar_direccion_cliente/' + id, {
        headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
      }).then(() => { this.init_direcciones(); });
    },
    crear_direccion() {
      if (!this.direccion.nombres)   return (this.msm_error = 'Ingrese los nombres por favor.');
      if (!this.direccion.apellidos) return (this.msm_error = 'Ingrese los apellidos por favor.');
      if (!this.direccion.documento) return (this.msm_error = 'Ingrese el documento por favor.');
      if (!this.direccion.telefono)  return (this.msm_error = 'Ingrese el teléfono por favor.');
      if (!this.direccion.pais)      return (this.msm_error = 'Seleccione el país por favor.');
      if (!this.direccion.ciudad)    return (this.msm_error = 'Ingrese la ciudad por favor.');
      if (!this.direccion.zip)       return (this.msm_error = 'Ingrese el código postal por favor.');
      if (!this.direccion.direccion) return (this.msm_error = 'Ingrese la dirección por favor.');

      this.msm_error = '';
      axios.post(this.$url + '/crear_direccion_cliente', this.direccion, {
        headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
      }).then(() => {
        this.direccion = { pais: '' };
        this.init_direcciones();
        this.toast_visible = true;
        setTimeout(() => { this.toast_visible = false; }, 3000);
      });
    }
  }
};
</script>

<style scoped>
* { box-sizing: border-box; }
a { text-decoration: none; color: inherit; }

.dir-page {
  background: #f7f7f7;
  min-height: 100vh;
  padding-bottom: 80px;
}

/* ── HEADER ── */
.dir-header {
  background: #fff;
  border-bottom: 1px solid #ebebeb;
  padding: 28px 0 22px;
  margin-top: 80px;
}
.dir-breadcrumb {
  font-size: 12px; color: #aaa;
  margin-bottom: 8px;
  display: flex; gap: 6px; align-items: center;
}
.dir-breadcrumb a { color: #aaa; }
.dir-breadcrumb a:hover { color: #111; }
.dir-title {
  font-size: 26px; font-weight: 900;
  margin: 0; letter-spacing: -.5px;
}

/* ── LAYOUT ── */
.dir-layout {
  display: grid;
  grid-template-columns: 1fr 240px;
  gap: 24px;
  align-items: start;
  padding-top: 28px;
}
@media (max-width: 900px) { .dir-layout { grid-template-columns: 1fr; } }

/* ── CARD ── */
.dir-card {
  background: #fff;
  border-radius: 14px;
  padding: 26px;
  margin-bottom: 20px;
}
.dir-card-title {
  font-size: 13px; font-weight: 800;
  letter-spacing: .5px; text-transform: uppercase;
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 22px;
}
.dir-step {
  background: #111; color: #fff;
  font-size: 14px; font-weight: 900;
  width: 24px; height: 24px;
  border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* ── FORMULARIO ── */
.dir-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 16px;
}
@media (max-width: 600px) { .dir-form-grid { grid-template-columns: 1fr; } }

.df-group { display: flex; flex-direction: column; gap: 5px; }
.df-label {
  font-size: 11px; font-weight: 700;
  letter-spacing: 1.2px; text-transform: uppercase;
  color: #777;
}
.df-input {
  width: 100%;
  padding: 11px 13px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  font-size: 13px; color: #111;
  background: #fafafa;
  outline: none;
  transition: border-color .2s, background .2s;
  appearance: none;
}
.df-input:focus { border-color: #111; background: #fff; }

.df-error {
  background: #fef2f2; color: #dc2626;
  font-size: 12px; padding: 10px 14px;
  border-radius: 8px; margin-top: 14px;
  border: 1px solid #fca5a5;
}
.df-actions { margin-top: 18px; }
.df-btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: #111; color: #fff;
  border: none; padding: 13px 24px;
  border-radius: 9px; font-size: 13px;
  font-weight: 700; letter-spacing: .5px;
  cursor: pointer;
  transition: background .2s, transform .15s;
}
.df-btn:hover { background: #333; transform: translateY(-1px); }

/* ── LISTA ── */
.dir-list-title {
  font-size: 11px; font-weight: 700;
  letter-spacing: 1.2px; text-transform: uppercase;
  color: #aaa; margin-bottom: 14px;
}
.dir-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}
.dir-addr-card {
  border: 1.5px solid #ebebeb;
  border-radius: 12px;
  padding: 16px;
  transition: border-color .2s, box-shadow .2s;
}
.dir-addr-card:hover {
  border-color: #ccc;
  box-shadow: 0 4px 16px rgba(0,0,0,.06);
}
.dac-top {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 8px;
}
.dac-pin { font-size: 20px; }
.dac-del {
  background: none; border: none; padding: 4px;
  border-radius: 6px; cursor: pointer;
  color: #ccc; display: flex; align-items: center;
  transition: color .2s, background .2s;
}
.dac-del:hover { color: #dc2626; background: #fef2f2; }
.dac-name  { font-size: 13px; font-weight: 700; margin: 0 0 4px; color: #111; }
.dac-loc   { font-size: 12px; color: #888; margin: 0 0 3px; }
.dac-addr  { font-size: 12px; color: #555; margin: 0 0 3px; }
.dac-contact { font-size: 11px; color: #aaa; margin: 0; }

/* ── VACÍO ── */
.dir-empty { text-align: center; padding: 40px 20px; }
.dir-empty-icon { font-size: 44px; margin-bottom: 12px; }
.dir-empty h3 { font-size: 18px; font-weight: 800; margin: 0 0 6px; }
.dir-empty p  { color: #999; font-size: 13px; margin: 0; }

/* ── TOAST ── */
.dir-toast {
  position: fixed; bottom: 28px; right: 28px; z-index: 9999;
  background: #111; color: #fff;
  padding: 14px 22px; border-radius: 10px;
  font-size: 13px; font-weight: 600;
  box-shadow: 0 8px 28px rgba(0,0,0,.18);
  pointer-events: none;
}
.toast-anim-enter-active { transition: all .3s cubic-bezier(.34,1.56,.64,1); }
.toast-anim-leave-active { transition: all .25s ease; }
.toast-anim-enter-from  { opacity: 0; transform: translateY(20px) scale(.95); }
.toast-anim-leave-to    { opacity: 0; transform: translateY(10px); }
</style>