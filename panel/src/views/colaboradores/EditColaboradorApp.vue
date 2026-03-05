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
                    <router-link to="/colaboradores" style="color:#868e96;text-decoration:none;">Colaboradores</router-link>
                    <span style="color:#ced4da;margin:0 6px;">/</span>
                    <span style="background:#3b5bdb;color:#fff;border-radius:20px;padding:2px 12px;font-weight:600;">✏️ Editar colaborador</span>
                </nav>
            </div>
            <div class="container-fluid py-4">
                <div class="row justify-content-center">
                <div class="col-12 col-lg-8 col-xl-6">

                    <!-- Header -->
                    <div class="d-flex align-items-center justify-content-between mb-4">
                        <div>
                            <p class="text-muted mb-1" style="font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase">Colaboradores</p>
                            <h2 class="mb-0" style="font-weight:700">Editar colaborador</h2>
                        </div>
                        <router-link to="/colaborador" class="btn btn-sm" style="border-radius:8px;border:1px solid #dee2e6;font-weight:600;font-size:13px;padding:8px 16px;color:#495057">
                            <i class="fe fe-arrow-left me-1"></i> Volver
                        </router-link>
                    </div>

                    <template v-if="data">

                        <!-- Card datos personales -->
                        <div class="card border-0 shadow-sm mb-4" style="border-radius:16px;overflow:hidden">

                            <div class="px-4 pt-4 pb-3" style="background:linear-gradient(135deg,#3b5bdb 0%,#4c6ef5 100%)">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" :style="'width:52px;height:52px;font-size:18px;flex-shrink:0;background:rgba(255,255,255,0.2)'">
                                        {{ iniciales(colaborador.nombres, colaborador.apellidos) }}
                                    </div>
                                    <div>
                                        <h5 class="mb-0 text-white" style="font-weight:700">{{ colaborador.nombres }} {{ colaborador.apellidos }}</h5>
                                        <p class="mb-0" style="font-size:13px;color:rgba(255,255,255,0.75)">{{ colaborador.email }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="card-body p-4">
                                <div class="row g-3">
                                    <div class="col-12 col-md-6">
                                        <label class="form-label fw-semibold" style="font-size:13px">Nombres <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" style="border-radius:8px;border:1.5px solid #e9ecef;padding:10px 14px;font-size:14px" v-model="colaborador.nombres" placeholder="Nombres completos">
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <label class="form-label fw-semibold" style="font-size:13px">Apellidos <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" style="border-radius:8px;border:1.5px solid #e9ecef;padding:10px 14px;font-size:14px" v-model="colaborador.apellidos" placeholder="Apellidos completos">
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label fw-semibold" style="font-size:13px">Correo electrónico <span class="text-danger">*</span></label>
                                        <div class="position-relative">
                                            <i class="fe fe-mail position-absolute" style="top:50%;left:12px;transform:translateY(-50%);color:#adb5bd"></i>
                                            <input type="email" class="form-control ps-5" style="border-radius:8px;border:1.5px solid #e9ecef;padding:10px 14px;font-size:14px" v-model="colaborador.email" placeholder="correo@empresa.com">
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label fw-semibold" style="font-size:13px">Cargo <span class="text-danger">*</span></label>
                                        <select class="form-select" style="border-radius:8px;border:1.5px solid #e9ecef;padding:10px 14px;font-size:14px" v-model="colaborador.rol">
                                            <option value="" disabled>Seleccionar cargo...</option>
                                            <option value="Administrador">Administrador</option>
                                            <option value="Vendedor">Vendedor</option>
                                            <option value="Inventariado">Inventariado</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="card-footer bg-white border-top d-flex align-items-center justify-content-between px-4 py-3">
                                <p class="mb-0 text-muted" style="font-size:12px"><span class="text-danger">*</span> Campos obligatorios</p>
                                <button type="button" class="btn btn-primary" style="border-radius:8px;font-weight:600;padding:10px 28px" v-on:click="validar()">
                                    <i class="fe fe-save me-2"></i>Guardar cambios
                                </button>
                            </div>
                        </div>

                        <!-- Card imagen de perfil -->
                        <div class="card border-0 shadow-sm mb-4" style="border-radius:16px;overflow:hidden">
                            <div class="px-4 pt-4 pb-3" style="background:linear-gradient(135deg,#0ca678 0%,#12b886 100%)">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="rounded-circle d-flex align-items-center justify-content-center" style="width:52px;height:52px;background:rgba(255,255,255,0.15)">
                                        <i class="fe fe-camera" style="font-size:22px;color:#fff"></i>
                                    </div>
                                    <div>
                                        <h5 class="mb-0 text-white" style="font-weight:700">Foto de perfil</h5>
                                        <p class="mb-0" style="font-size:13px;color:rgba(255,255,255,0.75)">JPG o PNG — máximo 5MB</p>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body p-4">
                                <div class="d-flex align-items-center gap-4 flex-wrap">
                                    <!-- Avatar actual -->
                                    <div style="flex-shrink:0;">
                                        <div v-if="!colaborador.avatar && !previewAvatar" class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" :style="'width:90px;height:90px;font-size:32px;background:#0ca678;'">
                                            {{ iniciales(colaborador.nombres, colaborador.apellidos) }}
                                        </div>
                                        <img v-if="previewAvatar" :src="previewAvatar" class="rounded-circle" style="width:90px;height:90px;object-fit:cover;border:3px solid #12b886;" alt="preview">
                                        <img v-if="colaborador.avatar && !previewAvatar" :src="$url+'/obtener_avatar_usuario/'+colaborador.avatar" class="rounded-circle" style="width:90px;height:90px;object-fit:cover;border:3px solid #12b886;" alt="avatar">
                                    </div>
                                    <!-- Selector de archivo -->
                                    <div style="flex:1;min-width:200px;">
                                        <label class="form-label fw-semibold" style="font-size:13px;">Seleccionar nueva imagen</label>
                                        <input type="file" class="form-control" accept="image/png, image/jpeg" @change="onAvatarChange" style="border-radius:8px;border:1.5px solid #e9ecef;font-size:13px;">
                                        <small class="text-muted" style="font-size:12px;">Formatos aceptados: JPG, PNG</small>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer bg-white border-top d-flex justify-content-end px-4 py-3">
                                <button type="button" class="btn" style="border-radius:8px;font-weight:600;padding:10px 28px;background:#0ca678;color:#fff" :disabled="!avatarFile || subiendoAvatar" v-on:click="subirAvatar()">
                                    <i class="fe fe-upload me-2"></i>{{ subiendoAvatar ? 'Subiendo...' : 'Guardar foto de perfil' }}
                                </button>
                            </div>
                        </div>

                        <!-- Card cambiar contraseña -->
                        <div class="card border-0 shadow-sm" style="border-radius:16px;overflow:hidden">

                            <div class="px-4 pt-4 pb-3" style="background:linear-gradient(135deg,#495057 0%,#6c757d 100%)">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="rounded-circle d-flex align-items-center justify-content-center" style="width:52px;height:52px;background:rgba(255,255,255,0.15)">
                                        <i class="fe fe-lock" style="font-size:22px;color:#fff"></i>
                                    </div>
                                    <div>
                                        <h5 class="mb-0 text-white" style="font-weight:700">Cambiar contraseña</h5>
                                        <p class="mb-0" style="font-size:13px;color:rgba(255,255,255,0.75)">Déjalo en blanco si no deseas cambiarla</p>
                                    </div>
                                </div>
                            </div>

                            <div class="card-body p-4">
                                <div class="row g-3">
                                    <div class="col-12 col-md-6">
                                        <label class="form-label fw-semibold" style="font-size:13px">Nueva contraseña</label>
                                        <div class="position-relative">
                                            <i class="fe fe-key position-absolute" style="top:50%;left:12px;transform:translateY(-50%);color:#adb5bd"></i>
                                            <input :type="mostrar_pass1 ? 'text' : 'password'" class="form-control ps-5 pe-5" style="border-radius:8px;border:1.5px solid #e9ecef;padding:10px 14px;font-size:14px" v-model="nueva_password" placeholder="Mínimo 6 caracteres">
                                            <button type="button" @click="mostrar_pass1 = !mostrar_pass1" class="position-absolute border-0 bg-transparent p-0" style="top:50%;right:12px;transform:translateY(-50%);color:#adb5bd;cursor:pointer">
                                                <i :class="mostrar_pass1 ? 'fe fe-eye-off' : 'fe fe-eye'"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <label class="form-label fw-semibold" style="font-size:13px">Confirmar contraseña</label>
                                        <div class="position-relative">
                                            <i class="fe fe-check-circle position-absolute" style="top:50%;left:12px;transform:translateY(-50%);color:#adb5bd"></i>
                                            <input :type="mostrar_pass2 ? 'text' : 'password'" class="form-control ps-5 pe-5" :style="'border-radius:8px;font-size:14px;padding:10px 14px;border:1.5px solid ' + (confirmar_password && nueva_password ? (nueva_password.trim()===confirmar_password.trim() ? '#2b8a3e' : '#c92a2a') : '#e9ecef')" v-model="confirmar_password" placeholder="Repite la contraseña">
                                            <button type="button" @click="mostrar_pass2 = !mostrar_pass2" class="position-absolute border-0 bg-transparent p-0" style="top:50%;right:12px;transform:translateY(-50%);color:#adb5bd;cursor:pointer">
                                                <i :class="mostrar_pass2 ? 'fe fe-eye-off' : 'fe fe-eye'"></i>
                                            </button>
                                        </div>
                                        <small v-if="confirmar_password && nueva_password" :style="nueva_password.trim()===confirmar_password.trim() ? 'color:#2b8a3e;font-size:12px' : 'color:#c92a2a;font-size:12px'">
                                            <i :class="nueva_password.trim()===confirmar_password.trim() ? 'fe fe-check me-1' : 'fe fe-x me-1'"></i>
                                            {{ nueva_password.trim()===confirmar_password.trim() ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden' }}
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <div class="card-footer bg-white border-top d-flex justify-content-end px-4 py-3">
                                <button type="button" class="btn" style="border-radius:8px;font-weight:600;padding:10px 28px;background:#495057;color:#fff" v-on:click="validar_password()">
                                    <i class="fe fe-lock me-2"></i>Actualizar contraseña
                                </button>
                            </div>
                        </div>

                    </template>

                    <template v-if="!data">
                        <ErrorNotFound />
                    </template>

                    <br>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import Sidebar from '@/components/Sidebar.vue';
import TopNav from '@/components/TopNav.vue';
import ErrorNotFound from '@/components/ErrorNotFound.vue';
import axios from 'axios';

export default {
    name: 'EditColaboradorApp',

    data() {
        return {
            colaborador : {
                rol: ''
            },
            id: this.$route.params.id,
            data: false,
            nueva_password: '',
            confirmar_password: '',
            mostrar_pass1: false,
            mostrar_pass2: false,
            avatarFile: null,
            previewAvatar: null,
            subiendoAvatar: false,
        }
    },

    methods: {

        onAvatarChange(e) {
            const file = e.target.files[0];
            if (!file) return;
            this.avatarFile = file;
            this.previewAvatar = URL.createObjectURL(file);
        },

        subirAvatar() {
            if (!this.avatarFile) return;
            this.subiendoAvatar = true;
            const formData = new FormData();
            formData.append('avatar', this.avatarFile);
            axios.post(this.$url + '/subir_avatar_usuario_admin/' + this.id, formData, {
                headers: { 'Authorization': this.$store.state.token, 'Content-Type': 'multipart/form-data' }
            }).then((result) => {
                this.colaborador.avatar = result.data.avatar;
                this.avatarFile = null;
                this.previewAvatar = null;
                this.subiendoAvatar = false;
                this.$notify({ group: 'foo', title: 'SUCCESS', text: 'Foto de perfil actualizada', type: 'success' });
            }).catch(() => {
                this.subiendoAvatar = false;
                this.$notify({ group: 'foo', title: 'ERROR', text: 'No se pudo subir la imagen', type: 'error' });
            });
        },

        iniciales(nombres, apellidos) {
            return ((nombres||'').charAt(0) + (apellidos||'').charAt(0)).toUpperCase();
        },

        init_data(){
            axios.get(this.$url+'/obtener_usuario_admin/'+this.id,{
                headers: {
                    'Content-Type': 'application/json',
                     'Authorization' : this.$store.state.token
                }
            }).then((result)=>{
                if(result.data == ""){
                    this.data = false;
                }else{
                    this.data = true;
                    this.colaborador = result.data;
                }
            }).catch((error)=>{
            });
        },

        validar(){
            if(!this.colaborador.nombres){
                this.$notify({
                    group: 'foo',
                    title: 'ERROR',
                    text: 'Ingrese los nombres',
                    type: 'error'
                });
            }else if(!this.colaborador.apellidos){
                this.$notify({
                    group: 'foo',
                    title: 'ERROR',
                    text: 'Ingrese los apellidos',
                    type: 'error'
                });
            }else if(!this.colaborador.email){
                this.$notify({
                    group: 'foo',
                    title: 'ERROR',
                    text: 'Ingrese los email',
                    type: 'error'
                });
            }else if(!this.colaborador.rol){
                this.$notify({
                    group: 'foo',
                    title: 'ERROR',
                    text: 'Ingrese los cargo',
                    type: 'error'
                });
            }else{
                this.actualizar_colaborador();
            }
        },

        validar_password(){
            const pass1 = this.nueva_password.trim();
            const pass2 = this.confirmar_password.trim();
            if (!pass1) {
                this.$notify({ group: 'foo', title: 'ERROR', text: 'Ingrese la nueva contraseña', type: 'error' });
            } else if (pass1.length < 6) {
                this.$notify({ group: 'foo', title: 'ERROR', text: 'La contraseña debe tener al menos 6 caracteres', type: 'error' });
            } else if (pass1 !== pass2) {
                this.$notify({ group: 'foo', title: 'ERROR', text: 'Las contraseñas no coinciden', type: 'error' });
            } else {
                this.cambiar_password();
            }
        },

        cambiar_password(){
            axios.put(this.$url+'/cambiar_password_usuario_admin/'+this.id, { password: this.nueva_password.trim() }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.$store.state.token
                }
            }).then(() => {
                this.$notify({ group: 'foo', title: 'SUCCESS', text: 'Contraseña actualizada correctamente', type: 'success' });
                this.nueva_password = '';
                this.confirmar_password = '';
            }).catch((error) => {
                this.$notify({ group: 'foo', title: 'ERROR', text: 'No se pudo cambiar la contraseña', type: 'error' });
            });
        },

        actualizar_colaborador(){
            axios.put(this.$url+'/actualizar_usuario_admin/'+this.id,this.colaborador,{
                headers: {
                     'Content-Type': 'application/json',
                     'Authorization' : this.$store.state.token
                }
            }).then((result)=>{
                this.$notify({
                    group: 'foo',
                    title: 'SUCCESS',
                    text: 'Se actualizó el colaborador',
                    type: 'success'
                });

                this.$router.push({name: 'colaborador-index'});
            }).catch((error)=>{
            });
        }
    },
    
    mounted() {
    },

    beforeMount() {
        this.init_data();
    },

    components: {
        Sidebar,
        TopNav,
        ErrorNotFound
    },


}
</script>
