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
          <span style="background:#4c6ef5;color:#fff;border-radius:20px;padding:2px 12px;font-weight:600;">👥 Clientes</span>
        </nav>
      </div>

      <div class="container-fluid" style="padding:24px 32px;">

        <!-- Header -->
        <div style="margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <div>
            <h2 style="font-weight:700;margin:0;">Gestión de Clientes</h2>
            <p style="color:#868e96;margin:4px 0 0;font-size:14px;">{{ total }} clientes registrados en total</p>
          </div>
          <button @click="verSospechosos" class="btn btn-sm"
            style="background:#fff3bf;color:#e67700;border:1px solid #fab005;font-weight:600;border-radius:20px;">
            ⚠️ Ver clientes bloqueados ({{ sospechososCount }})
          </button>
        </div>

        <!-- Alerta sospechosos -->
        <div v-if="mostrarSospechosos && sospechosos.length > 0"
          style="background:#fff3bf;border:1px solid #fab005;border-radius:12px;padding:16px 20px;margin-bottom:20px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <strong style="color:#e67700;">⚠️ Clientes bloqueados o con intentos fallidos</strong>
            <button @click="mostrarSospechosos=false" class="btn btn-sm btn-outline-secondary" style="font-size:11px;">Cerrar</button>
          </div>
          <div v-for="c in sospechosos" :key="c._id"
            style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid #ffe066;flex-wrap:wrap;">
            <div style="flex:1;min-width:200px;">
              <strong>{{ c.nombres }} {{ c.apellidos }}</strong>
              <div style="font-size:12px;color:#495057;">{{ c.email }}</div>
            </div>
            <span v-if="c.bloqueado" style="background:#ffe3e3;color:#c92a2a;padding:2px 10px;border-radius:20px;font-size:12px;font-weight:600;">🔒 Bloqueado</span>
            <span style="background:#fff;border:1px solid #fab005;border-radius:20px;padding:2px 10px;font-size:12px;">
              {{ c.login_intentos }} intentos fallidos
            </span>
            <span v-if="c.bloqueado" style="font-size:12px;color:#868e96;">
              Hasta: {{ formatFecha(c.login_bloqueado_hasta) }}
            </span>
            <button @click="desbloquear(c)" class="btn btn-sm"
              style="background:#4c6ef5;color:#fff;border-radius:20px;font-size:12px;font-weight:600;">
              Desbloquear
            </button>
          </div>
        </div>

        <!-- Búsqueda -->
        <div style="background:#fff;border-radius:12px;padding:16px 20px;box-shadow:0 1px 6px rgba(0,0,0,.07);margin-bottom:20px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
          <input v-model="busqueda" @keyup.enter="buscar" type="text" placeholder="Buscar por nombre o email..."
            style="flex:1;min-width:200px;border:1px solid #dee2e6;border-radius:8px;padding:8px 14px;font-size:14px;" />
          <button @click="buscar" class="btn btn-sm" style="background:#4c6ef5;color:#fff;border-radius:20px;font-weight:600;padding:8px 20px;">
            🔍 Buscar
          </button>
          <button @click="limpiar" class="btn btn-sm btn-outline-secondary" style="border-radius:20px;font-size:13px;">
            Limpiar
          </button>
        </div>

        <!-- Tabla de clientes -->
        <div style="background:#fff;border-radius:12px;box-shadow:0 1px 6px rgba(0,0,0,.07);overflow:hidden;">
          <div v-if="loading" style="padding:40px;text-align:center;color:#adb5bd;">Cargando clientes...</div>
          <div v-else-if="clientes.length === 0" style="padding:40px;text-align:center;color:#adb5bd;">
            No se encontraron clientes.
          </div>
          <div v-else>
            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <thead>
                  <tr style="background:#f8f9fa;border-bottom:2px solid #e9ecef;">
                    <th style="padding:12px 16px;text-align:left;font-weight:600;color:#495057;">Cliente</th>
                    <th style="padding:12px 16px;text-align:left;font-weight:600;color:#495057;">Email</th>
                    <th style="padding:12px 16px;text-align:center;font-weight:600;color:#495057;">Compras</th>
                    <th style="padding:12px 16px;text-align:left;font-weight:600;color:#495057;">Última compra</th>
                    <th style="padding:12px 16px;text-align:center;font-weight:600;color:#495057;">Estado</th>
                    <th style="padding:12px 16px;text-align:center;font-weight:600;color:#495057;">Seguridad</th>
                    <th style="padding:12px 16px;text-align:center;font-weight:600;color:#495057;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="c in clientes" :key="c._id"
                    :style="{ background: c.bloqueado ? '#fff5f5' : 'transparent' }"
                    style="border-bottom:1px solid #f1f3f5;">
                    <td style="padding:12px 16px;">
                      <div style="display:flex;align-items:center;gap:10px;">
                        <div style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:#fff;flex-shrink:0;"
                          :style="{ background: c.bloqueado ? '#c92a2a' : '#4c6ef5' }">
                          {{ (c.nombres || '?').charAt(0).toUpperCase() }}
                        </div>
                        <div>
                          <div style="font-weight:600;">{{ c.nombres }} {{ c.apellidos }}</div>
                          <div style="font-size:11px;color:#adb5bd;">Reg. {{ formatFecha(c.createdAt) }}</div>
                        </div>
                      </div>
                    </td>
                    <td style="padding:12px 16px;color:#495057;">{{ c.email }}</td>
                    <td style="padding:12px 16px;text-align:center;">
                      <span style="background:#e7f5ff;color:#1971c2;border-radius:20px;padding:2px 10px;font-size:13px;font-weight:600;">
                        {{ c.total_ventas }}
                      </span>
                    </td>
                    <td style="padding:12px 16px;color:#868e96;font-size:13px;">
                      {{ c.ultima_compra ? formatFecha(c.ultima_compra) : '—' }}
                    </td>
                    <td style="padding:12px 16px;text-align:center;">
                      <span v-if="c.estado" style="background:#ebfbee;color:#2b8a3e;border-radius:20px;padding:2px 10px;font-size:12px;font-weight:600;">● Activo</span>
                      <span v-else style="background:#fff5f5;color:#c92a2a;border-radius:20px;padding:2px 10px;font-size:12px;font-weight:600;">● Inactivo</span>
                    </td>
                    <td style="padding:12px 16px;text-align:center;">
                      <span v-if="c.bloqueado" style="background:#ffe3e3;color:#c92a2a;border-radius:20px;padding:2px 10px;font-size:12px;font-weight:600;">🔒 Bloqueado</span>
                      <span v-else-if="c.login_intentos >= 3" style="background:#fff3bf;color:#e67700;border-radius:20px;padding:2px 10px;font-size:12px;font-weight:600;">⚠️ {{ c.login_intentos }} intentos</span>
                      <span v-else style="color:#adb5bd;font-size:12px;">✓ OK</span>
                    </td>
                    <td style="padding:12px 16px;text-align:center;">
                      <button v-if="c.bloqueado || c.login_intentos >= 3"
                        @click="desbloquear(c)"
                        style="background:#4c6ef5;color:#fff;border:none;border-radius:20px;padding:4px 14px;font-size:12px;font-weight:600;cursor:pointer;">
                        Desbloquear
                      </button>
                      <span v-else style="color:#adb5bd;font-size:12px;">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Paginación -->
            <div style="padding:14px 20px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #f1f3f5;">
              <span style="font-size:13px;color:#868e96;">Mostrando {{ clientes.length }} de {{ total }}</span>
              <div style="display:flex;gap:8px;">
                <button @click="cambiarPagina(page - 1)" :disabled="page <= 1"
                  style="border:1px solid #dee2e6;background:#fff;border-radius:8px;padding:5px 14px;font-size:13px;cursor:pointer;"
                  :style="{ opacity: page <= 1 ? 0.5 : 1 }">← Ant.</button>
                <span style="border:1px solid #4c6ef5;background:#e7f5ff;border-radius:8px;padding:5px 14px;font-size:13px;color:#1971c2;font-weight:600;">{{ page }} / {{ pages }}</span>
                <button @click="cambiarPagina(page + 1)" :disabled="page >= pages"
                  style="border:1px solid #dee2e6;background:#fff;border-radius:8px;padding:5px 14px;font-size:13px;cursor:pointer;"
                  :style="{ opacity: page >= pages ? 0.5 : 1 }">Sig. →</button>
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
  name: 'IndexClientesApp',
  components: { Sidebar, TopNav },
  data() {
    return {
      loading: true,
      clientes: [],
      total: 0,
      page: 1,
      pages: 1,
      busqueda: '',
      mostrarSospechosos: false,
      sospechosos: [],
      sospechososCount: 0
    };
  },
  mounted() {
    this.cargarClientes();
    this.cargarSospechosos();
  },
  methods: {
    headers() {
      return { Authorization: this.$store.state.token };
    },
    async cargarClientes(p = 1) {
      this.loading = true;
      try {
        const params = { page: p, limit: 20 };
        if (this.busqueda) params.q = this.busqueda;
        const res = await axios.get(this.$url + '/listar_clientes_admin', { headers: this.headers(), params });
        this.clientes = res.data.data || [];
        this.total    = res.data.total || 0;
        this.page     = res.data.page  || 1;
        this.pages    = res.data.pages || 1;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async cargarSospechosos() {
      try {
        const res = await axios.get(this.$url + '/clientes_sospechosos_admin', { headers: this.headers() });
        this.sospechosos      = res.data || [];
        this.sospechososCount = this.sospechosos.length;
      } catch (e) { /* silenciar */ }
    },
    async desbloquear(cliente) {
      try {
        await axios.put(this.$url + '/desbloquear_cliente_admin/' + cliente._id, {}, { headers: this.headers() });
        this.$notify({ type: 'success', title: 'Cliente desbloqueado correctamente' });
        this.cargarClientes(this.page);
        this.cargarSospechosos();
      } catch (e) {
        this.$notify({ type: 'error', title: 'Error al desbloquear cliente' });
      }
    },
    buscar() {
      this.cargarClientes(1);
    },
    limpiar() {
      this.busqueda = '';
      this.cargarClientes(1);
    },
    cambiarPagina(p) {
      if (p < 1 || p > this.pages) return;
      this.cargarClientes(p);
    },
    verSospechosos() {
      this.mostrarSospechosos = !this.mostrarSospechosos;
    },
    formatFecha(f) {
      if (!f) return '—';
      return new Date(f).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  }
};
</script>
