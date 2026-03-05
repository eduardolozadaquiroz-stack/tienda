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
                      <span style="color:#868e96;">Control</span>
                      <span style="color:#ced4da;margin:0 6px;">/</span>
                      <span style="background:#e67700;color:#fff;border-radius:20px;padding:2px 12px;font-weight:600;">📦 Ingresos</span>
                  </nav>
              </div>

              <div class="container-fluid">
                  <div class="row justify-content-center">
                      <div class="col-12 col-lg-10 col-xl-8">
  
                          <!-- Header -->
                          <div class="header mt-md-5">
                              <div class="header-body">
                                  <div class="row align-items-center">
                                  <div class="col">
  
                                      <!-- Pretitle -->
                                      <h6 class="header-pretitle">
                                      Ingreso 
                                      </h6>
  
                                      <!-- Title -->
                                      <h1 class="header-title">
                                          <b>Ingresos</b>
                                      </h1>
  
                                  </div>
                                  </div> <!-- / .row -->
                                  <div class="row align-items-center">
                                  <div class="col">
  
                                      <!-- Navegación en píldoras -->
                                      <div class="d-flex gap-2 mt-2 flex-wrap">
                                          <span style="background:#e67700;color:#fff;border-radius:20px;padding:5px 18px;font-size:14px;font-weight:600;cursor:default;">📦 Ingresos</span>
                                          <router-link to="/ingreso/create" style="background:#f1f3f5;color:#495057;border-radius:20px;padding:5px 18px;font-size:14px;font-weight:500;text-decoration:none;border:1px solid #dee2e6;">➕ Nuevo ingreso</router-link>
                                      </div>
  
                                  </div>
                                  </div>
                              </div>
                          </div>
  
                          <!-- GUÍA DE USO -->
                          <div class="alert mb-4" style="background:linear-gradient(135deg,#fff3bf,#ffec99);border:1px solid #fcc419;border-radius:12px;padding:16px 20px;">
                              <div class="d-flex align-items-start gap-3">
                                  <div style="font-size:26px;line-height:1.2">📦</div>
                                  <div>
                                      <h5 class="mb-1" style="color:#7d5a00;font-weight:700">¿Qué es un Ingreso?</h5>
                                      <p class="mb-1" style="color:#495057;font-size:14px">
                                          Un ingreso registra <b>mercancía recibida de un proveedor</b> y la suma automáticamente al inventario.
                                          Para buscar ingresos, <b>selecciona un rango de fechas</b> y pulsa Buscar.
                                      </p>
                                      <div class="d-flex flex-wrap gap-2 mt-1">
                                          <span style="background:#fff;border:1px solid #fcc419;border-radius:8px;padding:3px 10px;font-size:13px;color:#7d5a00;">📅 Selecciona fecha inicio y fecha fin</span>
                                          <span style="background:#fff;border:1px solid #fcc419;border-radius:8px;padding:3px 10px;font-size:13px;color:#7d5a00;">🔍 Pulsa Buscar para ver resultados</span>
                                          <span style="background:#fff;border:1px solid #fcc419;border-radius:8px;padding:3px 10px;font-size:13px;color:#7d5a00;">➕ Usa "Nuevo ingreso" para registrar mercancía</span>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <div class="row mb-4">
                              <div class="col-12">
                                  <small class="text-muted d-block mb-1" style="font-weight:600;"><i class="fe fe-calendar me-1"></i> Selecciona el rango de fechas para buscar ingresos:</small>
                              </div>
                          </div>
                          <div class="row mb-5">
                              <div class="col-9 d-flex">
                                  <div class="me-3 w-50">
                                      <label class="form-label" style="font-size:12px;font-weight:600;color:#495057;">📅 Desde</label>
                                      <input type="date" class="form-control" v-model="inicio"/>
                                  </div>
                                  <div class="w-50">
                                      <label class="form-label" style="font-size:12px;font-weight:600;color:#495057;">📅 Hasta</label>
                                      <input type="date" class="form-control" v-model="hasta"/>
                                  </div>
                              </div>
                              <div class="col d-flex align-items-end">
                                  <button class="btn btn-primary" style="width:100%" v-on:click="init_data()"><i class="fe fe-search me-1"></i> Buscar</button>
                              </div>
                          </div>
  
                          <div class="card">
                              <div class="card-header">
  
                                  <!-- Title -->
                                  <h4 class="card-header-title mb-0">
                                      <b>Ingreso a inventario</b>
                                  </h4>
  
                              </div>
                              <div class="table-responsive">
                                  <table class="table table-sm table-nowrap card-table">
                                  <thead>
                                      <tr>
                                          <th>Proveedor</th>
                                          <th>Serie</th>
                                          <th>Monto</th>
                                          <th>Documento</th>
                                          <th>*</th>
                                      </tr>
                                  </thead>
                                  <tbody class="fs-base" v-if="ingresos.length >= 1">
                                      <tr v-for="item in ingresos">
                                          <td>
                                              <a>{{item.proveedor}}</a>
                                          </td>
                                          <td>
                                              <a>#{{item.serie.toString().padStart(6,'000000')}}</a>
                                          </td>
                                          <td>
                                              {{convertCurrency(item.monto_resultante)}}
                                          </td>
                                          <td>
                                              <a :href="$url+'/obtener_comprobante_ingreso/'+item.documento" target="_blank">
                                                  <span class="badge bg-success">Abrir documento</span>
                                              </a>
                                          </td>
                                          <td>
                                            <button class="btn btn-primary btn-sm">
                                                <router-link style="color: #ffffff !important;" :to="{name: 'ingreso-detalle',params:{id:item._id}}">Ver detalles</router-link>
                                            </button>
                                            
                                          </td>
                                      </tr>
                                      
                                  </tbody>
                                  <tbody v-if="ingresos.length == 0">
                                      <tr>
                                          <td colspan="4">
                                              <div class="row justify-content-center">
                                                      <div class="col-12 col-md-6 col-xl-6 my-5">
                                                          
                                                          <div class="text-center">
                                                          
                                                          <!-- Preheading -->
                                                          <h6 class="text-uppercase text-muted mb-4">
                                                              404 error
                                                          </h6>
  
                                                          <!-- Heading -->
                                                          <h1 class="display-4 mb-3">
                                                              No se encontraron registros 😭
                                                          </h1>
  
                                                          <!-- Subheading -->
                                                          <p class="text-muted mb-4">
                                                              No hay datos que mostrar!
                                                          </p>
  
                                                  
                                                          
                                                          </div>
  
                                                      </div>
                                                  </div>  
                                          </td>
                                      </tr>
                                  </tbody>
                                  </table>
                              </div>
                          </div>
                          
                          
  
                      </div>
                  </div> <!-- / .row -->
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
    name: 'IndexIngresoApp',
    data() {
      return {
          inicio: '',
          hasta: '',
          ingresos: []
      }
    },
  
    methods: {
      init_data(){
          if(!this.inicio){
               this.$notify({
                  group: 'foo',
                  title: 'ERROR',
                  text: 'Ingrese la fecha de inicio',
                  type: 'error'
              });
          }else if(!this.hasta){
              this.$notify({
                  group: 'foo',
                  title: 'ERROR',
                  text: 'Ingrese la segunda fecha',
                  type: 'error'
              });
          }else{
              axios.get(this.$url+'/obtener_ingresos_admin/'+this.inicio+'/'+this.hasta,{
                  headers:{
                          'Content-Type': 'application/json',
                          'Authorization': this.$store.state.token,
                  }
              }).then((result)=>{
                  this.ingresos = result.data;
              });
          }
      },
      convertCurrency(number){
            const n = parseFloat(number) || 0;
            return '$ ' + n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MXN';
        }
    },
    components: {
      Sidebar,
      TopNav
    }
  }
  </script>
  