<template>
  <div>
    <Sidebar />
    <div class="main-content">
      <TopNav />

      <!-- BREADCRUMB -->
      <div style="background:#f8f9fa;border-bottom:1px solid #e9ecef;padding:10px 24px;">
        <nav style="font-size:13px;">
          <span style="color:#868e96;">🏠 Panel</span>
          <span style="color:#ced4da;margin:0 6px;">/</span>
          <span style="background:#7950f2;color:#fff;border-radius:20px;padding:2px 12px;font-weight:600;">🎟️ Cupones</span>
        </nav>
      </div>

      <div class="container-fluid" style="padding:24px 32px;">

        <!-- Header -->
        <div style="margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <div>
            <h2 style="font-weight:700;margin:0;">Cupones de descuento</h2>
            <p style="color:#868e96;margin:4px 0 0;font-size:14px;">{{ cupones.length }} cupones creados</p>
          </div>
          <button @click="abrirModal()" class="btn btn-primary" style="border-radius:20px;font-weight:600;">
            <i class="fe fe-plus me-1"></i> Nuevo cupón
          </button>
        </div>

        <!-- Tabla de cupones -->
        <div style="background:#fff;border-radius:12px;box-shadow:0 1px 6px rgba(0,0,0,.07);overflow:hidden;">
          <div v-if="loading" style="padding:40px;text-align:center;color:#adb5bd;">Cargando cupones...</div>
          <div v-else-if="cupones.length === 0" style="padding:40px;text-align:center;color:#adb5bd;">
            No hay cupones creados. Crea el primero con el botón de arriba.
          </div>
          <div v-else style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <thead>
                <tr style="background:#f8f9fa;border-bottom:2px solid #e9ecef;">
                  <th style="padding:12px 16px;text-align:left;font-weight:600;color:#495057;">Código</th>
                  <th style="padding:12px 16px;text-align:left;font-weight:600;color:#495057;">Descuento</th>
                  <th style="padding:12px 16px;text-align:center;font-weight:600;color:#495057;">Mín. compra</th>
                  <th style="padding:12px 16px;text-align:center;font-weight:600;color:#495057;">Usos</th>
                  <th style="padding:12px 16px;text-align:center;font-weight:600;color:#495057;">Expira</th>
                  <th style="padding:12px 16px;text-align:center;font-weight:600;color:#495057;">Estado</th>
                  <th style="padding:12px 16px;text-align:center;font-weight:600;color:#495057;">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in cupones" :key="c._id" style="border-bottom:1px solid #f1f3f5;">
                  <!-- Código -->
                  <td style="padding:12px 16px;">
                    <span style="font-family:monospace;font-weight:700;font-size:15px;background:#f1f3f5;padding:4px 10px;border-radius:6px;letter-spacing:1px;">
                      {{ c.codigo }}
                    </span>
                  </td>
                  <!-- Descuento -->
                  <td style="padding:12px 16px;">
                    <span v-if="c.tipo === 'porcentaje'" style="background:#fff3bf;color:#e67700;border-radius:20px;padding:4px 12px;font-size:13px;font-weight:600;">
                      {{ c.valor }}% OFF
                    </span>
                    <span v-else style="background:#ebfbee;color:#2b8a3e;border-radius:20px;padding:4px 12px;font-size:13px;font-weight:600;">
                      -${{ c.valor }}
                    </span>
                  </td>
                  <!-- Mínimo -->
                  <td style="padding:12px 16px;text-align:center;color:#868e96;font-size:13px;">
                    {{ c.minimo_compra > 0 ? '$' + c.minimo_compra : '—' }}
                  </td>
                  <!-- Usos -->
                  <td style="padding:12px 16px;text-align:center;font-size:13px;">
                    <span :style="{ color: c.limite_usos > 0 && c.usos >= c.limite_usos ? '#c92a2a' : '#495057' }">
                      {{ c.usos }} / {{ c.limite_usos === -1 ? '∞' : c.limite_usos }}
                    </span>
                  </td>
                  <!-- Expira -->
                  <td style="padding:12px 16px;text-align:center;font-size:12px;white-space:nowrap;"
                    :style="{ color: c.expira && new Date(c.expira) < new Date() ? '#c92a2a' : '#868e96' }">
                    {{ c.expira ? formatFecha(c.expira) : '— Sin límite' }}
                  </td>
                  <!-- Estado -->
                  <td style="padding:12px 16px;text-align:center;">
                    <button @click="toggleEstado(c)"
                      :style="c.activo ? { background:'#ebfbee', color:'#2b8a3e', border:'1px solid #8ce99a' } : { background:'#f1f3f5', color:'#868e96', border:'1px solid #dee2e6' }"
                      style="border-radius:20px;padding:4px 14px;font-size:12px;font-weight:600;cursor:pointer;">
                      {{ c.activo ? '● Activo' : '○ Inactivo' }}
                    </button>
                  </td>
                  <!-- Acciones -->
                  <td style="padding:12px 16px;text-align:center;">
                    <button @click="confirmarEliminar(c)"
                      style="background:#fff5f5;color:#c92a2a;border:1px solid #ffa8a8;border-radius:20px;padding:4px 12px;font-size:12px;font-weight:600;cursor:pointer;">
                      🗑
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- MODAL CREAR CUPÓN -->
        <div v-if="mostrarModal" style="position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;">
          <div style="background:#fff;border-radius:16px;padding:32px;max-width:500px;width:100%;box-shadow:0 8px 40px rgba(0,0,0,.18);">
            <h5 style="font-weight:700;margin-bottom:20px;">🎟️ Nuevo cupón</h5>

            <div class="row g-3">
              <!-- Código -->
              <div class="col-12">
                <label style="font-size:12px;font-weight:600;color:#495057;margin-bottom:4px;display:block;">Código *</label>
                <input v-model="form.codigo" type="text" placeholder="Ej: VERANO20"
                  style="width:100%;border:1px solid #dee2e6;border-radius:8px;padding:9px 14px;font-size:14px;font-family:monospace;text-transform:uppercase;"
                  @input="form.codigo = form.codigo.toUpperCase()" />
              </div>
              <!-- Tipo -->
              <div class="col-6">
                <label style="font-size:12px;font-weight:600;color:#495057;margin-bottom:4px;display:block;">Tipo *</label>
                <select v-model="form.tipo" style="width:100%;border:1px solid #dee2e6;border-radius:8px;padding:9px 14px;font-size:14px;">
                  <option value="porcentaje">% Porcentaje</option>
                  <option value="fijo">$ Monto fijo</option>
                </select>
              </div>
              <!-- Valor -->
              <div class="col-6">
                <label style="font-size:12px;font-weight:600;color:#495057;margin-bottom:4px;display:block;">
                  Valor * {{ form.tipo === 'porcentaje' ? '(%)' : '($)' }}
                </label>
                <input v-model.number="form.valor" type="number" min="0" :max="form.tipo === 'porcentaje' ? 100 : 99999"
                  style="width:100%;border:1px solid #dee2e6;border-radius:8px;padding:9px 14px;font-size:14px;" />
              </div>
              <!-- Mínimo compra -->
              <div class="col-6">
                <label style="font-size:12px;font-weight:600;color:#495057;margin-bottom:4px;display:block;">Compra mínima ($)</label>
                <input v-model.number="form.minimo_compra" type="number" min="0" placeholder="0 = sin mínimo"
                  style="width:100%;border:1px solid #dee2e6;border-radius:8px;padding:9px 14px;font-size:14px;" />
              </div>
              <!-- Límite usos -->
              <div class="col-6">
                <label style="font-size:12px;font-weight:600;color:#495057;margin-bottom:4px;display:block;">Límite de usos</label>
                <input v-model.number="form.limite_usos" type="number" min="-1" placeholder="-1 = ilimitado"
                  style="width:100%;border:1px solid #dee2e6;border-radius:8px;padding:9px 14px;font-size:14px;" />
              </div>
              <!-- Expiración -->
              <div class="col-12">
                <label style="font-size:12px;font-weight:600;color:#495057;margin-bottom:4px;display:block;">Fecha de expiración (opcional)</label>
                <input v-model="form.expira" type="date"
                  style="width:100%;border:1px solid #dee2e6;border-radius:8px;padding:9px 14px;font-size:14px;" />
              </div>
            </div>

            <!-- Previsualización -->
            <div v-if="form.codigo && form.valor" style="background:#f8f9fa;border-radius:10px;padding:12px 16px;margin-top:16px;font-size:13px;">
              <strong>Vista previa:</strong> Código <code>{{ form.codigo }}</code> →
              <span v-if="form.tipo === 'porcentaje'" style="color:#e67700;font-weight:700;">{{ form.valor }}% OFF</span>
              <span v-else style="color:#2b8a3e;font-weight:700;">-${{ form.valor }} MXN</span>
              <span v-if="form.minimo_compra > 0" style="color:#868e96;"> · min ${{ form.minimo_compra }}</span>
            </div>

            <!-- Error -->
            <div v-if="errorModal" style="background:#fff5f5;color:#c92a2a;border-radius:8px;padding:8px 14px;font-size:13px;margin-top:12px;">
              {{ errorModal }}
            </div>

            <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:20px;">
              <button @click="cerrarModal()" style="background:#f1f3f5;color:#495057;border:none;border-radius:20px;padding:9px 22px;font-size:14px;font-weight:600;cursor:pointer;">
                Cancelar
              </button>
              <button @click="crear()" :disabled="guardando"
                style="background:#7950f2;color:#fff;border:none;border-radius:20px;padding:9px 22px;font-size:14px;font-weight:600;cursor:pointer;">
                {{ guardando ? 'Guardando...' : 'Crear cupón' }}
              </button>
            </div>
          </div>
        </div>

        <!-- MODAL CONFIRMAR ELIMINAR -->
        <div v-if="cuponAEliminar" style="position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:9999;">
          <div style="background:#fff;border-radius:16px;padding:32px;max-width:380px;width:90%;box-shadow:0 8px 40px rgba(0,0,0,.18);text-align:center;">
            <div style="font-size:40px;margin-bottom:12px;">🗑</div>
            <h5 style="font-weight:700;margin-bottom:8px;">¿Eliminar cupón?</h5>
            <p style="color:#868e96;font-size:14px;margin-bottom:24px;">
              El cupón <strong>{{ cuponAEliminar.codigo }}</strong> será eliminado permanentemente.
            </p>
            <div style="display:flex;gap:12px;justify-content:center;">
              <button @click="cuponAEliminar = null"
                style="background:#f1f3f5;color:#495057;border:none;border-radius:20px;padding:8px 22px;font-size:14px;font-weight:600;cursor:pointer;">
                Cancelar
              </button>
              <button @click="eliminar()" :disabled="eliminando"
                style="background:#c92a2a;color:#fff;border:none;border-radius:20px;padding:8px 22px;font-size:14px;font-weight:600;cursor:pointer;">
                {{ eliminando ? 'Eliminando...' : 'Sí, eliminar' }}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import TopNav  from '@/components/TopNav.vue';
import axios   from 'axios';

export default {
  name: 'CuponesApp',
  components: { Sidebar, TopNav },
  data() {
    return {
      loading: true,
      cupones: [],
      mostrarModal: false,
      guardando: false,
      errorModal: '',
      cuponAEliminar: null,
      eliminando: false,
      form: { codigo: '', tipo: 'porcentaje', valor: null, minimo_compra: 0, limite_usos: -1, expira: '' },
    };
  },
  mounted() {
    this.cargar();
  },
  methods: {
    headers() { return { Authorization: this.$store.state.token }; },
    async cargar() {
      this.loading = true;
      try {
        const res = await axios.get(this.$url + '/listar_cupones_admin', { headers: this.headers() });
        this.cupones = res.data || [];
      } catch (e) { console.error(e); }
      finally { this.loading = false; }
    },
    abrirModal() {
      this.form = { codigo: '', tipo: 'porcentaje', valor: null, minimo_compra: 0, limite_usos: -1, expira: '' };
      this.errorModal = '';
      this.mostrarModal = true;
    },
    cerrarModal() { this.mostrarModal = false; },
    async crear() {
      this.errorModal = '';
      if (!this.form.codigo) return (this.errorModal = 'El código es obligatorio.');
      if (!this.form.valor || this.form.valor <= 0) return (this.errorModal = 'El valor debe ser mayor a 0.');
      if (this.form.tipo === 'porcentaje' && this.form.valor > 100) return (this.errorModal = 'El porcentaje no puede ser mayor a 100.');
      this.guardando = true;
      try {
        await axios.post(this.$url + '/crear_cupon_admin', this.form, { headers: this.headers() });
        this.$notify({ type: 'success', title: 'Cupón creado correctamente' });
        this.cerrarModal();
        this.cargar();
      } catch (e) {
        this.errorModal = e?.response?.data?.message || 'Error al crear el cupón.';
      } finally { this.guardando = false; }
    },
    async toggleEstado(c) {
      try {
        const res = await axios.put(this.$url + '/toggle_cupon_admin/' + c._id, {}, { headers: this.headers() });
        c.activo = res.data.activo;
      } catch (e) {
        this.$notify({ type: 'error', title: 'Error al cambiar estado del cupón' });
      }
    },
    confirmarEliminar(c) { this.cuponAEliminar = c; },
    async eliminar() {
      if (!this.cuponAEliminar) return;
      this.eliminando = true;
      try {
        await axios.delete(this.$url + '/eliminar_cupon_admin/' + this.cuponAEliminar._id, { headers: this.headers() });
        this.$notify({ type: 'success', title: 'Cupón eliminado' });
        this.cuponAEliminar = null;
        this.cargar();
      } catch (e) {
        this.$notify({ type: 'error', title: 'Error al eliminar el cupón' });
      } finally { this.eliminando = false; }
    },
    formatFecha(d) {
      if (!d) return '—';
      return new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    },
  }
};
</script>
