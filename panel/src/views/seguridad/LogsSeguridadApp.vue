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
          <span style="background:#c92a2a;color:#fff;border-radius:20px;padding:2px 12px;font-weight:600;">🛡️ Logs de Seguridad</span>
        </nav>
      </div>

      <div class="container-fluid" style="padding:24px 32px;">

        <!-- Header + resumen -->
        <div style="margin-bottom:24px;">
          <h2 style="font-weight:700;margin:0;">Logs de Seguridad</h2>
          <p style="color:#868e96;margin:4px 0 0;font-size:14px;">Registro de eventos de seguridad de las últimas 24 horas y búsqueda histórica</p>
        </div>

        <!-- Tarjetas de resumen 24h -->
        <div class="row g-3 mb-4" v-if="resumen.length > 0">
          <div class="col-6 col-md-3" v-for="item in resumenTop" :key="item._id.event + item._id.level">
            <div style="background:#fff;border-radius:12px;padding:16px 18px;box-shadow:0 1px 6px rgba(0,0,0,.07);"
              :style="{ borderLeft: '4px solid ' + colorNivel(item._id.level) }">
              <div style="font-size:11px;color:#868e96;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">
                {{ item._id.event }}
              </div>
              <div style="font-size:28px;font-weight:700;margin:4px 0;" :style="{ color: colorNivel(item._id.level) }">
                {{ item.count }}
              </div>
              <span style="font-size:11px;border-radius:20px;padding:1px 8px;font-weight:600;"
                :style="{ background: bgNivel(item._id.level), color: colorNivel(item._id.level) }">
                {{ item._id.level }}
              </span>
            </div>
          </div>
        </div>

        <!-- Filtros -->
        <div style="background:#fff;border-radius:12px;padding:16px 20px;box-shadow:0 1px 6px rgba(0,0,0,.07);margin-bottom:20px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
          <select v-model="filtroLevel" style="border:1px solid #dee2e6;border-radius:8px;padding:7px 14px;font-size:14px;">
            <option value="">Todos los niveles</option>
            <option value="SECURITY">🔴 SECURITY</option>
            <option value="ERROR">🟠 ERROR</option>
            <option value="WARN">🟡 WARN</option>
            <option value="INFO">🔵 INFO</option>
          </select>
          <input v-model="filtroEvent" @keyup.enter="buscar" type="text" placeholder="Filtrar por evento (LOGIN_FAILURE...)"
            style="flex:1;min-width:180px;border:1px solid #dee2e6;border-radius:8px;padding:8px 14px;font-size:14px;" />
          <input v-model="filtroIp" @keyup.enter="buscar" type="text" placeholder="Filtrar por IP"
            style="width:160px;border:1px solid #dee2e6;border-radius:8px;padding:8px 14px;font-size:14px;" />
          <button @click="buscar" style="background:#c92a2a;color:#fff;border:none;border-radius:20px;padding:8px 20px;font-size:13px;font-weight:600;cursor:pointer;">
            🔍 Buscar
          </button>
          <button @click="limpiar" style="background:#f1f3f5;color:#495057;border:none;border-radius:20px;padding:8px 16px;font-size:13px;cursor:pointer;">
            Limpiar
          </button>
        </div>

        <!-- Tabla de logs -->
        <div style="background:#fff;border-radius:12px;box-shadow:0 1px 6px rgba(0,0,0,.07);overflow:hidden;">
          <div v-if="loading" style="padding:40px;text-align:center;color:#adb5bd;">Cargando logs...</div>
          <div v-else-if="logs.length === 0" style="padding:40px;text-align:center;color:#adb5bd;">
            No hay eventos en este período con los filtros seleccionados.
          </div>
          <div v-else style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
              <thead>
                <tr style="background:#f8f9fa;border-bottom:2px solid #e9ecef;">
                  <th style="padding:10px 14px;text-align:left;font-weight:600;color:#495057;white-space:nowrap;">Fecha</th>
                  <th style="padding:10px 14px;text-align:left;font-weight:600;color:#495057;">Nivel</th>
                  <th style="padding:10px 14px;text-align:left;font-weight:600;color:#495057;">Evento</th>
                  <th style="padding:10px 14px;text-align:left;font-weight:600;color:#495057;">IP</th>
                  <th style="padding:10px 14px;text-align:left;font-weight:600;color:#495057;">Email / Usuario</th>
                  <th style="padding:10px 14px;text-align:left;font-weight:600;color:#495057;">Detalle</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in logs" :key="log._id"
                  :style="{ background: log.level === 'SECURITY' ? '#fff5f5' : log.level === 'ERROR' ? '#fff9f0' : 'transparent' }"
                  style="border-bottom:1px solid #f1f3f5;">
                  <td style="padding:10px 14px;color:#868e96;white-space:nowrap;">{{ formatFecha(log.createdAt) }}</td>
                  <td style="padding:10px 14px;">
                    <span style="border-radius:20px;padding:2px 8px;font-size:11px;font-weight:700;"
                      :style="{ background: bgNivel(log.level), color: colorNivel(log.level) }">
                      {{ log.level }}
                    </span>
                  </td>
                  <td style="padding:10px 14px;">
                    <code style="font-size:12px;background:#f8f9fa;padding:2px 6px;border-radius:4px;">{{ log.event }}</code>
                  </td>
                  <td style="padding:10px 14px;font-family:monospace;font-size:12px;color:#495057;">{{ log.ip }}</td>
                  <td style="padding:10px 14px;color:#495057;font-size:12px;">
                    {{ log.email || log.userId || '—' }}
                  </td>
                  <td style="padding:10px 14px;color:#868e96;font-size:12px;max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                    {{ log.resource || log.detail || (log.extra ? JSON.stringify(log.extra) : '—') }}
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Paginación -->
            <div style="padding:14px 20px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #f1f3f5;">
              <span style="font-size:13px;color:#868e96;">{{ total }} eventos encontrados</span>
              <div style="display:flex;gap:8px;">
                <button @click="cambiarPagina(page - 1)" :disabled="page <= 1"
                  style="border:1px solid #dee2e6;background:#fff;border-radius:8px;padding:5px 14px;font-size:13px;cursor:pointer;"
                  :style="{ opacity: page <= 1 ? 0.5 : 1 }">← Ant.</button>
                <span style="border:1px solid #c92a2a;background:#fff5f5;border-radius:8px;padding:5px 14px;font-size:13px;color:#c92a2a;font-weight:600;">{{ page }} / {{ pages }}</span>
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
  name: 'LogsSeguridadApp',
  components: { Sidebar, TopNav },
  data() {
    return {
      loading: true,
      logs: [],
      total: 0,
      page: 1,
      pages: 1,
      filtroLevel: 'SECURITY',
      filtroEvent: '',
      filtroIp: '',
      resumen: []
    };
  },
  computed: {
    resumenTop() {
      return this.resumen.slice(0, 4);
    }
  },
  mounted() {
    this.cargarLogs();
    this.cargarResumen();
  },
  methods: {
    headers() {
      return { Authorization: this.$store.state.token };
    },
    async cargarLogs(p = 1) {
      this.loading = true;
      try {
        const params = { page: p, limit: 50 };
        if (this.filtroLevel) params.level  = this.filtroLevel;
        if (this.filtroEvent) params.event  = this.filtroEvent;
        if (this.filtroIp)    params.ip     = this.filtroIp;
        const res = await axios.get(this.$url + '/logs_seguridad_admin', { headers: this.headers(), params });
        this.logs  = res.data.data  || [];
        this.total = res.data.total || 0;
        this.page  = res.data.page  || 1;
        this.pages = res.data.pages || 1;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async cargarResumen() {
      try {
        const res = await axios.get(this.$url + '/resumen_logs_admin', { headers: this.headers() });
        this.resumen = res.data || [];
      } catch (e) { /* silenciar */ }
    },
    buscar() { this.cargarLogs(1); },
    limpiar() {
      this.filtroLevel = '';
      this.filtroEvent = '';
      this.filtroIp    = '';
      this.cargarLogs(1);
    },
    cambiarPagina(p) {
      if (p < 1 || p > this.pages) return;
      this.cargarLogs(p);
    },
    formatFecha(f) {
      if (!f) return '—';
      return new Date(f).toLocaleString('es-MX', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit' });
    },
    colorNivel(level) {
      const m = { SECURITY: '#c92a2a', ERROR: '#e67700', WARN: '#e67700', INFO: '#1971c2' };
      return m[level] || '#495057';
    },
    bgNivel(level) {
      const m = { SECURITY: '#ffe3e3', ERROR: '#fff3bf', WARN: '#fff3bf', INFO: '#e7f5ff' };
      return m[level] || '#f8f9fa';
    }
  }
};
</script>
