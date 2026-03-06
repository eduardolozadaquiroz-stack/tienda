<template>
  <nav class="navbar navbar-vertical fixed-start navbar-expand-md navbar-light" id="sidebar">
    <div class="container-fluid">
  
      <!-- Toggler -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarCollapse" aria-controls="sidebarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
  
      <!-- Brand -->
      <router-link class="navbar-brand" to="/dashboard">
        <img src="/assets/img/logo.svg" class="navbar-brand-img mx-auto" alt="...">
      </router-link>
  
      <!-- User (xs) -->
      <div class="navbar-user d-md-none">
  
        <!-- Dropdown -->
        <div class="dropdown">
  
          <!-- Toggle -->
          <a href="#" id="sidebarIcon" class="dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <div class="avatar-mobile-wrapper">
              <img v-if="avatarUrl" :src="avatarUrl" class="avatar-mobile-img" alt="avatar">
              <div v-else class="avatar-mobile-img avatar-mobile-initials">{{ iniciales }}</div>
              <span class="avatar-mobile-dot"></span>
            </div>
          </a>
  
          <!-- Menu móvil -->
          <div class="dropdown-menu dropdown-menu-end" aria-labelledby="sidebarIcon" style="min-width:240px;">
            <div style="padding:14px 16px 12px;border-bottom:1px solid #f1f3f5;">
              <div style="display:flex;align-items:center;gap:12px;">
                <router-link to="/perfil" style="text-decoration:none;flex-shrink:0;">
                  <img v-if="avatarUrl" :src="avatarUrl" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #4c6ef5;">
                  <div v-else style="width:40px;height:40px;border-radius:50%;background:#4c6ef5;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:#fff;flex-shrink:0;">{{ iniciales }}</div>
                </router-link>
                <div style="min-width:0;flex:1;">
                  <div style="font-weight:700;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ usuarioNombre }} {{ usuarioApellido }}</div>
                  <div style="font-size:11px;color:#868e96;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ usuarioEmail }}</div>
                  <span style="display:inline-block;margin-top:4px;background:#e7f5ff;color:#1971c2;font-size:10px;font-weight:600;padding:1px 8px;border-radius:20px;">{{ usuarioRol }}</span>
                </div>
              </div>
            </div>
            <router-link to="/perfil" class="dropdown-item"><i class="fe fe-user me-2" style="color:#4c6ef5;"></i> Mi perfil</router-link>
            <router-link to="/dashboard" class="dropdown-item"><i class="fe fe-grid me-2"></i> Dashboard</router-link>
            <router-link to="/categorias" class="dropdown-item"><i class="fe fe-tag me-2"></i> Categorías</router-link>
            <router-link to="/producto" class="dropdown-item"><i class="fe fe-shopping-cart me-2"></i> Productos</router-link>
            <router-link to="/ingreso" class="dropdown-item"><i class="fe fe-folder me-2"></i> Ingresos</router-link>
            <router-link to="/ventas" class="dropdown-item"><i class="fe fe-shopping-bag me-2"></i> Ventas</router-link>
            <hr class="dropdown-divider">
            <a href="#" class="dropdown-item text-danger" @click.prevent="cerrarSesion()">
              <i class="fe fe-log-out me-2"></i> Cerrar sesión
            </a>
          </div>
  
        </div>
  
      </div>
  
      <!-- Collapse -->
      <div class="collapse navbar-collapse" id="sidebarCollapse">
  
        <!-- Form -->
        <form class="mt-4 mb-3 d-md-none">
          <div class="input-group input-group-rounded input-group-merge input-group-reverse">
            <input class="form-control" type="search" placeholder="Search" aria-label="Search">
            <div class="input-group-text">
              <span class="fe fe-search"></span>
            </div>
          </div>
        </form>
  
          <!-- Navigation -->
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/dashboard" class="nav-link" active-class="active">
              <i class="fe fe-grid"></i> Dashboard
            </router-link>
          </li>
        </ul>

        <hr class="navbar-divider my-3">
        <h6 class="navbar-heading">
          Control
        </h6>

        <ul class="navbar-nav mb-md-4">
          <li class="nav-item">
              <router-link to="/categorias" class="nav-link" active-class="active">
                <i class="fe fe-tag"></i> Categorias
              </router-link>
          </li>
            <li class="nav-item">
              <router-link to="/producto" class="nav-link" active-class="active">
                <i class="fe fe-shopping-cart"></i> Productos
              </router-link>
          </li>
          <li class="nav-item">
              <router-link to="/ingreso/create" class="nav-link" active-class="active">
                <i class="fe fe-folder"></i> Ingreso
              </router-link>
          </li>
          <li class="nav-item">
              <router-link to="/ventas" class="nav-link" active-class="active">
                <i class="fe fe-shopping-bag"></i> Ventas
              </router-link>
          </li>
        </ul>

        <hr class="navbar-divider my-3">
        <h6 class="navbar-heading">
          Clientes y Seguridad
        </h6>

        <ul class="navbar-nav mb-md-4">
          <li class="nav-item">
            <router-link to="/clientes" class="nav-link" active-class="active">
              <i class="fe fe-users"></i> Clientes
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/seguridad/logs" class="nav-link" active-class="active">
              <i class="fe fe-shield"></i> Logs de Seguridad
            </router-link>
          </li>
        </ul>
  
  
        <!-- Push content down -->
        <div class="mt-auto"></div>
  
  
          <!-- User (md) -->
          <div class="navbar-user d-none d-md-flex" id="sidebarUser">
  
            <!-- Icon campana -->
            <a class="navbar-user-link position-relative" href="#offcanvasNotif" data-bs-toggle="offcanvas" role="button" aria-controls="offcanvasNotif">
              <span class="icon">
                <i class="fe fe-bell"></i>
              </span>
              <span v-if="unreadCount > 0"
                style="position:absolute;top:-2px;right:-4px;background:#f03e3e;color:#fff;font-size:9px;font-weight:700;border-radius:50%;width:16px;height:16px;display:flex;align-items:center;justify-content:center;line-height:1;">
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </a>
  
            <!-- Dropup -->
            <div class="dropup">
  
              <!-- Toggle -->
              <a href="#" id="sidebarIconCopy" class="dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <div class="avatar avatar-sm avatar-online">
                  <img v-if="avatarUrl" :src="avatarUrl" class="avatar-img rounded-circle" alt="avatar" style="-webkit-mask-image:none;object-fit:cover;">
                  <div v-else class="avatar-img rounded-circle d-flex align-items-center justify-content-center"
                    style="background:#4c6ef5;color:#fff;font-weight:700;font-size:13px;width:100%;height:100%;">{{ iniciales }}</div>
                </div>
              </a>
  
              <!-- Menú escritorio (dropup abajo) -->
              <div class="dropdown-menu" aria-labelledby="sidebarIconCopy" style="min-width:240px;">
                <div style="padding:14px 16px 12px;border-bottom:1px solid #f1f3f5;">
                  <div style="display:flex;align-items:center;gap:12px;">
                    <router-link to="/perfil" style="text-decoration:none;flex-shrink:0;">
                      <img v-if="avatarUrl" :src="avatarUrl" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #4c6ef5;">
                      <div v-else style="width:40px;height:40px;border-radius:50%;background:#4c6ef5;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:#fff;flex-shrink:0;">{{ iniciales }}</div>
                    </router-link>
                    <div style="min-width:0;flex:1;">
                      <div style="font-weight:700;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ usuarioNombre }} {{ usuarioApellido }}</div>
                      <div style="font-size:11px;color:#868e96;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ usuarioEmail }}</div>
                      <span style="display:inline-block;margin-top:4px;background:#e7f5ff;color:#1971c2;font-size:10px;font-weight:600;padding:1px 8px;border-radius:20px;">{{ usuarioRol }}</span>
                    </div>
                  </div>
                </div>
                <router-link to="/perfil" class="dropdown-item"><i class="fe fe-user me-2" style="color:#4c6ef5;"></i> Mi perfil</router-link>
                <router-link to="/dashboard" class="dropdown-item"><i class="fe fe-grid me-2"></i> Dashboard</router-link>
                <hr class="dropdown-divider">
                <a href="#" class="dropdown-item text-danger" @click.prevent="cerrarSesion()">
                  <i class="fe fe-log-out me-2"></i> Cerrar sesión
                </a>
              </div>
  
            </div>
  
            <!-- Icon lupa -->
            <a class="navbar-user-link" href="#offcanvasSearch" data-bs-toggle="offcanvas" role="button" aria-controls="offcanvasSearch">
              <span class="icon">
                <i class="fe fe-search"></i>
              </span>
            </a>
  
          </div>
  
      </div> <!-- / .navbar-collapse -->

    </div> <!-- / .container-fluid -->
  </nav>

  <!-- ===== OFFCANVAS NOTIFICACIONES ===== -->
  <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNotif" aria-labelledby="offcanvasNotifLabel" style="width:360px;">
    <div class="offcanvas-header" style="border-bottom:1px solid #f1f3f5;padding:18px 20px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <i class="fe fe-bell" style="font-size:18px;color:#4c6ef5;"></i>
        <h6 class="offcanvas-title mb-0" id="offcanvasNotifLabel" style="font-weight:700;font-size:15px;">Notificaciones</h6>
        <span v-if="unreadCount > 0" style="background:#f03e3e;color:#fff;font-size:10px;font-weight:700;border-radius:20px;padding:1px 8px;">{{ unreadCount }}</span>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <button v-if="notificaciones.length > 0" @click="limpiarNotificaciones()"
          style="font-size:11px;color:#868e96;background:none;border:none;cursor:pointer;padding:0;font-weight:600;">
          Limpiar todo
        </button>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
      </div>
    </div>
    <div class="offcanvas-body p-0" style="overflow-y:auto;">
      <!-- Sin notificaciones -->
      <div v-if="notificaciones.length === 0" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;text-align:center;">
        <div style="width:64px;height:64px;border-radius:50%;background:#f1f3f5;display:flex;align-items:center;justify-content:center;margin-bottom:14px;">
          <i class="fe fe-bell-off" style="font-size:26px;color:#adb5bd;"></i>
        </div>
        <div style="font-weight:600;font-size:14px;color:#495057;">Sin notificaciones</div>
        <div style="font-size:12px;color:#adb5bd;margin-top:4px;">Las nuevas ventas aparecerán aquí en tiempo real</div>
      </div>
      <!-- Lista -->
      <div v-for="(n, i) in notificaciones" :key="i"
        style="padding:14px 18px;border-bottom:1px solid #f8f9fa;display:flex;gap:12px;align-items:flex-start;"
        :style="{background: n.leida ? '#fff' : '#f0f4ff'}">
        <div style="width:38px;height:38px;border-radius:50%;background:#4c6ef5;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="fe fe-shopping-bag" style="color:#fff;font-size:15px;"></i>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:600;font-size:13px;color:#343a40;">Nueva venta — #{{ n.serie }}</div>
          <div style="font-size:12px;color:#495057;margin-top:2px;">
            Total: <strong style="color:#2b8a3e;">$ {{ formatearMonto(n.total) }} MXN</strong>
          </div>
          <div style="font-size:11px;color:#adb5bd;margin-top:3px;">{{ n.hora }}</div>
        </div>
        <span v-if="!n.leida" style="width:8px;height:8px;border-radius:50%;background:#4c6ef5;flex-shrink:0;margin-top:4px;"></span>
      </div>
    </div>
  </div>

  <!-- ===== OFFCANVAS BÚSQUEDA ===== -->
  <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasSearch" aria-labelledby="offcanvasSearchLabel" style="width:400px;">
    <div class="offcanvas-header" style="border-bottom:1px solid #f1f3f5;padding:18px 20px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <i class="fe fe-search" style="font-size:18px;color:#4c6ef5;"></i>
        <h6 class="offcanvas-title mb-0" id="offcanvasSearchLabel" style="font-weight:700;font-size:15px;">Búsqueda global</h6>
      </div>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
    </div>
    <div class="offcanvas-body p-0" style="overflow-y:auto;">
      <!-- Input búsqueda -->
      <div style="padding:16px 18px;border-bottom:1px solid #f1f3f5;position:relative;">
        <i class="fe fe-search" style="position:absolute;left:30px;top:50%;transform:translateY(-50%);color:#adb5bd;font-size:15px;"></i>
        <input v-model="busquedaQuery" @input="onBusquedaInput"
          type="text" placeholder="Buscar colaboradores, productos..."
          style="width:100%;padding:10px 12px 10px 36px;border-radius:10px;border:1.5px solid #dee2e6;font-size:14px;outline:none;"
          @focus="$event.target.style.borderColor='#4c6ef5'"
          @blur="$event.target.style.borderColor='#dee2e6'">
        <div v-if="busquedaLoading" style="position:absolute;right:30px;top:50%;transform:translateY(-50%);">
          <div style="width:16px;height:16px;border:2px solid #4c6ef5;border-top-color:transparent;border-radius:50%;animation:spin 0.7s linear infinite;"></div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-if="!busquedaQuery" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;text-align:center;">
        <div style="width:64px;height:64px;border-radius:50%;background:#f1f3f5;display:flex;align-items:center;justify-content:center;margin-bottom:14px;">
          <i class="fe fe-search" style="font-size:26px;color:#adb5bd;"></i>
        </div>
        <div style="font-weight:600;font-size:14px;color:#495057;">Escribe para buscar</div>
        <div style="font-size:12px;color:#adb5bd;margin-top:4px;">Productos y colaboradores</div>
      </div>

      <!-- Sin resultados -->
      <div v-if="busquedaQuery && !busquedaLoading && busquedaResultados.usuarios.length === 0 && busquedaResultados.productos.length === 0"
        style="text-align:center;padding:50px 20px;color:#adb5bd;font-size:13px;">
        Sin resultados para "<strong>{{ busquedaQuery }}</strong>"
      </div>

      <!-- Resultados colaboradores -->
      <div v-if="busquedaResultados.usuarios && busquedaResultados.usuarios.length > 0" style="padding:12px 18px 6px;">
        <div style="font-size:11px;font-weight:700;color:#868e96;text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px;">Colaboradores</div>
        <div v-for="u in busquedaResultados.usuarios" :key="u._id"
          style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #f8f9fa;cursor:pointer;"
          @click="irAColaborador(u._id)">
          <div style="width:36px;height:36px;border-radius:50%;background:#4c6ef5;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:#fff;flex-shrink:0;">
            {{ (u.nombres||'').charAt(0).toUpperCase() }}
          </div>
          <div style="min-width:0;flex:1;">
            <div style="font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ u.nombres }} {{ u.apellidos }}</div>
            <div style="font-size:11px;color:#868e96;">{{ u.email }}</div>
          </div>
          <span style="font-size:10px;background:#e7f5ff;color:#1971c2;padding:1px 8px;border-radius:20px;font-weight:600;flex-shrink:0;">
            {{ u.rol === 'ADMIN' ? 'Admin' : 'Colab.' }}
          </span>
        </div>
      </div>

      <!-- Resultados productos -->
      <div v-if="busquedaResultados.productos && busquedaResultados.productos.length > 0" style="padding:12px 18px 6px;">
        <div style="font-size:11px;font-weight:700;color:#868e96;text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px;">Productos</div>
        <div v-for="p in busquedaResultados.productos" :key="p._id"
          style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #f8f9fa;cursor:pointer;"
          @click="irAProducto(p._id)">
          <img v-if="p.img" :src="$url+'/obtener_imagen_producto/'+p.img" style="width:36px;height:36px;border-radius:8px;object-fit:cover;flex-shrink:0;">
          <div v-else style="width:36px;height:36px;border-radius:8px;background:#f1f3f5;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="fe fe-image" style="color:#adb5bd;font-size:15px;"></i>
          </div>
          <div style="min-width:0;flex:1;">
            <div style="font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ p.nombre }}</div>
            <div style="font-size:11px;color:#2b8a3e;font-weight:600;">$ {{ formatearMonto(p.precio) }} MXN</div>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
</style>

<script>
import jwt_decode from 'jwt-decode';
import axios from 'axios';

export default {
name: 'Sidebar',
data() {
  return {
    avatarUrl: null,
    notificaciones: [],
    unreadCount: 0,
    busquedaQuery: '',
    busquedaResultados: { usuarios: [], productos: [] },
    busquedaLoading: false,
    busquedaTimer: null,
  };
},
computed: {
  usuarioId() {
    try { return jwt_decode(this.$store.state.token).sub; } catch { return null; }
  },
  iniciales() {
    const n = (this.usuarioNombre||'').charAt(0);
    const a = (this.usuarioApellido||'').charAt(0);
    return (n + a).toUpperCase() || 'U';
  },
  usuarioNombre() {
    try {
      const decoded = jwt_decode(this.$store.state.token);
      return decoded.nombres ? decoded.nombres.split(' ')[0] : 'Admin';
    } catch { return 'Admin'; }
  },
  usuarioApellido() {
    try {
      const decoded = jwt_decode(this.$store.state.token);
      return decoded.apellidos ? decoded.apellidos.split(' ')[0] : '';
    } catch { return ''; }
  },
  usuarioEmail() {
    try {
      const decoded = jwt_decode(this.$store.state.token);
      return decoded.email || '';
    } catch { return ''; }
  },
  usuarioRol() {
    try {
      const decoded = jwt_decode(this.$store.state.token);
      return decoded.rol === 'ADMIN' ? '👑 Administrador' : '👤 Colaborador';
    } catch { return ''; }
  }
},
mounted() {
  this.cargarAvatar();
  // Escuchar nueva_venta en tiempo real
  this.$socket.on('nueva_venta', (data) => {
    const hora = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    this.notificaciones.unshift({ ...data, hora, leida: false });
    this.unreadCount++;
  });
  // Marcar como leídas al abrir el panel
  const offcanvasEl = document.getElementById('offcanvasNotif');
  if (offcanvasEl) {
    offcanvasEl.addEventListener('show.bs.offcanvas', () => {
      this.unreadCount = 0;
      this.notificaciones = this.notificaciones.map(n => ({ ...n, leida: true }));
    });
  }
},
beforeUnmount() {
  this.$socket.off('nueva_venta');
},
methods: {
  async cargarAvatar() {
    if (!this.usuarioId) return;
    try {
      const res = await axios.get(this.$url + '/obtener_usuario_admin/' + this.usuarioId, {
        headers: { 'Authorization': this.$store.state.token }
      });
      if (res.data && res.data.avatar) {
        this.avatarUrl = this.$imgSrc(res.data.avatar, 'obtener_avatar_usuario');
      }
    } catch { /* silencioso */ }
  },
  cerrarSesion() {
    this.$store.dispatch('logout');
    this.$router.push({ name: 'login' });
  },
  limpiarNotificaciones() {
    this.notificaciones = [];
    this.unreadCount = 0;
  },
  onBusquedaInput() {
    clearTimeout(this.busquedaTimer);
    if (!this.busquedaQuery || this.busquedaQuery.trim().length < 2) {
      this.busquedaResultados = { usuarios: [], productos: [] };
      this.busquedaLoading = false;
      return;
    }
    this.busquedaLoading = true;
    this.busquedaTimer = setTimeout(() => this.ejecutarBusqueda(), 400);
  },
  async ejecutarBusqueda() {
    try {
      const res = await axios.get(this.$url + '/buscar_global_admin/' + encodeURIComponent(this.busquedaQuery.trim()), {
        headers: { 'Authorization': this.$store.state.token }
      });
      this.busquedaResultados = res.data || { usuarios: [], productos: [] };
    } catch {
      this.busquedaResultados = { usuarios: [], productos: [] };
    } finally {
      this.busquedaLoading = false;
    }
  },
  irAColaborador(id) {
    this.$router.push('/colaborador/edit/' + id);
    document.getElementById('offcanvasSearch').__bs_offcanvas?.hide();
  },
  irAProducto(id) {
    this.$router.push('/producto/edit/' + id);
    document.getElementById('offcanvasSearch').__bs_offcanvas?.hide();
  },
  formatearMonto(v) {
    if (!v && v !== 0) return '0.00';
    return Number(v).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
}
</script>

<style scoped>
.avatar-mobile-wrapper {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 36px;
}
.avatar-mobile-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
.avatar-mobile-initials {
  background: #4c6ef5;
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-mobile-dot {
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 9px;
  height: 9px;
  background: #00d97e;
  border-radius: 50%;
  border: 2px solid #fff;
}
</style>
