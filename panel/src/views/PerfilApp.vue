<template>
  <div>
    <Sidebar />
    <div class="main-content">
      <TopNav />

      <!-- Breadcrumb -->
      <div style="background:#f8f9fa;border-bottom:1px solid #e9ecef;padding:10px 24px;">
        <nav style="font-size:13px;">
          <span style="color:#868e96;">🏠 Panel</span>
          <span style="color:#ced4da;margin:0 6px;">/</span>
          <span style="background:#364fc7;color:#fff;border-radius:20px;padding:2px 12px;font-weight:600;">👤 Mi perfil</span>
        </nav>
      </div>

      <div class="container-fluid" style="padding:28px 32px;max-width:860px;">

        <div class="mb-4">
          <h2 style="font-weight:700;margin:0;">Mi perfil</h2>
          <p style="color:#868e96;font-size:14px;margin:4px 0 0;">Gestiona tu foto, datos personales y contraseña</p>
        </div>

        <!-- === CARD FOTO DE PERFIL === -->
        <div class="card border-0 shadow-sm mb-4" style="border-radius:16px;overflow:hidden;">
          <div style="padding:18px 24px;border-bottom:1px solid #f1f3f5;display:flex;align-items:center;gap:10px;">
            <span style="font-size:20px;">📷</span>
            <span style="font-weight:700;font-size:16px;">Foto de perfil</span>
          </div>
          <div class="card-body" style="padding:24px;">
            <div style="display:flex;align-items:center;gap:28px;flex-wrap:wrap;">
              <!-- Avatar actual / preview -->
              <div style="position:relative;flex-shrink:0;cursor:pointer;" @click="$refs.inputAvatar.click()" title="Clic para cambiar foto">
                <div v-if="!perfil.avatar && !previewAvatar"
                  style="width:100px;height:100px;border-radius:50%;background:#4c6ef5;display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:700;color:#fff;cursor:pointer;"
                  @click="$refs.inputAvatar.click()">
                  {{ iniciales }}
                </div>
                <img v-if="previewAvatar" :src="previewAvatar"
                  style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid #4c6ef5;cursor:pointer;"
                  @click="$refs.inputAvatar.click()" alt="preview">
                <img v-if="perfil.avatar && !previewAvatar" :src="$imgSrc(perfil.avatar, 'obtener_avatar_usuario')"
                  style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid #4c6ef5;cursor:pointer;"
                  @click="$refs.inputAvatar.click()" alt="avatar">
                <!-- Ícono cámara encima -->
                <div style="position:absolute;bottom:4px;right:4px;background:#4c6ef5;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;"
                  @click="$refs.inputAvatar.click()">
                  <i class="fe fe-camera" style="font-size:13px;color:#fff;"></i>
                </div>
              </div>
              <!-- Instrucciones -->
              <div style="flex:1;min-width:200px;">
                <div style="font-weight:600;font-size:15px;margin-bottom:6px;">{{ perfil.nombres }} {{ perfil.apellidos }}</div>
                <div style="font-size:13px;color:#868e96;margin-bottom:14px;">Haz clic en la imagen o en el botón para seleccionar una foto.<br>Formatos: JPG, PNG — Máximo 5 MB.</div>
                <input ref="inputAvatar" type="file" accept="image/png,image/jpeg" style="display:none;" @change="onAvatarChange">
                <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
                  <button class="btn btn-sm" style="background:#4c6ef5;color:#fff;border-radius:8px;font-weight:600;padding:8px 20px;"
                    @click="$refs.inputAvatar.click()">
                    <i class="fe fe-upload me-1"></i> Seleccionar imagen
                  </button>
                  <button v-if="avatarFile" class="btn btn-sm" style="background:#12b886;color:#fff;border-radius:8px;font-weight:600;padding:8px 20px;"
                    @click="subirAvatar()" :disabled="subiendoAvatar">
                    {{ subiendoAvatar ? 'Subiendo...' : '✅ Guardar foto' }}
                  </button>
                  <span v-if="avatarFile && !subiendoAvatar" style="font-size:12px;color:#2b8a3e;font-weight:600;">● Imagen lista para guardar</span>
                </div>
                <div v-if="msm_avatar" class="mt-2" :class="msm_avatar_tipo === 'ok' ? 'text-success' : 'text-danger'" style="font-size:13px;font-weight:600;">
                  {{ msm_avatar }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- === CARD DATOS PERSONALES === -->
        <div class="card border-0 shadow-sm mb-4" style="border-radius:16px;overflow:hidden;">
          <div style="padding:18px 24px;border-bottom:1px solid #f1f3f5;display:flex;align-items:center;gap:10px;">
            <span style="font-size:20px;">✏️</span>
            <span style="font-weight:700;font-size:16px;">Datos personales</span>
          </div>
          <div class="card-body" style="padding:24px;">
            <div v-if="msm_perfil" :class="'alert alert-' + (msm_perfil_tipo === 'ok' ? 'success' : 'danger')" style="font-size:13px;border-radius:10px;">{{ msm_perfil }}</div>
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label class="form-label fw-semibold" style="font-size:13px;">Nombres <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="perfil.nombres" style="border-radius:8px;border:1.5px solid #e9ecef;">
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label fw-semibold" style="font-size:13px;">Apellidos <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="perfil.apellidos" style="border-radius:8px;border:1.5px solid #e9ecef;">
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold" style="font-size:13px;">Correo electrónico <span class="text-danger">*</span></label>
                <input type="email" class="form-control" v-model="perfil.email" style="border-radius:8px;border:1.5px solid #e9ecef;">
              </div>
            </div>
          </div>
          <div class="card-footer bg-white border-top d-flex justify-content-end" style="padding:16px 24px;">
            <button class="btn" style="background:#4c6ef5;color:#fff;border-radius:8px;font-weight:600;padding:10px 28px;"
              @click="guardarPerfil()" :disabled="guardandoPerfil">
              <i class="fe fe-save me-2"></i>{{ guardandoPerfil ? 'Guardando...' : 'Guardar cambios' }}
            </button>
          </div>
        </div>

        <!-- === CARD CONTRASEÑA === -->
        <div class="card border-0 shadow-sm" style="border-radius:16px;overflow:hidden;">
          <div style="padding:18px 24px;border-bottom:1px solid #f1f3f5;display:flex;align-items:center;gap:10px;">
            <span style="font-size:20px;">🔒</span>
            <span style="font-weight:700;font-size:16px;">Cambiar contraseña</span>
          </div>
          <div class="card-body" style="padding:24px;">
            <div v-if="msm_pass" :class="'alert alert-' + (msm_pass_tipo === 'ok' ? 'success' : 'danger')" style="font-size:13px;border-radius:10px;">{{ msm_pass }}</div>
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label class="form-label fw-semibold" style="font-size:13px;">Nueva contraseña</label>
                <div class="position-relative">
                  <input :type="verPass1 ? 'text' : 'password'" class="form-control pe-5" v-model="nueva_pass"
                    placeholder="Mínimo 6 caracteres" style="border-radius:8px;border:1.5px solid #e9ecef;">
                  <button type="button" @click="verPass1=!verPass1" class="position-absolute border-0 bg-transparent p-0"
                    style="top:50%;right:12px;transform:translateY(-50%);color:#adb5bd;cursor:pointer;">
                    <i :class="verPass1 ? 'fe fe-eye-off' : 'fe fe-eye'"></i>
                  </button>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label fw-semibold" style="font-size:13px;">Confirmar contraseña</label>
                <div class="position-relative">
                  <input :type="verPass2 ? 'text' : 'password'" class="form-control pe-5" v-model="confirmar_pass"
                    placeholder="Repite la contraseña"
                    :style="'border-radius:8px;border:1.5px solid ' + (nueva_pass && confirmar_pass ? (nueva_pass===confirmar_pass ? '#2b8a3e' : '#c92a2a') : '#e9ecef') + ';'">
                  <button type="button" @click="verPass2=!verPass2" class="position-absolute border-0 bg-transparent p-0"
                    style="top:50%;right:12px;transform:translateY(-50%);color:#adb5bd;cursor:pointer;">
                    <i :class="verPass2 ? 'fe fe-eye-off' : 'fe fe-eye'"></i>
                  </button>
                </div>
                <small v-if="nueva_pass && confirmar_pass" style="font-size:12px;" :style="{color: nueva_pass===confirmar_pass ? '#2b8a3e' : '#c92a2a'}">
                  <i :class="nueva_pass===confirmar_pass ? 'fe fe-check me-1' : 'fe fe-x me-1'"></i>
                  {{ nueva_pass===confirmar_pass ? 'Las contraseñas coinciden' : 'No coinciden' }}
                </small>
              </div>
            </div>
          </div>
          <div class="card-footer bg-white border-top d-flex justify-content-end" style="padding:16px 24px;">
            <button class="btn" style="background:#495057;color:#fff;border-radius:8px;font-weight:600;padding:10px 28px;"
              @click="cambiarPassword()" :disabled="guardandoPass || !nueva_pass || nueva_pass !== confirmar_pass">
              <i class="fe fe-lock me-2"></i>{{ guardandoPass ? 'Actualizando...' : 'Actualizar contraseña' }}
            </button>
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
  name: 'PerfilApp',
  components: { Sidebar, TopNav },
  data() {
    return {
      perfil: { nombres: '', apellidos: '', email: '', rol: '', avatar: '' },
      nueva_pass: '',
      confirmar_pass: '',
      verPass1: false,
      verPass2: false,
      avatarFile: null,
      previewAvatar: null,
      subiendoAvatar: false,
      guardandoPerfil: false,
      guardandoPass: false,
      msm_perfil: '',
      msm_perfil_tipo: '',
      msm_pass: '',
      msm_pass_tipo: '',
      msm_avatar: '',
      msm_avatar_tipo: '',
    };
  },
  computed: {
    usuarioId() {
      try { return jwt_decode(this.$store.state.token).sub; } catch { return null; }
    },
    iniciales() {
      return ((this.perfil.nombres||'').charAt(0) + (this.perfil.apellidos||'').charAt(0)).toUpperCase() || 'U';
    }
  },
  mounted() { this.cargarPerfil(); },
  methods: {
    async cargarPerfil() {
      try {
        const res = await axios.get(this.$url + '/obtener_usuario_admin/' + this.usuarioId, {
          headers: { 'Authorization': this.$store.state.token }
        });
        if (res.data) {
          this.perfil = {
            nombres:   res.data.nombres   || '',
            apellidos: res.data.apellidos || '',
            email:     res.data.email     || '',
            rol:       res.data.rol       || '',
            avatar:    res.data.avatar    || '',
          };
        }
      } catch(e) { console.error(e); }
    },

    onAvatarChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.avatarFile = file;
      this.previewAvatar = URL.createObjectURL(file);
      this.msm_avatar = '';
    },

    async subirAvatar() {
      if (!this.avatarFile) return;
      this.subiendoAvatar = true;
      const formData = new FormData();
      formData.append('avatar', this.avatarFile);
      try {
        const res = await axios.post(this.$url + '/subir_avatar_usuario_admin/' + this.usuarioId, formData, {
          headers: { 'Authorization': this.$store.state.token, 'Content-Type': 'multipart/form-data' }
        });
        this.perfil.avatar = res.data.avatar;
        this.avatarFile = null;
        this.previewAvatar = null;
        this.msm_avatar = '✅ Foto de perfil actualizada correctamente.';
        this.msm_avatar_tipo = 'ok';
      } catch {
        this.msm_avatar = '❌ No se pudo subir la imagen.';
        this.msm_avatar_tipo = 'err';
      } finally {
        this.subiendoAvatar = false;
        setTimeout(() => { this.msm_avatar = ''; }, 3500);
      }
    },

    async guardarPerfil() {
      if (!this.perfil.nombres || !this.perfil.apellidos || !this.perfil.email) {
        this.msm_perfil = '⚠️ Completa todos los campos obligatorios.';
        this.msm_perfil_tipo = 'err';
        return;
      }
      this.guardandoPerfil = true;
      try {
        await axios.put(this.$url + '/actualizar_usuario_admin/' + this.usuarioId, this.perfil, {
          headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
        });
        this.msm_perfil = '✅ Datos actualizados correctamente.';
        this.msm_perfil_tipo = 'ok';
      } catch {
        this.msm_perfil = '❌ No se pudieron guardar los cambios.';
        this.msm_perfil_tipo = 'err';
      } finally {
        this.guardandoPerfil = false;
        setTimeout(() => { this.msm_perfil = ''; }, 3500);
      }
    },

    async cambiarPassword() {
      if (!this.nueva_pass || this.nueva_pass !== this.confirmar_pass || this.nueva_pass.length < 6) return;
      this.guardandoPass = true;
      try {
        await axios.put(this.$url + '/cambiar_password_usuario_admin/' + this.usuarioId,
          { password: this.nueva_pass },
          { headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token } }
        );
        this.msm_pass = '✅ Contraseña actualizada correctamente.';
        this.msm_pass_tipo = 'ok';
        this.nueva_pass = '';
        this.confirmar_pass = '';
      } catch {
        this.msm_pass = '❌ No se pudo actualizar la contraseña.';
        this.msm_pass_tipo = 'err';
      } finally {
        this.guardandoPass = false;
        setTimeout(() => { this.msm_pass = ''; }, 3500);
      }
    }
  }
}
</script>
