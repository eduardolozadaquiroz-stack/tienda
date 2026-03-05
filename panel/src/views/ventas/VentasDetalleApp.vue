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
                      <router-link to="/ventas" style="color:#868e96;text-decoration:none;">Ventas</router-link>
                      <span style="color:#ced4da;margin:0 6px;">/</span>
                      <span style="background:#2b8a3e;color:#fff;border-radius:20px;padding:2px 12px;font-weight:600;">🔍 Detalle de venta</span>
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
                                      Ventas
                                      </h6>
  
                                      <!-- Title -->
                                      <h1 class="header-title">
                                          <b>Detalle de venta</b>
                                      </h1>
  
                                  </div>
                                  </div> <!-- / .row -->
                                  <div class="row align-items-center">
                                  <div class="col">
  
                                      <!-- Navegación en píldoras -->
                                      <div class="d-flex gap-2 mt-2 flex-wrap">
                                          <router-link to="/ventas" style="background:#f1f3f5;color:#495057;border-radius:20px;padding:5px 18px;font-size:14px;font-weight:500;text-decoration:none;border:1px solid #dee2e6;">← Volver a ventas</router-link>
                                          <span style="background:#2b8a3e;color:#fff;border-radius:20px;padding:5px 18px;font-size:14px;font-weight:600;cursor:default;">🔍 Detalle de venta</span>
                                      </div>
  
                                  </div>
                                  </div>
                              </div>
                          </div>
  
                              <div class="row">
                                  <!-- Info de estados -->
                                  <div class="col-12 mb-4">
                                      <div style="background:linear-gradient(135deg,#ebfbee,#d3f9d8);border:1px solid #8ce99a;border-radius:12px;padding:14px 18px;">
                                          <h6 class="mb-2" style="color:#1a5c2a;font-weight:700;"><i class="fe fe-info me-1"></i>Información del pedido</h6>
                                          <div class="d-flex flex-wrap gap-2">
                                              <span style="background:#fff3bf;color:#7d5a00;border:1px solid #fcc419;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:600;">🟡 PENDIENTE = esperando proceso</span>
                                              <span style="background:#ebfbee;color:#1a5c2a;border:1px solid #8ce99a;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:600;">🟢 COMPLETADO = entregado al cliente</span>
                                              <span style="background:#fff5f5;color:#c92a2a;border:1px solid #ffc9c9;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:600;">🔴 CANCELADO = no se procesó</span>
                                          </div>
                                      </div>
                                  </div>
                                  <div class="col-12 col-md-6">
                                  <div class="card">
                                  <div class="card-body">
  
                                  <!-- List group -->
                                  <div class="list-group list-group-flush my-n3">
                                  <div class="list-group-item">
                                      <div class="row align-items-center">
                                      <div class="col">
  
                                          <!-- Title -->
                                          <h5 class="mb-0">
                                           Serie
                                          </h5>
  
                                      </div>
                                      <div class="col-auto">
  
                                          <!-- Time -->
                                          <time class="small text-muted" datetime="1988-10-24" v-if="venta.serie">
                                              {{venta.serie.toString().padStart(6,'000000')}}
                                          </time>
  
                                      </div>
                                      </div> <!-- / .row -->
                                  </div>
                                  <div class="list-group-item">
                                      <div class="row align-items-center">
                                      <div class="col">
  
                                          <!-- Title -->
                                          <h5 class="mb-0">
                                           Trasaccion
                                          </h5>
  
                                      </div>
                                      <div class="col-auto">
  
                                          <!-- Time -->
                                          <time class="small text-muted" datetime="2018-10-28">
                                              {{venta.transaccion}}
                                          </time>
  
                                      </div>
                                      </div> <!-- / .row -->
                                  </div>
                                  <div class="list-group-item">
                                      <div class="row align-items-center">
                                      <div class="col">
  
                                          <!-- Title -->
                                          <h5 class="mb-0">
                                              Cliente
                                          </h5>
  
                                      </div>
                                      <div class="col-auto">
  
                                          <!-- Text -->
                                          <small class="text-muted" v-if="venta.cliente">
                                              {{venta.cliente.nombres}}
                                          </small>
  
                                      </div>
                                      </div> <!-- / .row -->
                                  </div>
                            
                                  </div>
  
                                  </div>
                                  </div>
                                  </div>
                                  <div class="col-12 col-md-6">
                                  <div class="card">
                                  <div class="card-body">
  
                                      <!-- List group -->
                                      <div class="list-group list-group-flush my-n3">
                                      <div class="list-group-item">
                                          <div class="row align-items-center">
                                          <div class="col">
  
                                              <!-- Title -->
                                              <h5 class="mb-0">
                                              Subtotal
                                              </h5>
  
                                          </div>
                                          <div class="col-auto">
  
                                              <!-- Time -->
                                              <time class="small text-muted" datetime="1988-10-24">
                                                  {{convertCurrency(venta.total)}}
                                              </time>
  
                                          </div>
                                          </div> <!-- / .row -->
                                      </div>
                                      <div class="list-group-item">
                                          <div class="row align-items-center">
                                          <div class="col">
  
                                              <!-- Title -->
                                              <h5 class="mb-0">
                                              Envio
                                              </h5>
  
                                          </div>
                                          <div class="col-auto">
  
                                              <!-- Time -->
                                              <time class="small text-muted" datetime="2018-10-28">
                                              {{convertCurrency(venta.envio)}}
                                              </time>
  
                                          </div>
                                          </div> <!-- / .row -->
                                      </div>
   
                                      <div class="list-group-item">
                                          <div class="row align-items-center">
                                          <div class="col">
  
                                              <!-- Title -->
                                              <h5 class="mb-0">
                                              Fecha
                                              </h5>
  
                                          </div>
                                          <div class="col-auto">
  
                                              <!-- Link -->
                                              <a class="small">
                                                  {{convertDate(venta.createdAt)}}
                                              </a>
  
                                          </div>
                                          </div> <!-- / .row -->
                                      </div>
                                      </div>
  
                                  </div>
                                  </div>
                                  </div>
                                  </div>
  
                                  <div class="card">
                                      <div class="card-header">
  
                                          <!-- Title -->
                                          <h4 class="card-header-title mb-0">
                                              <b>Productos</b>
                                          </h4>
  
                                      </div>
                                      <div class="table-responsive">
                                          <table class="table table-sm table-nowrap card-table">
                                          <thead>
                                              <tr>
                                              <th>Producto</th>
                                              <th>Precio Un.</th>
                                              <th>Cantidad</th>
                                              <th>Subtotal</th>
                                              </tr>
                                          </thead>
                                          <tbody class="fs-base">
                                              <tr v-for="item in detalles">
                                                  <td class="products-product">
                                                      <div class="d-flex align-items-center">
  
                                                          <!-- Image -->
                                                          <div class="avatar">
                                                          <img class="avatar-img rounded me-3" :src="$url+'/obtener_portada_producto/'+item.producto.portada" alt="...">
                                                          </div>
  
                                                          <div class="ms-3">
  
                                                          <!-- Heading -->
                                                          <h4 class="fw-normal mb-1">{{item.producto.titulo.substr(0,25)}}</h4>
  
                                                          <!-- Text -->
                                                          <small class="text-muted">{{item.variedad.variedad}}</small>
  
                                                          </div>
  
                                                      </div>
                                                  </td>
                                                  <td>
                                                      {{convertCurrency(item.precio_unidad)}}
                                                  </td>
                                                  <td>
                                                      {{item.cantidad}}
                                                  </td>
                                                  <td>
                                                     {{convertCurrency(item.subtotal)}}
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
  import moment from 'moment';
  
  export default {
    name: 'VentasDetalleApp',
    data() {
      return {
          venta: {},
          detalles: []
      }
    },
    beforeMount() {
      this.init_data();
    },
    methods: {
      init_data(){
          axios.get(this.$url+'/obtener_detalles_venta_admin/'+this.$route.params.id,{
              headers:{
                  'Content-Type': 'application/json',
                  'Authorization': this.$store.state.token,
              }
          }).then((result)=>{
             this.venta = result.data.venta;
             this.detalles = result.data.detalles;
          });
      },
       convertCurrency(number){
            const n = parseFloat(number) || 0;
            return '$ ' + n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MXN';
        },
        convertDate(item){
          return moment(item).format('YYYY/MM/DD');
        },
    },
    components: {
      Sidebar,
      TopNav
    }
  }
  </script>
  