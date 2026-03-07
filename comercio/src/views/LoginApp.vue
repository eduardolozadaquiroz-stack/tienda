<template>
  <div class="login-page">

    <div class="login-split">

      <!-- LADO IZQUIERDO — imagen/branding -->
      <div class="login-visual">
        <div class="login-visual-bg" style="background-image: url('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&auto=format&fit=crop&q=80')"></div>
        <div class="login-visual-overlay"></div>
        <div class="login-visual-content">
          <router-link to="/" class="login-logo">👕 OVERSIZE MX</router-link>
          <h2 class="login-visual-title">Tu estilo,<br>tu identidad.</h2>
          <p class="login-visual-sub">Playeras oversize con diseños únicos.<br>Tallas S hasta XXL · Hecho en México.</p>
        </div>
      </div>

      <!-- LADO DERECHO — formularios -->
      <div class="login-forms-wrap">
        <div class="login-forms-inner">

          <!-- TABS -->
          <div class="login-tabs">
            <button class="login-tab" :class="{ active: activeTab === 'login' }" @click="activeTab = 'login'">Iniciar sesión</button>
            <button class="login-tab" :class="{ active: activeTab === 'registro' }" @click="activeTab = 'registro'">Crear cuenta</button>
          </div>

          <!-- INICIAR SESIÓN -->
          <div v-if="activeTab === 'login'" class="login-form">
            <p class="login-form-desc">Ingresa a tu cuenta para ver tus pedidos y gestionar tus datos.</p>

            <div class="lf-group">
              <label class="lf-label">Correo electrónico</label>
              <input class="lf-input" type="email" placeholder="tu@correo.com" autocomplete="off" v-model="email" />
            </div>
            <div class="lf-group">
              <label class="lf-label">Contraseña</label>
              <div class="pw-wrap">
                <input class="lf-input" :type="showPwLogin ? 'text' : 'password'" placeholder="••••••••" autocomplete="off" v-model="password" />
                <button type="button" class="pw-eye" @click="showPwLogin = !showPwLogin" tabindex="-1">
                  <svg v-if="!showPwLogin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
            </div>

            <div class="lf-error" v-if="msm_error_login">{{ msm_error_login }}</div>

            <button class="lf-btn" type="button" @click="login()">Ingresar</button>

            <p class="login-switch">¿No tienes cuenta? <a @click="activeTab = 'registro'">Crear una gratis →</a></p>
          </div>

          <!-- REGISTRARSE -->
          <div v-if="activeTab === 'registro'" class="login-form">
            <p class="login-form-desc">Crea tu cuenta y empieza a personalizar tus playeras.</p>

            <div class="lf-group">
              <label class="lf-label">Nombre completo</label>
              <input class="lf-input" type="text" placeholder="Tu nombre" v-model="cliente.nombres" />
            </div>
            <div class="lf-group">
              <label class="lf-label">Correo electrónico</label>
              <input class="lf-input" type="email" placeholder="tu@correo.com" v-model="cliente.email" />
            </div>
            <div class="lf-group">
              <label class="lf-label">Contraseña</label>
              <div class="pw-wrap">
                <input class="lf-input" :type="showPwReg ? 'text' : 'password'" placeholder="••••••••" v-model="cliente.password" @input="checkPassword" />
                <button type="button" class="pw-eye" @click="showPwReg = !showPwReg" tabindex="-1">
                  <svg v-if="!showPwReg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
              <div class="pw-reqs" v-if="cliente.password">
                <span :class="pwReq.length ? 'req ok' : 'req'">{{ pwReq.length ? '✓' : '✗' }} Mínimo 8 caracteres</span>
                <span :class="pwReq.upper ? 'req ok' : 'req'">{{ pwReq.upper ? '✓' : '✗' }} Una mayúscula</span>
                <span :class="pwReq.lower ? 'req ok' : 'req'">{{ pwReq.lower ? '✓' : '✗' }} Una minúscula</span>
                <span :class="pwReq.special ? 'req ok' : 'req'">{{ pwReq.special ? '✓' : '✗' }} Un carácter especial</span>
              </div>
            </div>
            <div class="lf-group">
              <label class="lf-label">Confirmar contraseña</label>
              <div class="pw-wrap">
                <input class="lf-input" :type="showPwConfirm ? 'text' : 'password'" placeholder="••••••••" v-model="confirmar_password"
                  :style="confirmar_password && cliente.password !== confirmar_password ? { borderColor: '#dc2626' } : {}" />
                <button type="button" class="pw-eye" @click="showPwConfirm = !showPwConfirm" tabindex="-1">
                  <svg v-if="!showPwConfirm" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
              <p class="pw-nomatch" v-if="confirmar_password && cliente.password !== confirmar_password">Las contraseñas no coinciden.</p>
            </div>

            <div class="lf-error" v-if="msm_error">{{ msm_error }}</div>
            <div class="lf-success" v-if="msm_success">{{ msm_success }}</div>

            <button class="lf-btn" type="button" @click="validar_registro()">Crear cuenta</button>

            <p class="login-switch">¿Ya tienes cuenta? <a @click="activeTab = 'login'">Inicia sesión →</a></p>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
* { box-sizing: border-box; }
a { text-decoration: none; color: inherit; cursor: pointer; }

.login-page { min-height: 100vh; background: #f5f5f5; }

.login-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

/* ── VISUAL ── */
.login-visual {
  position: relative;
  overflow: hidden;
}
.login-visual-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center 30%;
  filter: brightness(.42);
}
.login-visual-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(10,10,20,.7) 0%, rgba(0,0,0,.3) 100%);
}
.login-visual-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 48px;
  color: #fff;
}
.login-logo {
  position: absolute;
  top: 40px;
  left: 48px;
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #fff;
}
.login-visual-title {
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 900;
  line-height: 1.1;
  margin: 0 0 14px;
  letter-spacing: -1px;
}
.login-visual-sub {
  font-size: 14px;
  color: rgba(255,255,255,.65);
  line-height: 1.7;
  margin: 0;
}

/* ── FORMS WRAP ── */
.login-forms-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
  background: #fff;
}
.login-forms-inner {
  width: 100%;
  max-width: 420px;
}

/* ── TABS ── */
.login-tabs {
  display: flex;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 32px;
}
.login-tab {
  flex: 1;
  background: none;
  border: none;
  padding: 12px 0;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #aaa;
  cursor: pointer;
  position: relative;
  transition: color .2s;
}
.login-tab.active {
  color: #111;
}
.login-tab.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: #111;
  border-radius: 2px;
}

/* ── FORM ── */
.login-form-desc {
  font-size: 13px;
  color: #888;
  margin: 0 0 28px;
  line-height: 1.6;
}
.lf-group {
  margin-bottom: 18px;
}
.lf-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 6px;
}
.lf-input {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  color: #111;
  background: #fafafa;
  outline: none;
  transition: border-color .2s, background .2s;
}
.lf-input:focus {
  border-color: #111;
  background: #fff;
}
.lf-error {
  background: #fef2f2;
  color: #dc2626;
  font-size: 12px;
  padding: 10px 14px;
  border-radius: 6px;
  margin-bottom: 16px;
  border: 1px solid #fca5a5;
}
.lf-success {
  background: #f0fdf4;
  color: #16a34a;
  font-size: 12px;
  font-weight: 600;
  padding: 10px 14px;
  border-radius: 6px;
  margin-bottom: 16px;
  border: 1px solid #86efac;
}
.lf-btn {
  width: 100%;
  background: #111;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 6px;
  transition: background .2s, transform .15s;
}
.lf-btn:hover {
  background: #333;
  transform: translateY(-1px);
}
.login-switch {
  text-align: center;
  font-size: 13px;
  color: #999;
  margin-top: 20px;
}
.login-switch a {
  color: #111;
  font-weight: 700;
}
.login-switch a:hover {
  text-decoration: underline;
}

/* ── PASSWORD WRAP / EYE ── */
.pw-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.pw-wrap .lf-input {
  padding-right: 44px;
}
.pw-eye {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
  transition: color .2s;
}
.pw-eye:hover {
  color: #111;
}

/* ── PASSWORD REQUIREMENTS ── */
.pw-reqs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  margin-top: 8px;
}
.req {
  font-size: 11px;
  color: #bbb;
  transition: color .2s;
}
.req.ok {
  color: #16a34a;
  font-weight: 600;
}
.pw-nomatch {
  font-size: 11px;
  color: #dc2626;
  margin: 5px 0 0;
}

@media (max-width: 768px) {
  .login-split { grid-template-columns: 1fr; }
  .login-visual { display: none; }
  .login-forms-wrap { padding: 60px 24px; }
}
</style>

<script>

import axios from 'axios';

export default {
    name: 'LoginApp',
    data() {
        return {
            activeTab: 'login',
            cliente: {},
            confirmar_password: '',
            pwReq: { length: false, upper: false, lower: false, special: false },
            showPwLogin: false,
            showPwReg: false,
            showPwConfirm: false,
            msm_error: '',
            msm_success: '',
            email: '',
            password: '',
            msm_error_login: ''
        }
    },

    beforeMount(){
        if (this.$store.state.token) {
            this.$router.push({name: 'home'});
        }
    },


    methods: {
        checkPassword(){
            const p = this.cliente.password || '';
            this.pwReq.length  = p.length >= 8;
            this.pwReq.upper   = /[A-Z]/.test(p);
            this.pwReq.lower   = /[a-z]/.test(p);
            this.pwReq.special = /[^A-Za-z0-9]/.test(p);
        },

        validar_registro(){
            const p = this.cliente.password || '';
            this.checkPassword();
            if(!this.cliente.nombres){
                this.msm_error = 'Ingrese los nombres por favor.'
            }else if(!this.cliente.email){
                this.msm_error = 'Ingrese el correo electrónico por favor.'
            }else if(!p){
                this.msm_error = 'Ingrese la contraseña por favor.'
            }else if(p.length < 8){
                this.msm_error = 'La contraseña debe tener al menos 8 caracteres.'
            }else if(!/[A-Z]/.test(p)){
                this.msm_error = 'La contraseña debe incluir al menos una letra mayúscula.'
            }else if(!/[a-z]/.test(p)){
                this.msm_error = 'La contraseña debe incluir al menos una letra minúscula.'
            }else if(!/[^A-Za-z0-9]/.test(p)){
                this.msm_error = 'La contraseña debe incluir al menos un carácter especial (ej: @, #, !).'
            }else if(p !== this.confirmar_password){
                this.msm_error = 'Las contraseñas no coinciden.'
            }else{
                //
                this.msm_error = '';
                axios.post(this.$url+'/registro_cliente_ecommerce',this.cliente,{
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((result)=>{
                    if(result.data.message){
                        this.msm_error = result.data.message;
                    }else{
                        this.msm_error = '';
                        this.$store.dispatch('saveToken', result.data.token);
                        this.$store.dispatch('saveUser', JSON.stringify(result.data.cliente));
                        this.msm_success = '✓ ¡Cuenta creada exitosamente! Redirigiendo a la tienda...';
                        setTimeout(() => {
                            this.$router.push({ name: 'home' });
                        }, 1800);
                    }
                   
                })
            }
        },

        login(){
            if(!this.email){
                this.msm_error_login = 'Ingrese un correo electrónico';
            }else if(!this.password){
                this.msm_error_login = 'Ingrese una contraseña';
            }else{
                this.msm_error_login = '';
                let data = {
                    email: this.email,
                    password: this.password
                }
                axios.post(this.$url+'/login_cliente',data,{
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((result)=>{

                    if(result.data.message){
                        this.msm_error_login = result.data.message;
                    }else{
                        this.msm_error_login = '';
                        this.msm_success = '¡Bienvenido!';
                        this.$store.dispatch('saveToken',result.data.token);
                        this.$store.dispatch('saveUser',JSON.stringify(result.data.cliente));
                        setTimeout(() => {
                            this.$router.push({name: 'home'});
                            this.$socket.emit('send_cart',true);
                        }, 800);
                    }

                }).catch((error)=>{
                    const msg = error.response?.data?.message || 'Error al iniciar sesión, intenta de nuevo.';
                    this.msm_error_login = msg;
                });
            }
        }
    },
}
</script>