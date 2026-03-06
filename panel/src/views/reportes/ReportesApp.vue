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
          <span style="background:#1971c2;color:#fff;border-radius:20px;padding:2px 12px;font-weight:600;">📊 Reportes</span>
        </nav>
      </div>

      <div class="container-fluid" style="padding:24px 32px;">

        <div style="margin-bottom:24px;">
          <h2 style="font-weight:700;margin:0;">Reportes y Analíticas</h2>
          <p style="color:#868e96;margin:4px 0 0;font-size:14px;">Últimos 30 días — actualizado ahora</p>
        </div>

        <!-- KPIs -->
        <div class="row g-3 mb-4">
          <div class="col-6 col-md-3">
            <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 1px 6px rgba(0,0,0,.07);border-left:4px solid #4c6ef5;">
              <div style="font-size:11px;color:#868e96;text-transform:uppercase;font-weight:600;letter-spacing:.5px;">Ingresos del mes</div>
              <div style="font-size:24px;font-weight:700;color:#4c6ef5;margin:8px 0 2px;">{{ formatCurrency(kpis.ingresoMes) }}</div>
              <div style="font-size:12px;color:#adb5bd;">MXN</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 1px 6px rgba(0,0,0,.07);border-left:4px solid #f59f00;">
              <div style="font-size:11px;color:#868e96;text-transform:uppercase;font-weight:600;letter-spacing:.5px;">Pedidos del mes</div>
              <div style="font-size:32px;font-weight:700;color:#f59f00;margin:8px 0 2px;">{{ kpis.totalMes }}</div>
              <div style="font-size:12px;color:#adb5bd;">pedidos</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 1px 6px rgba(0,0,0,.07);border-left:4px solid #2b8a3e;">
              <div style="font-size:11px;color:#868e96;text-transform:uppercase;font-weight:600;letter-spacing:.5px;">Ticket promedio</div>
              <div style="font-size:24px;font-weight:700;color:#2b8a3e;margin:8px 0 2px;">{{ formatCurrency(ticketPromedio) }}</div>
              <div style="font-size:12px;color:#adb5bd;">por pedido</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 1px 6px rgba(0,0,0,.07);border-left:4px solid #c92a2a;">
              <div style="font-size:11px;color:#868e96;text-transform:uppercase;font-weight:600;letter-spacing:.5px;">Bajo stock</div>
              <div style="font-size:32px;font-weight:700;color:#c92a2a;margin:8px 0 2px;">{{ bajoStock.length }}</div>
              <div style="font-size:12px;color:#adb5bd;">productos ≤5 u.</div>
            </div>
          </div>
        </div>

        <div class="row g-4">

          <!-- Gráfica de ventas por día -->
          <div class="col-12 col-lg-7">
            <div style="background:#fff;border-radius:12px;box-shadow:0 1px 6px rgba(0,0,0,.07);padding:22px;">
              <div style="font-weight:700;font-size:15px;margin-bottom:16px;">📈 Ventas diarias (últimos 30 días)</div>
              <div v-if="loadingChart" style="height:220px;display:flex;align-items:center;justify-content:center;color:#adb5bd;">Cargando...</div>
              <canvas v-else ref="chartVentas" style="width:100%;max-height:220px;"></canvas>
            </div>
          </div>

          <!-- Estados del mes -->
          <div class="col-12 col-lg-5">
            <div style="background:#fff;border-radius:12px;box-shadow:0 1px 6px rgba(0,0,0,.07);padding:22px;">
              <div style="font-weight:700;font-size:15px;margin-bottom:16px;">📦 Pedidos por estado (este mes)</div>
              <div v-if="loadingChart" style="height:220px;display:flex;align-items:center;justify-content:center;color:#adb5bd;">Cargando...</div>
              <canvas v-else ref="chartEstados" style="width:100%;max-height:220px;"></canvas>
            </div>
          </div>

          <!-- Top productos -->
          <div class="col-12 col-lg-6">
            <div style="background:#fff;border-radius:12px;box-shadow:0 1px 6px rgba(0,0,0,.07);overflow:hidden;">
              <div style="padding:18px 20px;border-bottom:1px solid #f1f3f5;font-weight:700;font-size:15px;">🏆 Top 10 productos más vendidos</div>
              <div v-if="loadingTop" style="padding:30px;text-align:center;color:#adb5bd;">Cargando...</div>
              <div v-else-if="topProductos.length === 0" style="padding:30px;text-align:center;color:#adb5bd;">Sin ventas en los últimos 90 días.</div>
              <div v-else>
                <div v-for="(p, i) in topProductos" :key="p._id"
                  style="display:flex;align-items:center;gap:12px;padding:12px 20px;border-bottom:1px solid #f8f9fa;">
                  <!-- Rank -->
                  <div style="width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0;"
                    :style="{ background: i===0?'#f59f00': i===1?'#adb5bd': i===2?'#cd7f32':'#e7f5ff', color: i<3?'#fff':'#1971c2' }">
                    {{ i + 1 }}
                  </div>
                  <!-- Imagen -->
                  <img :src="$imgSrc(p.portada, 'productos')" style="width:38px;height:38px;object-fit:cover;border-radius:8px;flex-shrink:0;" />
                  <!-- Info -->
                  <div style="flex:1;min-width:0;">
                    <div style="font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ p.titulo }}</div>
                    <div style="font-size:11px;color:#868e96;">{{ formatCurrency(p.ingresos) }} en ingresos</div>
                  </div>
                  <!-- Cantidad -->
                  <div style="text-align:right;flex-shrink:0;">
                    <div style="font-weight:700;color:#4c6ef5;font-size:15px;">{{ p.total_vendido }}</div>
                    <div style="font-size:10px;color:#adb5bd;">unidades</div>
                  </div>
                  <!-- Barra proporcional -->
                  <div style="width:60px;flex-shrink:0;">
                    <div style="height:6px;background:#f1f3f5;border-radius:3px;overflow:hidden;">
                      <div style="height:100%;background:#4c6ef5;border-radius:3px;"
                        :style="{ width: Math.round((p.total_vendido / topProductos[0].total_vendido) * 100) + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Productos bajo stock -->
          <div class="col-12 col-lg-6">
            <div style="background:#fff;border-radius:12px;box-shadow:0 1px 6px rgba(0,0,0,.07);overflow:hidden;">
              <div style="padding:18px 20px;border-bottom:1px solid #f1f3f5;display:flex;align-items:center;justify-content:space-between;">
                <span style="font-weight:700;font-size:15px;">⚠️ Productos con bajo stock (≤5)</span>
                <router-link to="/producto" style="font-size:12px;color:#4c6ef5;text-decoration:none;font-weight:600;">Ver todos →</router-link>
              </div>
              <div v-if="loadingStock" style="padding:30px;text-align:center;color:#adb5bd;">Cargando...</div>
              <div v-else-if="bajoStock.length === 0" style="padding:30px;text-align:center;">
                <div style="font-size:28px;margin-bottom:8px;">✅</div>
                <div style="color:#2b8a3e;font-weight:600;">¡Todo el inventario está bien!</div>
              </div>
              <div v-else>
                <div v-for="p in bajoStock.slice(0,10)" :key="p._id"
                  style="display:flex;align-items:center;gap:12px;padding:10px 20px;border-bottom:1px solid #f8f9fa;">
                  <img :src="$imgSrc(p.portada, 'productos')" style="width:36px;height:36px;object-fit:cover;border-radius:8px;flex-shrink:0;" />
                  <div style="flex:1;min-width:0;">
                    <div style="font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ p.titulo }}</div>
                    <div style="font-size:11px;color:#868e96;">{{ p.categoria }}</div>
                  </div>
                  <div style="flex-shrink:0;text-align:right;">
                    <span :style="{ background: p.stock_efectivo === 0 ? '#fff5f5' : '#fff3bf', color: p.stock_efectivo === 0 ? '#c92a2a' : '#e67700' }"
                      style="border-radius:20px;padding:3px 12px;font-size:12px;font-weight:700;">
                      {{ p.stock_efectivo === 0 ? '⛔ Sin stock' : `⚠️ ${p.stock_efectivo} u.` }}
                    </span>
                  </div>
                  <router-link :to="'/producto/edit/'+p._id"
                    style="font-size:11px;color:#4c6ef5;text-decoration:none;font-weight:600;flex-shrink:0;">
                    Editar
                  </router-link>
                </div>
                <div v-if="bajoStock.length > 10" style="padding:10px 20px;font-size:13px;color:#868e96;text-align:center;">
                  + {{ bajoStock.length - 10 }} más productos con bajo stock
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
  name: 'ReportesApp',
  components: { Sidebar, TopNav },
  data() {
    return {
      loadingChart: true,
      loadingTop: true,
      loadingStock: true,
      kpis: { ingresoMes: 0, totalMes: 0, pendientes: 0, completadas: 0, canceladas: 0, enCamino: 0, porDia: [] },
      topProductos: [],
      bajoStock: [],
      chartVentasInstance: null,
      chartEstadosInstance: null,
    };
  },
  computed: {
    ticketPromedio() {
      return this.kpis.totalMes > 0 ? this.kpis.ingresoMes / this.kpis.totalMes : 0;
    },
  },
  mounted() {
    this.cargarDatos();
  },
  beforeUnmount() {
    if (this.chartVentasInstance) this.chartVentasInstance.destroy();
    if (this.chartEstadosInstance) this.chartEstadosInstance.destroy();
  },
  methods: {
    headers() { return { Authorization: this.$store.state.token }; },
    async cargarDatos() {
      try {
        const [resResumen, resTop, resStock] = await Promise.all([
          axios.get(this.$url + '/resumen_ventas_admin', { headers: this.headers() }),
          axios.get(this.$url + '/top_productos_admin?limit=10', { headers: this.headers() }),
          axios.get(this.$url + '/productos_bajo_stock_admin?umbral=5', { headers: this.headers() }),
        ]);
        this.kpis       = resResumen.data || this.kpis;
        this.topProductos = resTop.data || [];
        this.bajoStock    = resStock.data?.data || [];
        this.loadingTop   = false;
        this.loadingStock = false;
        this.cargarChartJS();
      } catch (e) {
        console.error(e);
        this.loadingChart = false;
        this.loadingTop   = false;
        this.loadingStock = false;
      }
    },
    cargarChartJS() {
      if (window.Chart) {
        this.renderCharts();
        return;
      }
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
      s.onload = () => this.renderCharts();
      s.onerror = () => { this.loadingChart = false; };
      document.head.appendChild(s);
    },
    renderCharts() {
      this.loadingChart = false;
      this.$nextTick(() => {
        this.renderLineChart();
        this.renderDoughnutChart();
      });
    },
    renderLineChart() {
      const porDia = this.kpis.porDia || [];
      // Rellenar los últimos 30 días con 0 donde no hay datos
      const dias = [];
      const totales = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        dias.push(d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }));
        const found = porDia.find(p => p._id === key);
        totales.push(found ? found.total : 0);
      }
      const ctx = this.$refs.chartVentas;
      if (!ctx) return;
      if (this.chartVentasInstance) this.chartVentasInstance.destroy();
      this.chartVentasInstance = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: dias,
          datasets: [{
            label: 'Ingresos ($)',
            data: totales,
            borderColor: '#4c6ef5',
            backgroundColor: 'rgba(76,110,245,0.08)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { callback: v => '$' + v.toLocaleString('es-MX') } } }
        }
      });
    },
    renderDoughnutChart() {
      const ctx = this.$refs.chartEstados;
      if (!ctx) return;
      if (this.chartEstadosInstance) this.chartEstadosInstance.destroy();
      this.chartEstadosInstance = new window.Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Pendientes', 'En camino', 'Completados', 'Cancelados'],
          datasets: [{
            data: [this.kpis.pendientes, this.kpis.enCamino, this.kpis.completadas, this.kpis.canceladas],
            backgroundColor: ['#ffd43b', '#74c0fc', '#51cf66', '#ff6b6b'],
            borderWidth: 0,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { boxWidth: 14, font: { size: 12 } } }
          }
        }
      });
    },
    formatCurrency(n) {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n || 0);
    },
  }
};
</script>
