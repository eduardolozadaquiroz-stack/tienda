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
                      <router-link to="/ingreso" style="color:#868e96;text-decoration:none;">Ingresos</router-link>
                      <span style="color:#ced4da;margin:0 6px;">/</span>
                      <span style="background:#e67700;color:#fff;border-radius:20px;padding:2px 12px;font-weight:600;">➕ Nuevo ingreso</span>
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
                                          <b>Nuevo ingreso</b>
                                      </h1>
  
                                  </div>
                                  </div> <!-- / .row -->
                                  <div class="row align-items-center">
                                  <div class="col">
  
                                      <!-- Navegación en píldoras -->
                                      <div class="d-flex gap-2 mt-2 flex-wrap">
                                          <router-link to="/ingreso" style="background:#f1f3f5;color:#495057;border-radius:20px;padding:5px 18px;font-size:14px;font-weight:500;text-decoration:none;border:1px solid #dee2e6;">← Ingresos</router-link>
                                          <span style="background:#e67700;color:#fff;border-radius:20px;padding:5px 18px;font-size:14px;font-weight:600;cursor:default;">➕ Nuevo ingreso</span>
                                      </div>
  
                                  </div>
                                  </div>
                              </div>
                          </div>
  
                          <!-- GUÍA DE PASOS -->
                          <div class="card mb-4" style="background:linear-gradient(135deg,#fff3bf,#ffec99);border:1px solid #fcc419;border-radius:12px;">
                              <div class="card-body py-3">
                                  <h6 class="mb-3" style="color:#7d5a00;font-weight:700;">📋 ¿Cómo registrar un ingreso? Sigue estos pasos:</h6>
                                  <div class="d-flex flex-wrap gap-3">
                                      <div style="background:#fff;border:1px solid #fcc419;border-radius:10px;padding:8px 14px;min-width:170px;">
                                          <div style="font-size:20px;">1️⃣</div>
                                          <div style="font-size:13px;color:#7d5a00;font-weight:600;">Datos del proveedor</div>
                                          <div style="font-size:12px;color:#868e96;">Proveedor, Nº comprobante, monto y archivo</div>
                                      </div>
                                      <div style="background:#fff;border:1px solid #fcc419;border-radius:10px;padding:8px 14px;min-width:170px;">
                                          <div style="font-size:20px;">2️⃣</div>
                                          <div style="font-size:13px;color:#7d5a00;font-weight:600;">Agrega los productos</div>
                                          <div style="font-size:12px;color:#868e96;">Selecciona producto, variedad, precio y cantidad</div>
                                      </div>
                                      <div style="background:#fff;border:1px solid #fcc419;border-radius:10px;padding:8px 14px;min-width:170px;">
                                          <div style="font-size:20px;">3️⃣</div>
                                          <div style="font-size:13px;color:#7d5a00;font-weight:600;">Pulsa "Agregar"</div>
                                          <div style="font-size:12px;color:#868e96;">Cada producto se suma a la tabla</div>
                                      </div>
                                      <div style="background:#fff;border:1px solid #fcc419;border-radius:10px;padding:8px 14px;min-width:170px;">
                                          <div style="font-size:20px;">4️⃣</div>
                                          <div style="font-size:13px;color:#7d5a00;font-weight:600;">Guarda con "Ingresar datos"</div>
                                          <div style="font-size:12px;color:#868e96;">El stock se actualiza automáticamente</div>
                                      </div>
                                  </div>
                                  <p class="mb-0 mt-2" style="font-size:12px;color:#c92a2a;font-weight:600;">⚠️ No podrás guardar si falta algún dato del proveedor o si no has agregado al menos un producto.</p>
                              </div>
                          </div>

                          <div class="row">
                              <div class="col-12 col-md-6">

                              <!-- Last name -->
                              <div class="form-group">

                                  <!-- Label -->
                                  <label class="form-label">
                                      Proveedor <span style="color:#c92a2a;font-weight:700;">*</span>
                                  </label>
                                  <small class="form-text text-muted">
                                      Selecciona la empresa que entregó la mercancía.
                                  </small>
                                  <!-- Input -->
                                  <input type="text" class="form-control mb-3" placeholder="Ej: Proveedor Propio / Mayorista XYZ" v-model="ingreso.proveedor">
  
                              </div>
  
                              </div>
  
                              <div class="col-12 col-md-6">
  
                              <!-- Last name -->
                              <div class="form-group">
  
                                  <!-- Label -->
                                  <label class="form-label">
                                      N° comprobante <span style="color:#c92a2a;font-weight:700;">*</span>
                                  </label>
                                  <small class="form-text text-muted">
                                      Número de la factura o comprobante de compra (ej: FAC-000154).
                                  </small>
                                  <!-- Input -->
                                      <input type="text" class="form-control" placeholder="5DSF-000154" v-model="ingreso.ncomprobante">
  
                              </div>
  
                              </div>
  
                              <div class="col-12 col-md-6">
  
                              <!-- Last name -->
                              <div class="form-group">
  
                                  <!-- Label -->
                                  <label class="form-label">
                                      Monto total <span style="color:#c92a2a;font-weight:700;">*</span>
                                  </label>
                                  <small class="form-text text-muted">
                                      Monto total pagado al proveedor (en pesos). Ej: 1500.00
                                  </small>
                                  <!-- Input -->
                                      <input type="text" class="form-control" placeholder="546" v-model="ingreso.monto_total">
  
                              </div>
  
                              </div>
  
                              <div class="col-12 col-md-6">
  
                              <!-- Last name -->
                              <div class="form-group">
  
                                  <!-- Label -->
                                  <label class="form-label">
                                      Comprobante (archivo) <span style="color:#c92a2a;font-weight:700;">*</span>
                                  </label>
                                  <small class="form-text text-muted">
                                      Sube la factura o comprobante en PDF o imagen (máx 1MB).
                                  </small>
                                  <!-- Input -->
                                      <input type="file" class="form-control" v-on:change="uploadComprobante($event)">
  
                              </div>
  
                              </div>
                              </div>
  
                              <hr class="my-5">
  
                              <div class="row">
  
                              <div class="col-md-12 mb-2">
                                  <hr class="mt-0">
                                  <h3 class="mb-1"><b>Productos del ingreso</b></h3>
                                  <p class="text-muted mb-3" style="font-size:14px;">Agrega todos los productos recibidos. Para cada uno: selecciona el producto, la variedad, el precio que pagaste y la cantidad. Luego pulsa <b>Agregar</b>. Puedes agregar varios productos antes de guardar.</p>
                              </div>
  
                              <div class="col-12 col-md-6">
  
                              <!-- First name -->
                              <div class="form-group">
  
                                  <!-- Label -->
                                  <label class="form-label">
                                  Producto <span style="color:#c92a2a;font-weight:700;">*</span>
                                  </label>
                                  <small class="form-text text-muted">
                                      Selecciona el producto que recibiste del proveedor.
                                  </small>
                                  <!-- Input -->
                                   <select class="form-select" @change="onProductoChange($event)">
                                      <option value="" disabled selected>Selecciona un producto</option>
                                      <option v-for="p in productos" :key="p.value" :value="p.value">{{ p.text }}</option>
                                   </select>
  
                              </div>
  
                              </div>
  
                              <div class="col-12 col-md-6">
  
                              <!-- First name -->
                              <div class="form-group">
  
                                  <!-- Label -->
                                  <label class="form-label">
                                  Variedad <span style="color:#c92a2a;font-weight:700;">*</span>
                                  </label>
                                  <small class="form-text text-muted">
                                      Selecciona la variedad del producto (p.ej: talla, color, tipo). Se muestran las variedades activas con su stock actual.
                                  </small>
                                   <select class="form-select mb-3" v-model="detalle.variedad">
                                      <option value="" selected disabled>Seleccionar</option>
                                      <option :value="item._id" v-for="item in variedades">{{item.variedad.toUpperCase()}} - {{item.sku}} - {{item.stock}}</option>
                                  </select>
  
                              </div>
  
                              </div>
  
  
                              <div class="col-12 col-md-6">
  
                              <!-- Phone -->
                              <div class="form-group">
  
                                  <!-- Label -->
                                  <label class="form-label">
                                  Precio unidad <span style="color:#c92a2a;font-weight:700;">*</span>
                                  </label>
                                  <small class="form-text text-muted">
                                      ¿Cuánto pagaste por cada unidad al proveedor? (ej: 45.50)
                                  </small>
                                  <!-- Input -->
                                  <input type="text" class="form-control mb-3" placeholder="0.00" v-model="detalle.precio_unidad">
  
                              </div>
  
                              </div>
                              <div class="col-12 col-md-6">
  
                              <!-- Birthday -->
                              <div class="form-group">
  
                                  <!-- Label -->
                                  <label class="form-label">
                                  Cantidad total <span style="color:#c92a2a;font-weight:700;">*</span>
                                  </label>
                                  <small class="form-text text-muted">
                                      ¿Cuántas unidades recibiste? Esta cantidad se sumará al inventario.
                                  </small>
                                  <!-- Input -->
                                  <input type="number" class="form-control mb-3" placeholder="0" v-model="detalle.cantidad">
  
                              </div>
  
                              </div>
  
                              <div class="col-md-12">
                                  
                                  <button class="btn btn-primary" style="margin-bottom: 1.8rem!important;" v-on:click="agregar_detalle()">
                                      Agregar
                                  </button>
                              </div>
                              </div> <!-- / .row -->
  
                              <!-- Button -->
                              <div class="card ">
                              <div class="table-responsive mb-0">
                                  <table class="table table-sm table-nowrap card-table">
                                      <thead>
                                          <tr>
                                          <th>Producto</th>
                                          <th>Precio unidad</th>
                                          <th>Cantidad</th>
                                          <th>Subtotal</th>
                                          <th></th>
                                          </tr>
                                      </thead>
                                      <tbody class="fs-base" v-if="detalles.length >= 1">
                                          <tr v-for="(item,index) in detalles">
                                              <td>
                                                  <a href="invoice.html">{{item.titulo_producto}}</a>
                                              </td>
                                              <td>
                                                  <time datetime="2020-04-24">{{convertCurrency(item.precio_unidad)}}</time>
                                              </td>
                                              <td>
                                                  {{item.cantidad}}
                                              </td>
                                              <td>
                                                  {{convertCurrency(item.precio_unidad * item.cantidad)}}
                                                  <!--  -->
                                              </td>
                                              <td>
                                                  <button class="btn btn-danger btn-sm" v-on:click="quitarDetalle(index,item.precio_unidad*item.cantidad)">Quitar</button>
                                              </td>
                                          </tr>
                                          
                                      </tbody>
                                      <tbody  class="fs-base" v-if="detalles.length == 0">
                                          <tr>
                                              <td class="text-center" colspan="5">
                                                  <span class="text-muted">No hay detalles en el ingreso</span>
                                              </td>
                                          </tr>
                                      </tbody>
                                      <tfoot>
                                          <tr>
                                              <td colspan="4">Total</td>
                                              <td>{{convertCurrency(total)}}</td>
                                          </tr>
                                      </tfoot>
                                  </table>
                              </div>
                              </div>
  
                              <button class="btn btn-primary mb-7" v-on:click="registro_ingreso()">
                              Ingresar datos
                              </button>
                          
  
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
    name: 'CreateIngresoApp',
    data() {
        return {
            ingreso: {
                proveedor: ''
            },
            detalle: {
                variedad: ''
            },
            detalles: [],
            
  
            comprobante: undefined,
            producto: {},
            productos: [],
            variedades: [],
            total: 0
        }
    },
    methods: {
        uploadComprobante($event){
  
              var image;
  
              if($event.target.files.length >= 1){
                  image = $event.target.files[0];
              }
    
              if(image.size <= 1000000){
                 if(image.type == 'image/jpeg'||image.type == 'image/png'||image.type == 'image/webp'||image.type == 'image/jpg'|| image.type === 'application/pdf'){
                      this.comprobante = image;
                      this.ingreso.documento = this.comprobante;
                 }else{
                     this.$notify({
                          group: 'foo',
                          title: 'ERROR',
                          text: 'El recurso debe ser imagen.',
                          type: 'error'
                      });
                      this.ingreso.documento = undefined;
                      this.comprobante = undefined;
                 }
              }else{
                  this.$notify({
                      group: 'foo',
                      title: 'ERROR',
                      text: 'La imagen debe pesar menos de 1MB',
                      type: 'error'
                  });
                   this.ingreso.documento = undefined;
                  this.comprobante = undefined;
              }
        },
  
        init_productos(){
            this.productos = [];
            axios.get(this.$url+'/listar_activos_productos_admin',{
                headers:{
                      'Content-Type': 'application/json',
                      'Authorization': this.$store.state.token,
                }
            }).then((result)=>{
                for(var item of result.data){
                    this.productos.push({
                        value: item._id,
                        text: item.titulo
                    });
  
                }
            });
        },
  
        onProductoChange(event) {
            const item = this.productos.find(p => p.value === event.target.value);
            if (item) this.producto_selected(item);
        },
        producto_selected(item){
            this.producto = item;
            this.init_variedades(item.value);
            this.detalle.producto = item.value;
            this.detalle.titulo_producto = item.text;
        },
  
        init_variedades(id){
            axios.get(this.$url+'/obtener_variedades_producto/'+id,{
                headers:{
                     'Content-Type': 'application/json',
                    'Authorization' : this.$store.state.token
                }
            }).then((result)=>{
                this.variedades = result.data;
            });
        },
  
        agregar_detalle(){
            if(!this.detalle.producto){
                 this.$notify({
                      group: 'foo',
                      title: 'ERROR',
                      text: 'Seleccione el producto',
                      type: 'error'
                  });
            }else if(!this.detalle.variedad){
                 this.$notify({
                      group: 'foo',
                      title: 'ERROR',
                      text: 'Seleccione la variedad',
                      type: 'error'
                  });
            }else if(!this.detalle.precio_unidad){
                 this.$notify({
                      group: 'foo',
                      title: 'ERROR',
                      text: 'Ingrese el precio por unidad',
                      type: 'error'
                  });
            }else if(!this.detalle.cantidad){
                 this.$notify({
                      group: 'foo',
                      title: 'ERROR',
                      text: 'Ingresar la cantidad a ingresar',
                      type: 'error'
                  });
            }else{
  
                  this.detalles.push(this.detalle);
  
                  let subtotal = this.detalle.precio_unidad * this.detalle.cantidad;
                  this.total = this.total + subtotal;
  
                  this.detalle = {
                      variedad: ''
                  }
                  this.producto = {};
            }
        },
        convertCurrency(number){
            const n = parseFloat(number) || 0;
            return '$ ' + n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MXN';
        },
        quitarDetalle(idx,subtotal){
            this.detalles.splice(idx,1);
            this.total = this.total - subtotal;
        },
        registro_ingreso(){
              if(!this.ingreso.proveedor){
                  this.$notify({
                      group: 'foo',
                      title: 'ERROR',
                      text: 'Seleccione el proveedor',
                      type: 'error'
                  });
              }else if(!this.ingreso.ncomprobante){
                  this.$notify({
                      group: 'foo',
                      title: 'ERROR',
                      text: 'Ingrese el número de comprobante',
                      type: 'error'
                  });
              }else if(!this.ingreso.monto_total){
                  this.$notify({
                      group: 'foo',
                      title: 'ERROR',
                      text: 'Ingrese el monto total',
                      type: 'error'
                  });
              }else if(!this.ingreso.documento){
                  this.$notify({
                      group: 'foo',
                      title: 'ERROR',
                      text: 'Suba el comprobante de ingreso',
                      type: 'error'
                  });
              }else{
  
                  var fm = new FormData();
                  fm.append('proveedor',this.ingreso.proveedor);
                  fm.append('ganancia',this.$ganancia);
                  fm.append('ncomprobante',this.ingreso.ncomprobante);
                  fm.append('monto_total',this.ingreso.monto_total);
                  fm.append('monto_resultante',this.total);
                  fm.append('documento',this.ingreso.documento);
                  fm.append('detalles',JSON.stringify(this.detalles));
  
                  axios.post(this.$url+'/registro_ingreso_admin',fm,{
                      headers: {
                          'Content-Type': 'multipart/form-data',
                          'Authorization' : this.$store.state.token
                      }
                  }).then((result)=>{
                      if(result.data.message){
                          this.$notify({
                              group: 'foo',
                              title: 'ERROR',
                              text: result.data.message,
                              type: 'error'
                          });
                      }else{
                          this.$notify({
                              group: 'foo',
                              title: 'Éxito',
                              text: 'Ingreso registrado correctamente. El stock y precio fueron actualizados.',
                              type: 'success'
                          });
                          setTimeout(()=>{ this.$router.push('/ingreso'); }, 1500);
                      }
                     
                  })
              }
        }
    },
    beforeMount() {
        this.init_productos();
        
    },
    components: {
      Sidebar,
      TopNav,
    }
  }
  </script>
  