<template>
  <div class="pf-page">

    <!-- TOAST -->
    <transition name="pf-toast">
      <div v-if="toast.visible" :class="['pf-toast', toast.type]">
        <span class="pf-toast-icon">{{ toast.type === 'ok' ? '✓' : '✕' }}</span>
        {{ toast.msg }}
      </div>
    </transition>

    <div class="pf-wrap">

      <!-- ══════════════ AVATAR ══════════════ -->
      <section class="pf-card pf-avatar-card">
        <div class="pf-avatar-wrap">
          <div class="pf-avatar-circle">
            <img
              v-if="avatarSrc"
              :src="avatarSrc"
              alt="Avatar"
              class="pf-avatar-img"
            />
            <span v-else class="pf-avatar-initials">{{ initials }}</span>
            <label class="pf-avatar-overlay" title="Cambiar foto">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              <input type="file" accept="image/*" @change="onAvatarSelect" hidden />
            </label>
          </div>
          <div class="pf-avatar-info">
            <h2>{{ form.nombres }} {{ form.apellidos }}</h2>
            <p>{{ form.email }}</p>
          </div>
        </div>
        <div v-if="avatarFile" class="pf-avatar-preview-row">
          <span class="pf-avatar-fname">{{ avatarFile.name }}</span>
          <button class="pf-btn-sm" @click="subirAvatar" :disabled="saving_avatar">
            <span v-if="saving_avatar" class="pf-spinner-sm"></span>
            <span v-else>Guardar foto</span>
          </button>
          <button class="pf-btn-sm pf-btn-ghost" @click="cancelarAvatar">Cancelar</button>
        </div>
      </section>

      <!-- ══════════════ INFO PERSONAL ══════════════ -->
      <section class="pf-card">
        <h3 class="pf-section-title">Información personal</h3>
        <div class="pf-grid2">
          <div class="pf-field">
            <label>Nombres</label>
            <input v-model="form.nombres" type="text" placeholder="Tus nombres" />
          </div>
          <div class="pf-field">
            <label>Apellidos</label>
            <input v-model="form.apellidos" type="text" placeholder="Tus apellidos" />
          </div>
          <div class="pf-field">
            <label>País</label>
            <select v-model="form.pais">
              <option value="">Selecciona</option>
              <option v-for="p in paises" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
          <div class="pf-field">
            <label>Género</label>
            <select v-model="form.genero">
              <option value="">Selecciona</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
              <option value="Prefiero no decir">Prefiero no decir</option>
            </select>
          </div>
        </div>
        <div class="pf-field pf-field-full" style="margin-top:12px">
          <label>Correo electrónico</label>
          <input v-model="form.email" type="email" placeholder="tucorreo@ejemplo.com" disabled />
          <span class="pf-hint">El correo no puede modificarse.</span>
        </div>
        <div class="pf-form-footer">
          <button class="pf-btn" @click="guardarPerfil" :disabled="saving_info">
            <span v-if="saving_info" class="pf-spinner-sm pf-spinner-white"></span>
            <span v-else>Guardar cambios</span>
          </button>
        </div>
      </section>

      <!-- ══════════════ CAMBIAR CONTRASEÑA ══════════════ -->
      <section class="pf-card">
        <h3 class="pf-section-title">Cambiar contraseña</h3>
        <div class="pf-grid1">
          <div class="pf-field">
            <label>Contraseña actual</label>
            <div class="pf-pw-wrap">
              <input
                :type="showPw.actual ? 'text' : 'password'"
                v-model="pw.actual"
                placeholder="••••••••"
              />
              <button type="button" class="pf-eye" @click="showPw.actual = !showPw.actual">
                <svg v-if="!showPw.actual" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>
          <div class="pf-field">
            <label>Nueva contraseña</label>
            <div class="pf-pw-wrap">
              <input
                :type="showPw.nueva ? 'text' : 'password'"
                v-model="pw.nueva"
                placeholder="••••••••"
                @input="checkPwReqs"
              />
              <button type="button" class="pf-eye" @click="showPw.nueva = !showPw.nueva">
                <svg v-if="!showPw.nueva" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
            <div class="pf-pw-reqs" v-if="pw.nueva.length > 0">
              <span :class="['pf-req', pwReq.length && 'ok']">· 8 caracteres</span>
              <span :class="['pf-req', pwReq.upper && 'ok']">· Mayúscula</span>
              <span :class="['pf-req', pwReq.lower && 'ok']">· Minúscula</span>
              <span :class="['pf-req', pwReq.special && 'ok']">· Carácter especial</span>
            </div>
          </div>
          <div class="pf-field">
            <label>Confirmar nueva contraseña</label>
            <div class="pf-pw-wrap">
              <input
                :type="showPw.confirmar ? 'text' : 'password'"
                v-model="pw.confirmar"
                placeholder="••••••••"
              />
              <button type="button" class="pf-eye" @click="showPw.confirmar = !showPw.confirmar">
                <svg v-if="!showPw.confirmar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
            <span v-if="pw.confirmar && pw.nueva !== pw.confirmar" class="pf-nomatch">Las contraseñas no coinciden.</span>
          </div>
        </div>
        <div class="pf-form-footer">
          <button class="pf-btn" @click="cambiarPassword" :disabled="saving_pw">
            <span v-if="saving_pw" class="pf-spinner-sm pf-spinner-white"></span>
            <span v-else>Actualizar contraseña</span>
          </button>
        </div>
      </section>

    </div><!-- /pf-wrap -->
  </div><!-- /pf-page -->
</template>

<script>
import axios from 'axios'

export default {
  name: 'PerfilApp',
  data() {
    return {
      loading: true,
      saving_info: false,
      saving_avatar: false,
      saving_pw: false,
      form: { nombres: '', apellidos: '', email: '', pais: '', genero: '' },
      avatarSrc: null,
      avatarFile: null,
      avatarPreview: null,
      pw: { actual: '', nueva: '', confirmar: '' },
      pwReq: { length: false, upper: false, lower: false, special: false },
      showPw: { actual: false, nueva: false, confirmar: false },
      toast: { visible: false, msg: '', type: 'ok', _timer: null },
      paises: [
        'Argentina','Bolivia','Chile','Colombia','Costa Rica','Cuba',
        'Ecuador','El Salvador','España','Guatemala','Honduras','México',
        'Nicaragua','Panamá','Paraguay','Perú','Puerto Rico','República Dominicana',
        'Uruguay','Venezuela','Otro'
      ]
    }
  },
  computed: {
    initials() {
      const n = (this.form.nombres || '').trim().split(' ')[0] || ''
      const a = (this.form.apellidos || '').trim().split(' ')[0] || ''
      return ((n[0] || '') + (a[0] || '')).toUpperCase() || '?'
    }
  },
  async created() {
    await this.cargarPerfil()
  },
  methods: {
    showToast(msg, type = 'ok') {
      if (this.toast._timer) clearTimeout(this.toast._timer)
      this.toast.msg = msg
      this.toast.type = type
      this.toast.visible = true
      this.toast._timer = setTimeout(() => { this.toast.visible = false }, 3400)
    },

    async cargarPerfil() {
      try {
        const res = await axios.get(this.$url + '/obtener_perfil_cliente', {
          headers: { Authorization: this.$store.state.token }
        })
        const c = res.data
        this.form = {
          nombres: c.nombres || '',
          apellidos: c.apellidos || '',
          email: c.email || '',
          pais: c.pais || '',
          genero: c.genero || ''
        }
        if (c.avatar) {
          this.avatarSrc = this.$url + '/obtener_avatar_cliente/' + c.avatar
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    onAvatarSelect(e) {
      const file = e.target.files[0]
      if (!file) return
      this.avatarFile = file
      const reader = new FileReader()
      reader.onload = ev => { this.avatarSrc = ev.target.result }
      reader.readAsDataURL(file)
    },

    cancelarAvatar() {
      this.avatarFile = null
      const userData = JSON.parse(this.$store.state.user || '{}')
      this.avatarSrc = userData.avatar ? this.$url + '/obtener_avatar_cliente/' + userData.avatar : null
    },

    async subirAvatar() {
      if (!this.avatarFile) return
      this.saving_avatar = true
      try {
        const fd = new FormData()
        fd.append('avatar', this.avatarFile)
        // Reutilizamos el endpoint general de actualizar perfil
        const res = await axios.put(this.$url + '/actualizar_perfil_cliente', fd, {
          headers: { Authorization: this.$store.state.token, 'Content-Type': 'multipart/form-data' }
        })
        this.avatarSrc = this.$url + '/obtener_avatar_cliente/' + res.data.avatar
        this.avatarFile = null
        // persistir en store
        const userData = JSON.parse(this.$store.state.user || '{}')
        userData.avatar = res.data.avatar
        this.$store.dispatch('saveUser', JSON.stringify(userData))
        this.showToast('Foto de perfil actualizada.')
      } catch (e) {
        this.showToast('Error al subir la foto.', 'err')
      } finally {
        this.saving_avatar = false
      }
    },

    async guardarPerfil() {
      if (!this.form.nombres.trim() || !this.form.apellidos.trim()) {
        this.showToast('Nombre y apellidos son obligatorios.', 'err'); return
      }
      this.saving_info = true
      try {
        const fd = new FormData()
        fd.append('nombres', this.form.nombres)
        fd.append('apellidos', this.form.apellidos)
        fd.append('pais', this.form.pais)
        fd.append('genero', this.form.genero)
        await axios.put(this.$url + '/actualizar_perfil_cliente', fd, {
          headers: { Authorization: this.$store.state.token }
        })
        // actualizar store local
        const userData = JSON.parse(this.$store.state.user || '{}')
        Object.assign(userData, { nombres: this.form.nombres, apellidos: this.form.apellidos, pais: this.form.pais, genero: this.form.genero })
        this.$store.dispatch('saveUser', JSON.stringify(userData))
        this.showToast('Perfil actualizado correctamente.')
      } catch (e) {
        this.showToast('Error al guardar los datos.', 'err')
      } finally {
        this.saving_info = false
      }
    },

    checkPwReqs() {
      const v = this.pw.nueva
      this.pwReq = {
        length: v.length >= 8,
        upper: /[A-Z]/.test(v),
        lower: /[a-z]/.test(v),
        special: /[^A-Za-z0-9]/.test(v)
      }
    },

    async cambiarPassword() {
      if (!this.pw.actual) { this.showToast('Escribe tu contraseña actual.', 'err'); return }
      if (!this.pwReq.length || !this.pwReq.upper || !this.pwReq.lower || !this.pwReq.special) {
        this.showToast('La nueva contraseña no cumple los requisitos.', 'err'); return
      }
      if (this.pw.nueva !== this.pw.confirmar) {
        this.showToast('Las contraseñas no coinciden.', 'err'); return
      }
      this.saving_pw = true
      try {
        await axios.put(
          this.$url + '/cambiar_password_cliente',
          { password_actual: this.pw.actual, password_nuevo: this.pw.nueva },
          { headers: { Authorization: this.$store.state.token } }
        )
        this.pw = { actual: '', nueva: '', confirmar: '' }
        this.pwReq = { length: false, upper: false, lower: false, special: false }
        this.showToast('Contraseña actualizada correctamente.')
      } catch (e) {
        const msg = e.response?.data?.message || 'Error al cambiar la contraseña.'
        this.showToast(msg, 'err')
      } finally {
        this.saving_pw = false
      }
    }
  }
}
</script>

<style scoped>
/* ── página ── */
.pf-page { min-height: 80vh; background: #f7f7f7; padding: 16px 16px 80px; }
.pf-wrap  { max-width: 720px; margin: 80px auto 0; display: flex; flex-direction: column; gap: 20px; }

/* ── tarjeta base ── */
.pf-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  padding: 28px 32px;
  overflow: visible;
}
.pf-avatar-card { padding-top: 40px; }
.pf-section-title { font-size: 15px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: #111; margin: 0 0 20px; }

/* ── avatar ── */
.pf-avatar-wrap { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.pf-avatar-circle {
  width: 90px; height: 90px; border-radius: 50%;
  background: #111; flex-shrink: 0;
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.pf-avatar-img { width: 100%; height: 100%; object-fit: cover; }
.pf-avatar-initials { color: #fff; font-size: 26px; font-weight: 700; letter-spacing: .02em; user-select: none; }
.pf-avatar-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,.45);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; cursor: pointer; transition: opacity .2s;
}
.pf-avatar-overlay svg { width: 22px; height: 22px; color: #fff; }
.pf-avatar-circle:hover .pf-avatar-overlay { opacity: 1; }
.pf-avatar-info h2 { font-size: 18px; font-weight: 700; margin: 0 0 4px; color: #111; }
.pf-avatar-info p  { font-size: 13px; color: #888; margin: 0; }
.pf-avatar-preview-row { display: flex; align-items: center; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
.pf-avatar-fname { font-size: 13px; color: #555; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ── grid campos ── */
.pf-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.pf-grid1 { display: grid; grid-template-columns: 1fr; gap: 14px; }
@media(max-width:540px){ .pf-grid2 { grid-template-columns: 1fr; } }
.pf-field { display: flex; flex-direction: column; gap: 5px; }
.pf-field-full { width: 100%; }
.pf-field label { font-size: 12px; font-weight: 600; color: #555; letter-spacing: .04em; text-transform: uppercase; }
.pf-field input,
.pf-field select {
  border: 1px solid #ddd; border-radius: 6px;
  padding: 9px 13px; font-size: 14px; color: #111;
  background: #fff; outline: none; transition: border-color .18s;
  width: 100%; box-sizing: border-box;
}
.pf-field input:focus,
.pf-field select:focus { border-color: #111; }
.pf-field input:disabled { background: #f2f2f2; color: #999; cursor: not-allowed; }
.pf-hint { font-size: 12px; color: #aaa; }

/* ── password ── */
.pf-pw-wrap { position: relative; }
.pf-pw-wrap input { padding-right: 42px; }
.pf-eye {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center;
  color: #aaa;
}
.pf-eye svg { width: 18px; height: 18px; }
.pf-eye:hover { color: #111; }
.pf-pw-reqs { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 5px; }
.pf-req  { font-size: 12px; color: #bbb; transition: color .2s; }
.pf-req.ok { color: #22a94f; font-weight: 600; }
.pf-nomatch { font-size: 12px; color: #e34234; margin-top: 3px; }

/* ── botones ── */
.pf-form-footer { margin-top: 20px; display: flex; justify-content: flex-end; }
.pf-btn {
  background: #111; color: #fff;
  border: none; border-radius: 6px;
  padding: 11px 26px; font-size: 14px; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; gap: 8px;
  transition: background .18s;
}
.pf-btn:hover:not(:disabled) { background: #333; }
.pf-btn:disabled { opacity: .6; cursor: not-allowed; }
.pf-btn-sm {
  background: #111; color: #fff;
  border: none; border-radius: 6px;
  padding: 8px 16px; font-size: 13px; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; gap: 6px;
  transition: background .18s;
}
.pf-btn-sm:hover:not(:disabled) { background: #333; }
.pf-btn-sm:disabled { opacity: .6; cursor: not-allowed; }
.pf-btn-ghost { background: #fff; color: #111; border: 1px solid #ddd; }
.pf-btn-ghost:hover { background: #f5f5f5; }

/* ── spinner ── */
.pf-spinner-sm {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(0,0,0,.15); border-top-color: #111;
  animation: pf-spin .7s linear infinite; display: inline-block;
}
.pf-spinner-white { border-color: rgba(255,255,255,.3); border-top-color: #fff; }
@keyframes pf-spin { to { transform: rotate(360deg); } }

/* ── toast ── */
.pf-toast {
  position: fixed; bottom: 28px; right: 28px; z-index: 9999;
  display: flex; align-items: center; gap: 10px;
  background: #111; color: #fff;
  padding: 13px 20px; border-radius: 8px;
  font-size: 14px; font-weight: 500;
  box-shadow: 0 4px 20px rgba(0,0,0,.18);
  max-width: 340px;
}
.pf-toast.err { background: #e34234; }
.pf-toast-icon { font-size: 16px; }
.pf-toast-enter-active, .pf-toast-leave-active { transition: all .25s ease; }
.pf-toast-enter-from, .pf-toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>
