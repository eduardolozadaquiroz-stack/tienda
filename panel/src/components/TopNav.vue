<template>
   <nav class="navbar navbar-expand-md navbar-light d-none d-md-flex" style="position:relative;z-index:1030;overflow:visible;">
  <div class="container-fluid" style="overflow:visible;">

  <!-- Saludo -->
  <form class="form-inline me-4 d-none d-md-flex">
    <span style="font-size:13px;color:#6c757d;">
      👋 Bienvenido, <strong style="color:#495057;">{{ usuarioNombre }}</strong>
    </span>
  </form>

  <!-- Usuario -->
  <div class="navbar-user">
      <div class="dropdown">
        <a href="#" class="avatar avatar-sm avatar-online dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" class="avatar-img rounded-circle" style="-webkit-mask-image: none;object-fit:cover;">
            <div v-else class="rounded-circle d-flex align-items-center justify-content-center"
              style="background:#4c6ef5;color:#fff;font-weight:700;font-size:14px;width:100%;height:100%;">
              {{ iniciales }}
            </div>
        </a>
        <div class="dropdown-menu dropdown-menu-end" style="min-width:240px;z-index:1050;position:absolute;">
            <!-- Cabecera usuario -->
            <div style="padding:14px 16px 12px;border-bottom:1px solid #f1f3f5;">
              <div style="display:flex;align-items:center;gap:12px;">
                <router-link to="/perfil" style="text-decoration:none;flex-shrink:0;">
                  <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" style="width:42px;height:42px;border-radius:50%;object-fit:cover;border:2px solid #4c6ef5;">
                  <div v-else style="width:42px;height:42px;border-radius:50%;background:#4c6ef5;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;color:#fff;cursor:pointer;flex-shrink:0;">{{ iniciales }}</div>
                </router-link>
                <div style="min-width:0;flex:1;">
                  <div style="font-weight:700;font-size:13px;color:#343a40;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ usuarioNombre }} {{ usuarioApellido }}</div>
                  <div style="font-size:11px;color:#868e96;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ usuarioEmail }}</div>
                  <span style="display:inline-block;margin-top:4px;background:#e7f5ff;color:#1971c2;font-size:10px;font-weight:600;padding:1px 8px;border-radius:20px;">{{ usuarioRol }}</span>
                </div>
              </div>
            </div>
            <router-link to="/perfil" class="dropdown-item" style="padding:8px 16px;">
              <i class="fe fe-user me-2" style="color:#4c6ef5;"></i> Mi perfil
            </router-link>
            <router-link to="/dashboard" class="dropdown-item" style="padding:8px 16px;">
              <i class="fe fe-grid me-2" style="color:#868e96;"></i> Dashboard
            </router-link>
            <hr class="dropdown-divider">
            <a href="#" class="dropdown-item text-danger" style="padding:8px 16px;" @click.prevent="cerrarSesion()">
              <i class="fe fe-log-out me-2"></i> Cerrar sesión
            </a>
        </div>
      </div>
  </div>

  </div>
   </nav>
</template>
  
<script>
import jwt_decode from 'jwt-decode';
import axios from 'axios';

export default {
  name: 'TopNav',
  data() {
    return { avatarUrlLocal: null };
  },
  computed: {
    avatarUrl() {
      return this.$store.state.avatarUrl || this.avatarUrlLocal;
    },
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
      } catch { return 'Administrador'; }
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
        const rol = (decoded.rol || '').toLowerCase();
        if (rol.includes('admin')) return '👑 Administrador';
        if (rol.includes('vendedor')) return '🛒 Vendedor';
        if (rol.includes('almacen') || rol.includes('inventor')) return '📦 Almacén';
        return '👤 Colaborador';
      } catch { return ''; }
    }
  },
  mounted() { this.cargarAvatar(); },
  methods: {
    async cargarAvatar() {
      if (!this.usuarioId) return;
      try {
        const res = await axios.get(this.$url + '/obtener_usuario_admin/' + this.usuarioId, {
          headers: { 'Authorization': this.$store.state.token }
        });
        // Solo usar si es URL de Cloudinary; los filenames locales apuntan a default.jpg
        if (res.data && res.data.avatar && res.data.avatar.startsWith('http')) {
          this.avatarUrlLocal = res.data.avatar;
          this.$store.commit('setAvatarUrl', res.data.avatar);
        }
      } catch { /* silencioso */ }
    },
    cerrarSesion() {
      this.$store.dispatch('logout');
      this.$router.push({ name: 'login' });
    }
  }
}
</script>
