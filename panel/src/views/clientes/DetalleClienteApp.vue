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
          <router-link to="/clientes" style="color:#4c6ef5;text-decoration:none;font-weight:600;">👥 Clientes</router-link>
          <span style="color:#ced4da;margin:0 6px;">/</span>
          <span style="background:#4c6ef5;color:#fff;border-radius:20px;padding:2px 12px;font-weight:600;">Detalle</span>
        </nav>
      </div>

      <div class="container-fluid" style="padding:24px 32px;">

        <div v-if="loading" style="padding:60px;text-align:center;color:#adb5bd;">Cargando información del cliente...</div>

        <div v-else-if="!cliente" style="padding:60px;text-align:center;">
          <div style="font-size:48px;margin-bottom:12px;">⚠️</div>
          <div style="color:#c92a2a;font-weight:600;font-size:16px;margin-bottom:8px;">{{ errorMsg || 'Cliente no encontrado.' }}</div>
          <div style="color:#adb5bd;font-size:13px;margin-bottom:20px;">Si el problema persiste, el backend puede necesitar reinicio.</div>
          <router-link to="/clientes" style="background:#4c6ef5;color:#fff;border-radius:20px;padding:8px 22px;font-size:13px;font-weight:600;text-decoration:none;">← Volver a Clientes</router-link>
        </div>

        <div v-else>

          <!-- Botón volver -->
          <div style="margin-bottom:20px;">
            <router-link to="/clientes"
              style="background:#f1f3f5;color:#495057;border-radius:20px;padding:6px 18px;font-size:13px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">
              ← Volver a Clientes
            </router-link>
          </div>

          <div class="row g-4">

            <!-- Card info cliente -->
            <div class="col-12 col-md-4">
              <div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 1px 6px rgba(0,0,0,.07);">
                <!-- Avatar -->
                <div style="text-align:center;margin-bottom:20px;">
                  <div style="width:72px;height:72px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:28px;color:#fff;"
                    :style="{ background: cliente.bloqueado ? '#c92a2a' : '#4c6ef5' }">
                    {{ (cliente.nombres || '?').charAt(0).toUpperCase() }}
                  </div>
                  <div style="font-size:20px;font-weight:700;margin-top:10px;">{{ cliente.nombres }} {{ cliente.apellidos }}</div>
                  <div style="font-size:13px;color:#868e96;margin-top:2px;">{{ cliente.email }}</div>
                </div>

                <!-- Badges -->
                <div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:18px;">
                  <span v-if="cliente.estado" style="background:#ebfbee;color:#2b8a3e;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:600;">● Activo</span>
                  <span v-else style="background:#fff5f5;color:#c92a2a;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:600;">● Inactivo</span>
                  <span v-if="cliente.bloqueado" style="background:#ffe3e3;color:#c92a2a;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:600;">🔒 Bloqueado</span>
                </div>

                <!-- Datos -->
                <div style="font-size:13px;border-top:1px solid #f1f3f5;padding-top:16px;">
                  <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f8f9fa;">
                    <span style="color:#868e96;">Intentos fallidos</span>
                    <strong :style="{ color: cliente.login_intentos >= 3 ? '#e67700' : '#2b8a3e' }">{{ cliente.login_intentos }}</strong>
                  </div>
                  <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f8f9fa;">
                    <span style="color:#868e96;">Registrado</span>
                    <span>{{ formatFecha(cliente.createdAt) }}</span>
                  </div>
                  <div v-if="cliente.bloqueado && cliente.login_bloqueado_hasta" style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f8f9fa;">
                    <span style="color:#868e96;">Bloqueado hasta</span>
                    <span style="color:#c92a2a;">{{ formatFechaHora(cliente.login_bloqueado_hasta) }}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;padding:6px 0;">
                    <span style="color:#868e96;">Total pedidos</span>
                    <strong style="color:#4c6ef5;">{{ ventas.length }}</strong>
                  </div>
                </div>

                <!-- Estadísticas compras -->
                <div v-if="ventas.length > 0" style="background:#f8f9fa;border-radius:10px;padding:14px;margin-top:16px;font-size:13px;">
                  <div style="font-weight:600;margin-bottom:8px;color:#495057;">💰 Resumen de compras</div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                    <span style="color:#868e96;">Total gastado</span>
                    <strong style="color:#2b8a3e;">{{ formatCurrency(totalGastado) }}</strong>
                  </div>
                  <div style="display:flex;justify-content:space-between;">
                    <span style="color:#868e96;">Promedio por pedido</span>
                    <span>{{ formatCurrency(totalGastado / ventas.length) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Historial de pedidos -->
            <div class="col-12 col-md-8">
              <div style="background:#fff;border-radius:12px;box-shadow:0 1px 6px rgba(0,0,0,.07);overflow:hidden;">
                <div style="padding:18px 20px;border-bottom:1px solid #f1f3f5;">
                  <span style="font-weight:700;font-size:15px;">📦 Historial de Pedidos ({{ ventas.length }})</span>
                </div>
                <div v-if="ventas.length === 0" style="padding:40px;text-align:center;color:#adb5bd;">
                  Este cliente no tiene pedidos registrados.
                </div>
                <div v-else style="overflow-x:auto;">
                  <table style="width:100%;border-collapse:collapse;font-size:13px;">
                    <thead>
                      <tr style="background:#f8f9fa;border-bottom:2px solid #e9ecef;">
                        <th style="padding:10px 16px;text-align:left;font-weight:600;color:#495057;">Pedido</th>
                        <th style="padding:10px 16px;text-align:right;font-weight:600;color:#495057;">Total</th>
                        <th style="padding:10px 16px;text-align:center;font-weight:600;color:#495057;">Estado</th>
                        <th style="padding:10px 16px;text-align:center;font-weight:600;color:#495057;">Fecha</th>
                        <th style="padding:10px 16px;text-align:center;font-weight:600;color:#495057;"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="v in ventasOrdenadas" :key="v._id" style="border-bottom:1px solid #f1f3f5;">
                        <td style="padding:10px 16px;font-weight:600;color:#4c6ef5;">
                          #{{ String(v.serie).padStart(6,'0') }}
                        </td>
                        <td style="padding:10px 16px;text-align:right;font-weight:600;">
                          {{ formatCurrency(v.total + (v.envio || 0)) }}
                        </td>
                        <td style="padding:10px 16px;text-align:center;">
                          <span :style="badgeEstado(v.estado)" style="border-radius:20px;padding:3px 12px;font-size:11px;font-weight:600;">
                            {{ v.estado || 'PENDIENTE' }}
                          </span>
                        </td>
                        <td style="padding:10px 16px;text-align:center;color:#868e96;font-size:12px;white-space:nowrap;">
                          {{ formatFecha(v.createdAt) }}
                        </td>
                        <td style="padding:10px 16px;text-align:center;">
                          <router-link :to="'/ventas/'+v._id"
                            style="background:#e7f5ff;color:#1971c2;border-radius:20px;padding:3px 12px;font-size:11px;font-weight:600;text-decoration:none;">
                            Ver
                          </router-link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
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
  name: 'DetalleClienteApp',
  components: { Sidebar, TopNav },
  data() {
    return {
      loading: true,
      cliente: null,
      ventas: [],
      errorMsg: '',
    };
  },
  computed: {
    totalGastado() {
      return this.ventas.reduce((sum, v) => sum + (v.total || 0) + (v.envio || 0), 0);
    },
    ventasOrdenadas() {
      return [...this.ventas].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
  },
  mounted() {
    this.cargar();
  },
  methods: {
    async cargar() {
      this.loading = true;
      try {
        const res = await axios.get(this.$url + '/detalle_cliente_admin/' + this.$route.params.id, {
          headers: { Authorization: this.$store.state.token }
        });
        this.cliente = res.data.cliente || null;
        this.ventas  = res.data.ventas  || [];
      } catch (e) {
        console.error('Error cargando cliente:', e?.response?.status, e?.response?.data || e.message);
        this.errorMsg = e?.response?.status === 404
          ? 'Cliente no encontrado.'
          : (e?.response?.status === 401 ? 'Sin autorización.' : 'Error al conectar con el servidor. Verifica que el backend esté activo.');
        this.cliente = null;
      } finally {
        this.loading = false;
      }
    },
    formatFecha(d) {
      if (!d) return '—';
      return new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    },
    formatFechaHora(d) {
      if (!d) return '—';
      return new Date(d).toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    formatCurrency(n) {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n || 0);
    },
    badgeEstado(estado) {
      const map = {
        COMPLETADO:  { background:'#ebfbee', color:'#2b8a3e' },
        EN_CAMINO:   { background:'#e7f5ff', color:'#1971c2' },
        PENDIENTE:   { background:'#fff3bf', color:'#e67700' },
        CANCELADO:   { background:'#fff5f5', color:'#c92a2a' },
      };
      return map[estado] || { background:'#f1f3f5', color:'#495057' };
    },
  }
};
</script>
