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
                  <router-link to="/colaborador" style="color:#868e96;text-decoration:none;">Colaboradores</router-link>
                  <span style="color:#ced4da;margin:0 6px;">/</span>
                  <span style="background:#3b5bdb;color:#fff;border-radius:20px;padding:2px 12px;font-weight:600;">👤 Nuevo colaborador</span>
              </nav>
          </div>
          <div class="container-fluid py-4">
              <div class="row justify-content-center">
              <div class="col-12 col-lg-8 col-xl-6">

                  <!-- Header -->
                  <div class="d-flex align-items-center justify-content-between mb-4">
                      <div>
                          <p class="text-muted mb-1" style="font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase">Colaboradores</p>
                          <h2 class="mb-0" style="font-weight:700">Nuevo colaborador</h2>
                      </div>
                      <router-link to="/colaborador" class="btn btn-sm" style="border-radius:8px;border:1px solid #dee2e6;font-weight:600;font-size:13px;padding:8px 16px;color:#495057">
                          <i class="fe fe-arrow-left me-1"></i> Volver
                      </router-link>
                  </div>

                  <!-- Card -->
                  <div class="card border-0 shadow-sm" style="border-radius:16px;overflow:hidden">

                      <!-- Card header con icono -->
                      <div class="px-4 pt-4 pb-3" style="background:linear-gradient(135deg,#3b5bdb 0%,#4c6ef5 100%)">
                          <div class="d-flex align-items-center gap-3">
                              <div class="rounded-circle d-flex align-items-center justify-content-center" style="width:52px;height:52px;background:rgba(255,255,255,0.2)">
                                  <i class="fe fe-user-plus" style="font-size:22px;color:#fff"></i>
                              </div>
                              <div>
                                  <h5 class="mb-0 text-white" style="font-weight:700">Datos del colaborador</h5>
                                  <p class="mb-0" style="font-size:13px;color:rgba(255,255,255,0.75)">La contraseña inicial será <strong style="color:#fff">123456</strong></p>
                              </div>
                          </div>
                      </div>

                      <!-- Formulario -->
                      <div class="card-body p-4">
                          <div class="row g-3">

                              <div class="col-12 col-md-6">
                                  <label class="form-label fw-semibold" style="font-size:13px">Nombres <span class="text-danger">*</span></label>
                                  <input type="text" class="form-control" style="border-radius:8px;border:1.5px solid #e9ecef;padding:10px 14px;font-size:14px" v-model="colaborador.nombres" placeholder="Ej: Juan Carlos">
                              </div>

                              <div class="col-12 col-md-6">
                                  <label class="form-label fw-semibold" style="font-size:13px">Apellidos <span class="text-danger">*</span></label>
                                  <input type="text" class="form-control" style="border-radius:8px;border:1.5px solid #e9ecef;padding:10px 14px;font-size:14px" v-model="colaborador.apellidos" placeholder="Ej: Pérez Gómez">
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
                                      <option value="" disabled selected>Seleccionar cargo...</option>
                                      <option value="Administrador">Administrador</option>
                                      <option value="Vendedor">Vendedor</option>
                                      <option value="Inventariado">Inventariado</option>
                                  </select>
                              </div>

                          </div>
                      </div>

                      <!-- Footer -->
                      <div class="card-footer bg-white border-top d-flex align-items-center justify-content-between px-4 py-3">
                          <p class="mb-0 text-muted" style="font-size:12px"><span class="text-danger">*</span> Campos obligatorios</p>
                          <button type="button" class="btn btn-primary" style="border-radius:8px;font-weight:600;padding:10px 28px" v-on:click="validar()">
                              <i class="fe fe-check me-2"></i>Crear colaborador
                          </button>
                      </div>

                  </div>

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
import axios from 'axios';

export default {
  name: 'CreateColaboradorApp',

  data() {
      return {
          colaborador : {
              rol: ''
          },
      }
  },

  methods: {
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
              this.crear_colaborador();
          }
      },

      crear_colaborador(){
          axios.post(this.$url+'/registro_usuario_admin',this.colaborador,{
              headers: {
                   'Content-Type': 'application/json',
                   'Authorization' : this.$store.state.token
              }
          }).then((result)=>{
              if (result.data.data == undefined) {
                    this.$notify({
                    group: 'foo',
                    title: 'ERROR',
                    text: result.data.message,
                    type: 'error'
                 });
              }else {
                    this.$notify({
                    group: 'foo',
                    title: 'SUCCESS',
                    text: 'Se registro el nuevo colaborador',
                    type: 'success'
                });

                this.$router.push({name: 'colaborador-index'});
              }
          }).catch((error)=>{
          });
      }
  },
  
  mounted() {
      
  },

  components: {
      Sidebar,
      TopNav
  },


}
</script>
