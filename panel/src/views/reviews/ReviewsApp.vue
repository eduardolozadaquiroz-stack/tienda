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
          <span style="background:#f59f00;color:#fff;border-radius:20px;padding:2px 12px;font-weight:600;">⭐ Reseñas</span>
        </nav>
      </div>

      <div class="container-fluid" style="padding:24px 32px;">

        <!-- Header -->
        <div style="margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <div>
            <h2 style="font-weight:700;margin:0;">Moderación de Reseñas</h2>
            <p style="color:#868e96;margin:4px 0 0;font-size:14px;">{{ total }} reseñas registradas</p>
          </div>
        </div>

        <!-- Tabla -->
        <div style="background:#fff;border-radius:12px;box-shadow:0 1px 6px rgba(0,0,0,.07);overflow:hidden;">
          <div v-if="loading" style="padding:40px;text-align:center;color:#adb5bd;">Cargando reseñas...</div>
          <div v-else-if="reviews.length === 0" style="padding:40px;text-align:center;color:#adb5bd;">
            No hay reseñas registradas.
          </div>
          <div v-else>
            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <thead>
                  <tr style="background:#f8f9fa;border-bottom:2px solid #e9ecef;">
                    <th style="padding:12px 16px;text-align:left;font-weight:600;color:#495057;">Producto</th>
                    <th style="padding:12px 16px;text-align:left;font-weight:600;color:#495057;">Cliente</th>
                    <th style="padding:12px 16px;text-align:center;font-weight:600;color:#495057;">Estrellas</th>
                    <th style="padding:12px 16px;text-align:left;font-weight:600;color:#495057;">Comentario</th>
                    <th style="padding:12px 16px;text-align:center;font-weight:600;color:#495057;">Fecha</th>
                    <th style="padding:12px 16px;text-align:center;font-weight:600;color:#495057;">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in reviews" :key="r._id" style="border-bottom:1px solid #f1f3f5;">
                    <!-- Producto -->
                    <td style="padding:12px 16px;">
                      <div style="display:flex;align-items:center;gap:10px;">
                        <img v-if="r.producto && r.producto.portada"
                          :src="$imgSrc(r.producto.portada, 'productos')"
                          style="width:40px;height:40px;object-fit:cover;border-radius:8px;flex-shrink:0;" />
                        <div v-else style="width:40px;height:40px;background:#f1f3f5;border-radius:8px;flex-shrink:0;"></div>
                        <div style="font-weight:600;font-size:13px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                          {{ r.producto ? r.producto.titulo : '—' }}
                        </div>
                      </div>
                    </td>
                    <!-- Cliente -->
                    <td style="padding:12px 16px;">
                      <div style="font-weight:600;font-size:13px;">{{ r.cliente ? r.cliente.nombres + ' ' + r.cliente.apellidos : '—' }}</div>
                      <div style="font-size:11px;color:#868e96;">{{ r.cliente ? r.cliente.email : '' }}</div>
                    </td>
                    <!-- Estrellas -->
                    <td style="padding:12px 16px;text-align:center;">
                      <span v-for="i in 5" :key="i" :style="{ color: i <= r.estrellas ? '#f59f00' : '#dee2e6', fontSize:'16px' }">★</span>
                    </td>
                    <!-- Comentario -->
                    <td style="padding:12px 16px;color:#495057;max-width:260px;">
                      <div style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">
                        {{ r.comentario || '—' }}
                      </div>
                    </td>
                    <!-- Fecha -->
                    <td style="padding:12px 16px;text-align:center;font-size:12px;color:#868e96;white-space:nowrap;">
                      {{ formatFecha(r.createdAt) }}
                    </td>
                    <!-- Acción -->
                    <td style="padding:12px 16px;text-align:center;">
                      <button @click="confirmarEliminar(r)"
                        style="background:#fff5f5;color:#c92a2a;border:1px solid #ffa8a8;border-radius:20px;padding:4px 14px;font-size:12px;font-weight:600;cursor:pointer;">
                        🗑 Eliminar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Paginación -->
            <div style="padding:14px 20px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #f1f3f5;">
              <span style="font-size:13px;color:#868e96;">Mostrando {{ reviews.length }} de {{ total }}</span>
              <div style="display:flex;gap:8px;">
                <button @click="cambiarPagina(page - 1)" :disabled="page <= 1"
                  :style="{ opacity: page <= 1 ? 0.5 : 1 }"
                  style="border:1px solid #dee2e6;background:#fff;border-radius:8px;padding:5px 14px;font-size:13px;cursor:pointer;">← Ant.</button>
                <span style="border:1px solid #4c6ef5;background:#e7f5ff;border-radius:8px;padding:5px 14px;font-size:13px;color:#1971c2;font-weight:600;">
                  {{ page }} / {{ pages }}
                </span>
                <button @click="cambiarPagina(page + 1)" :disabled="page >= pages"
                  :style="{ opacity: page >= pages ? 0.5 : 1 }"
                  style="border:1px solid #dee2e6;background:#fff;border-radius:8px;padding:5px 14px;font-size:13px;cursor:pointer;">Sig. →</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal confirmación eliminar -->
        <div v-if="reviewAEliminar" style="position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:9999;">
          <div style="background:#fff;border-radius:16px;padding:32px;max-width:400px;width:90%;box-shadow:0 8px 40px rgba(0,0,0,.18);">
            <div style="font-size:40px;text-align:center;margin-bottom:12px;">🗑</div>
            <h5 style="font-weight:700;text-align:center;margin-bottom:8px;">¿Eliminar reseña?</h5>
            <p style="color:#868e96;text-align:center;font-size:14px;margin-bottom:24px;">
              Esta acción no se puede deshacer. La reseña de <strong>{{ reviewAEliminar.cliente ? reviewAEliminar.cliente.nombres : '' }}</strong> será eliminada permanentemente.
            </p>
            <div style="display:flex;gap:12px;justify-content:center;">
              <button @click="reviewAEliminar = null"
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
  name: 'ReviewsApp',
  components: { Sidebar, TopNav },
  data() {
    return {
      loading: true,
      reviews: [],
      total: 0,
      page: 1,
      pages: 1,
      reviewAEliminar: null,
      eliminando: false,
    };
  },
  mounted() {
    this.cargar();
  },
  methods: {
    headers() {
      return { Authorization: this.$store.state.token };
    },
    async cargar(p = 1) {
      this.loading = true;
      try {
        const res = await axios.get(this.$url + '/listar_reviews_admin', {
          headers: this.headers(),
          params: { page: p, limit: 20 }
        });
        this.reviews = res.data.data || [];
        this.total   = res.data.total || 0;
        this.page    = res.data.page  || 1;
        this.pages   = res.data.pages || 1;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    cambiarPagina(p) {
      if (p >= 1 && p <= this.pages) this.cargar(p);
    },
    confirmarEliminar(r) {
      this.reviewAEliminar = r;
    },
    async eliminar() {
      if (!this.reviewAEliminar) return;
      this.eliminando = true;
      try {
        await axios.delete(this.$url + '/eliminar_review_admin/' + this.reviewAEliminar._id, { headers: this.headers() });
        this.$notify({ type: 'success', title: 'Reseña eliminada correctamente' });
        this.reviewAEliminar = null;
        this.cargar(this.page);
      } catch (e) {
        this.$notify({ type: 'error', title: 'Error al eliminar la reseña' });
      } finally {
        this.eliminando = false;
      }
    },
    formatFecha(d) {
      if (!d) return '—';
      return new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    },
  }
};
</script>
