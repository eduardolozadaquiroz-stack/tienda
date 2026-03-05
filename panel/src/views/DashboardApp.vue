<template>
  <div>
    <Sidebar />
    <div class="main-content">
      <TopNav />

      <div class="container-fluid" style="padding: 24px 32px;">

        <!-- Breadcrumb -->
        <div style="background:#f8f9fa;border-bottom:1px solid #e9ecef;padding:10px 0 10px;margin-bottom:24px;border-radius:8px;">
          <nav style="font-size:13px;padding:0 16px;">
            <span style="color:#868e96;">🏠 Panel</span>
            <span style="color:#ced4da;margin:0 6px;">/</span>
            <span style="background:#364fc7;color:#fff;border-radius:20px;padding:2px 12px;font-weight:600;">📊 Dashboard</span>
          </nav>
        </div>

        <!-- Bienvenida -->
        <div style="margin-bottom:28px;">
          <h2 style="font-weight:700;margin:0;">¡Bienvenido, {{ usuarioNombre }}! 👋</h2>
          <p style="color:#868e96;margin:4px 0 0;font-size:14px;">Panel de administración — {{ fechaHoy }}</p>
        </div>

        <!-- Tarjetas de estadísticas -->
        <div class="row g-3 mb-4">
          <div class="col-6 col-md-3">
            <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 1px 6px rgba(0,0,0,.07);border-left:4px solid #4c6ef5;">
              <div style="font-size:12px;color:#868e96;text-transform:uppercase;font-weight:600;letter-spacing:.5px;">Colaboradores</div>
              <div style="font-size:32px;font-weight:700;color:#4c6ef5;margin:6px 0 2px;">{{ totalColaboradores }}</div>
              <div style="font-size:12px;color:#adb5bd;">registrados</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 1px 6px rgba(0,0,0,.07);border-left:4px solid #12b886;">
              <div style="font-size:12px;color:#868e96;text-transform:uppercase;font-weight:600;letter-spacing:.5px;">Productos</div>
              <div style="font-size:32px;font-weight:700;color:#12b886;margin:6px 0 2px;">{{ totalProductos }}</div>
              <div style="font-size:12px;color:#adb5bd;">en catálogo</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 1px 6px rgba(0,0,0,.07);border-left:4px solid #f59f00;">
              <div style="font-size:12px;color:#868e96;text-transform:uppercase;font-weight:600;letter-spacing:.5px;">Ventas este mes</div>
              <div style="font-size:32px;font-weight:700;color:#f59f00;margin:6px 0 2px;">{{ totalVentas }}</div>
              <div style="font-size:12px;color:#adb5bd;">pedidos</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 1px 6px rgba(0,0,0,.07);border-left:4px solid #e03131;">
              <div style="font-size:12px;color:#868e96;text-transform:uppercase;font-weight:600;letter-spacing:.5px;">Accesos rápidos</div>
              <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
                <router-link to="/producto/create" style="font-size:11px;background:#e7f5ff;color:#1971c2;padding:3px 10px;border-radius:20px;text-decoration:none;font-weight:600;">+ Producto</router-link>
                <router-link to="/ingreso/create" style="font-size:11px;background:#fff3bf;color:#e67700;padding:3px 10px;border-radius:20px;text-decoration:none;font-weight:600;">+ Ingreso</router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4">

          <!-- Colaboradores recientes -->
          <div class="col-12">
            <div style="background:#fff;border-radius:12px;box-shadow:0 1px 6px rgba(0,0,0,.07);overflow:hidden;">
              <div style="padding:18px 20px;border-bottom:1px solid #f1f3f5;display:flex;justify-content:space-between;align-items:center;">
                <span style="font-weight:700;font-size:15px;">👥 Colaboradores</span>
                <router-link to="/colaborador/create" style="font-size:12px;background:#4c6ef5;color:#fff !important;padding:5px 16px;border-radius:20px;text-decoration:none;font-weight:600;line-height:1.5;">+ Nuevo</router-link>
              </div>
              <div v-if="loadColaboradores" style="padding:30px;text-align:center;color:#adb5bd;">Cargando...</div>
              <div v-if="!loadColaboradores">
                <div v-for="item in colaboradores" :key="item._id"
                  style="padding:14px 20px;border-bottom:1px solid #f8f9fa;display:flex;align-items:center;gap:14px;">
                  <div style="width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;color:#fff;flex-shrink:0;"
                    :style="{background: item.rol === 'ADMIN' ? '#4c6ef5' : '#12b886'}">
                    {{ item.nombres.charAt(0).toUpperCase() }}
                  </div>
                  <div style="flex:1;min-width:0;">
                    <div style="font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ item.nombres }} {{ item.apellidos }}</div>
                    <div style="font-size:12px;color:#868e96;">{{ item.email }}</div>
                  </div>
                  <div>
                    <span v-if="item.rol === 'ADMIN'" style="font-size:11px;background:#e7f5ff;color:#1971c2;padding:2px 10px;border-radius:20px;font-weight:600;">👑 Admin</span>
                    <span v-else style="font-size:11px;background:#ebfbee;color:#2b8a3e;padding:2px 10px;border-radius:20px;font-weight:600;">👤 Colab.</span>
                  </div>
                  <div>
                    <span v-if="item.estado" style="font-size:11px;color:#2b8a3e;">● Activo</span>
                    <span v-else style="font-size:11px;color:#c92a2a;">● Inactivo</span>
                  </div>
                </div>
                <div v-if="colaboradores.length === 0" style="padding:30px;text-align:center;color:#adb5bd;">No hay colaboradores registrados.</div>
                <div style="padding:12px 20px;text-align:right;">
                  <router-link to="/colaborador" style="font-size:12px;color:#4c6ef5;text-decoration:none;font-weight:600;">Ver todos →</router-link>
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
import TopNav from '@/components/TopNav.vue';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

export default {
  name: 'DashboardApp',
  components: { Sidebar, TopNav },
  data() {
    return {
      loadColaboradores: true,
      colaboradores: [],
      totalProductos: 0,
      totalVentas: 0,
    };
  },
  computed: {
    usuarioNombre() {
      try {
        const d = jwt_decode(this.$store.state.token);
        return d.nombres ? d.nombres.split(' ')[0] : 'Admin';
      } catch { return 'Admin'; }
    },
    usuarioId() {
      try {
        const d = jwt_decode(this.$store.state.token);
        return d.sub;
      } catch { return null; }
    },
    fechaHoy() {
      return new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    },
    totalColaboradores() {
      return this.colaboradores.length;
    }
  },
  mounted() {
    this.cargarDatos();
  },
  methods: {
    async cargarDatos() {
      const headers = { 'Authorization': this.$store.state.token };
      try {
        const resColab = await axios.get(this.$url + '/listar_usuario_admin/', { headers });
        this.colaboradores = Array.isArray(resColab.data) ? resColab.data : [];
        this.loadColaboradores = false;

        const resProd = await axios.get(this.$url + '/listar_productos_admin/', { headers });
        this.totalProductos = Array.isArray(resProd.data) ? resProd.data.length : 0;

        const ahora = new Date();
        const inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString().split('T')[0];
        const hasta  = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0).toISOString().split('T')[0];
        const resVentas = await axios.get(this.$url + `/obtener_ventas_admin/${inicio}/${hasta}`, { headers });
        this.totalVentas = Array.isArray(resVentas.data) ? resVentas.data.length : 0;

      } catch (e) {
        this.loadColaboradores = false;
        console.error(e);
      }
    }
  }
}
</script>
