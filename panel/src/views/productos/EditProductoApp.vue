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
                      <router-link to="/producto" style="color:#868e96;text-decoration:none;">Productos</router-link>
                      <span style="color:#ced4da;margin:0 6px;">/</span>
                      <span style="background:#1864ab;color:#fff;border-radius:20px;padding:2px 12px;font-weight:600;">✏️ Editar producto</span>
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
                                      Productos
                                      </h6>
  
                                      <!-- Title -->
                                      <h1 class="header-title">
                                      Editar producto
                                      </h1>
  
                                  </div>
                                  </div> <!-- / .row -->
                                  <div class="row align-items-center">
                                  <div class="col">
  
                                      <!-- Navegación en píldoras -->
                                      <div class="d-flex gap-2 mt-2 flex-wrap">
                                          <router-link to="/producto" style="background:#f1f3f5;color:#495057;border-radius:20px;padding:5px 18px;font-size:14px;font-weight:500;text-decoration:none;border:1px solid #dee2e6;">← Todos los productos</router-link>
                                          <span style="background:#1864ab;color:#fff;border-radius:20px;padding:5px 18px;font-size:14px;font-weight:600;cursor:default;">✏️ Editar producto</span>
                                      </div>
  
                                  </div>
                                  </div>
                              </div>
                          </div>
  
                          <div class="mb-7">
  
                              <div class="row justify-content-between align-items-center">
                                  <div class="col">
                                  <div class="row align-items-center">
                                      <div class="col-auto">
  
                                      <!-- Avatar -->
                                      <div class="avatar">
                                          <img class="avatar-img rounded-circle" :src="str_image" alt="...">
                                      </div>
  
                                      </div>
                                      <div class="col ms-n2">
  
                                      <!-- Heading -->
                                      <h4 class="mb-1">
                                          <b>Portada</b>
                                      </h4>
  
                                      <!-- Text -->
                                      <small class="text-muted">
                                          PNG o JPG no más grande que 1000px de ancho y alto.
                                      </small>
  
                                      </div>
                                  </div> <!-- / .row -->
                                  </div>
                                  <div class="col-auto">
  
                                  <!-- Button -->
                                  
                                  <label for="file-upload" class="btn btn-sm btn-primary">
                                      Upload
                                  </label>
                                  <input style="display:none" id="file-upload" type="file" v-on:change="uploadImage($event)"/>
  
                                  </div>
                              </div> <!-- / .row -->
  
                              <!-- Divider -->
                              <hr class="my-5">
  
                              <div class="row">
                                  <div class="col-12 col-md-12">
  
                                  <!-- Email address -->
                                  <div class="form-group">
  
                                      <!-- Label -->
                                      <label class="mb-1">
                                      Título del producto
                                      </label>
  
                                      <!-- Form text -->
                                      <small class="form-text text-muted">
                                      Este título se mostrará a otros públicamente, así que elíjalo con cuidado.
                                      </small>
  
                                      <!-- Input -->
                                      <input type="text" class="form-control" placeholder="Título del producto" v-model="producto.titulo">
  
                                  </div>
  
                                  </div>
  
                                  <div class="col-12 col-md-6">
  
                                    <!-- First name -->
                                    <div class="form-group">

                                        <!-- Label -->
                                        <label class="form-label">
                                        Categoria
                                        </label>

                                        <small class="form-text text-muted">
                                        Este título se mostrará a otros públicamente, así que elíjalo con cuidado.
                                        </small>

                                        <!-- Input -->
                                        <select name="" class="form-select" v-model="producto.categoria" v-on:change="getSubcategorias($event)">
                                            <option value="" disabled selected>Seleccionar</option>
                                            <option :value="item.categoria.titulo" v-for="item in categorias">{{item.categoria.titulo}}</option>
                                        </select>

                                    </div>

                                    </div>


                                    <div class="col-12 col-md-6">

                                    <!-- First name -->
                                    <div class="form-group">

                                        <!-- Label -->
                                        <label class="form-label">
                                        Subcategoria
                                        </label>

                                        <small class="form-text text-muted">
                                        Este título se mostrará a otros públicamente, así que elíjalo con cuidado.
                                        </small>

                                        <!-- Input -->
                                        <select name="" class="form-select" v-model="producto.subcategoria">
                                            <option value="" disabled selected>Seleccionar</option>
                                            <option :value="item.titulo" v-for="item in subcategorias">{{item.titulo}}</option>
                                        </select>

                                    </div>

                                    </div>
  
                                  <div class="col-12 col-md-6">
  
                                  <!-- Last name -->
                                  <div class="form-group">
  
                                      <!-- Label -->
                                      <label class="form-label">
                                      Tallas actuales
                                      </label>
                                      <small class="form-text text-muted d-block mb-2">Referencia visual de tallas registradas en este producto.</small>
                                      <div class="d-flex flex-wrap gap-1">
                                          <span v-for="v in variedades" :key="v._id" style="background:#111;color:#fff;border-radius:6px;padding:3px 12px;font-size:12px;font-weight:700;">{{v.variedad.toUpperCase()}}</span>
                                          <span v-if="!variedades.length" class="text-muted" style="font-size:13px;">Sin tallas aún</span>
                                      </div>
  
                                  </div>
  
                                  </div>
  
                                  <div class="col-12 col-md-6">
  
                                  <!-- Last name -->
                                  <div class="form-group">
  
                                      <!-- Label -->
                                      <label class="form-label">
                                      Precio <span style="color:#c92a2a;font-weight:700;">*</span>
                                      </label>
                                      <small class="form-text text-muted d-block mb-1">Ingresa el precio de venta del producto en MXN.</small>
  
                                      <!-- Input -->
                                      <input type="number" class="form-control" placeholder="Ej: 350" v-model="producto.precio">
  
                                  </div>
  
                                  </div>
                                  
                                  <div class="col-12 col-md-12">
  
                                  <!-- Phone -->
                                  <div class="form-group">
  
                                      <!-- Label -->
                                      <label class="form-label">
                                      DESCRIPCIÓN
                                      </label>
  
                                      <!-- Input -->
                                      <textarea class="form-control" id=""  rows="3" placeholder="Extracto" v-model="producto.extracto"></textarea>
  
                                  </div>
  
                                  </div>
                                  
                              </div> <!-- / .row -->
  
                              
  
                              <div class="row">
                                  <div class="col-12 col-md-6">
  
                                  <!-- Public profile -->
                                  <div class="form-group">
  
                                      <!-- Label -->
                                      <label class="mb-1">
                                      Producto publicado
                                      </label>
  
                                      <!-- Form text -->
                                      <small class="form-text text-muted">
                                      Hacer público tu producto significa que cualquier persona en la red podrá encontrarlo.
                                      </small>
  
                                      <div class="row">
                                      <div class="col-auto">
  
                                          <!-- Switch -->
                                          <div class="form-check form-switch">
                                          <input class="form-check-input" type="checkbox" id="switchOne" v-model="producto.estado" />
                                          <label class="form-check-label" for="switchOne"></label>
                                          </div>
  
                                      </div>
                                      <div class="col ms-n2">
  
                                          <!-- Help text -->
                                          <small class="text-muted">
                                          Borrador activado
                                          </small>
  
                                      </div>
                                      </div> <!-- / .row -->
                                  </div>
  
                                  </div>
                                  <div class="col-12 col-md-6">
  
                                  <!-- Allow for additional Bookings -->
                                  <div class="form-group">
  
                                      <!-- Label -->
                                      <label class="mb-1">
                                      En descuento
                                      </label>
  
                                      <!-- Form text -->
                                      <small class="form-text text-muted">
                                      Si está disponible para hacer un descuento fuera de la situación actual, puede alentar a otros compren el producto
                                      </small>
  
                                      <div class="row">
                                      <div class="col-auto">
  
                                          <!-- Switch -->
                                          <div class="form-check form-switch">
                                          <input class="form-check-input" type="checkbox" id="switchTwo" v-model="producto.descuento"/>
                                          <label class="form-check-label" for="switchTwo"></label>
                                          </div>
  
                                      </div>
                                      <div class="col ms-n2">
  
                                          <!-- Help text -->
                                          <small class="text-muted">
                                          Descuento desactivado
                                          </small>
  
                                      </div>
                                      </div> <!-- / .row -->
                                  </div>
  
                                  </div>
                                  <div class="col-12 col-md-6">
                                  <div class="form-group">
                                      <label class="mb-1">🎨 Producto personalizable</label>
                                      <small class="form-text text-muted d-block mb-2">Activa esto si el cliente puede agregar su propio diseño o instrucciones al comprar.</small>
                                      <div class="row">
                                          <div class="col-auto">
                                              <div class="form-check form-switch">
                                                  <input class="form-check-input" type="checkbox" id="switchPersonalizable" v-model="producto.personalizable"/>
                                                  <label class="form-check-label" for="switchPersonalizable"></label>
                                              </div>
                                          </div>
                                          <div class="col ms-n2">
                                              <small class="text-muted">{{ producto.personalizable ? '✅ Los clientes podrán subir su diseño' : 'Personalización desactivada' }}</small>
                                          </div>
                                      </div>
                                  </div>
                                  </div>
                              </div> <!-- / .row -->

                              <!-- Button -->
              <div class="d-flex gap-2 flex-wrap mt-5">
                  <button class="btn btn-primary" v-on:click="validar()">Actualizar producto</button>
                  <router-link to="/ingreso/create" class="btn btn-success">+ Agregar stock (Ingresos)</router-link>
              </div>
                              <hr class="mt-4 mb-5">
                              <div class="row justify-content-between align-items-center mb-5">
                                  <div class="col-12">
                                      <h2 class="mb-2">Variedades / Tallas</h2>
                                  </div>
                              </div>
                              <div class="row g-2 align-items-end mb-4">
                                  <div class="col-12 col-md-4">
                                      <label class="form-label fw-bold">Talla</label>
                                      <div class="d-flex flex-wrap gap-2 mt-1">
                                          <button type="button" v-for="t in tallas_opciones" :key="t"
                                              class="btn btn-sm"
                                              :style="variedad.variedad === t ? 'background:#111;color:#fff;border-color:#111;' : 'background:#fff;color:#333;border:1.5px solid #ddd;'"
                                              @click="variedad.variedad = t">
                                              {{t}}
                                          </button>
                                      </div>
                                      <small v-if="variedad.variedad" class="text-success mt-1 d-block">Seleccionada: {{variedad.variedad}}</small>
                                  </div>
                                  <div class="col-12 col-md-4">
                                      <label class="form-label fw-bold">Proveedor</label>
                                      <input type="text" class="form-control" placeholder="Ej: Nike, Gildan..." v-model="variedad.proveedor">
                                  </div>
                                  <div class="col d-flex align-items-end">
                                      <button class="btn btn-primary w-100" v-on:click="validar_variedad()">Agregar</button>
                                  </div>
                              </div>
  
                              <div class="card">
                                  <div class="card-body" v-if="variedades.length >= 1">
  
                                      <!-- List group -->
                                      <div class="list-group list-group-flush my-n3">
                                     
                                      <div class="list-group-item" v-for="item in variedades">
                                          <div class="row align-i tems-center" >
                                          <div class="col">
  
                                              <!-- Heading -->
                                              <h4 class="mb-1">
                                                  {{item.variedad.toUpperCase()}}
                                              </h4>
  
                                              <!-- Text -->
                                              <small class="text-muted">
                                                  <b>SKU:</b>  {{item.sku.toUpperCase()}}
                                              </small>
  
                                          </div>
                                          <div class="col">
                                               <!-- Heading -->
                                              <h4 class="mb-1">
                                                  {{item.stock}}
                                              </h4>
  
                                              <!-- Text -->
                                              <small class="text-muted">
                                                  Unidades
                                              </small>
                                          </div>
                                          <div class="col-auto">
  
                                              <!-- Button -->
                                              <button class="btn btn-sm btn-danger" type="button" @click="confirmarEliminar(item._id)">
                                                  Eliminar
                                              </button>
  
                                          </div>
                                          </div> <!-- / .row -->
                                      </div>
                                  
                                      </div>
  
                                  </div>
                                  <div class="card-body" v-if="variedades.length == 0">
                                      <div class="row">
                                          <div class="col-12 text-center">
                                              <img src="/assets/media/la-cuna-de-newton.gif" alt="" style="width:80px">
                                          </div>
                                      </div>
                                  </div>
                              </div>
  
  
                              <!-- GALERÍA -->
                              <div class="row justify-content-between align-items-center mb-4 mt-2">
                                  <div class="col-12">
                                      <h2 class="mb-1">Galería de imágenes</h2>
                                      <p class="text-muted mb-2">Fotos adicionales del producto que verán los clientes (PNG/JPG, máx 1MB).</p>
                                      <label class="btn btn-outline-primary btn-sm">
                                          + Subir foto
                                          <input type="file" style="display:none" accept="image/*" @change="subirGaleria($event)">
                                      </label>
                                  </div>
                              </div>
                              <div class="row g-3 mb-5">
                                  <div v-if="!galeria.length" class="col-12 text-center text-muted py-4" style="border:2px dashed #dee2e6;border-radius:8px;">
                                      Sin imágenes en la galería todavía
                                  </div>
                                  <div v-for="img in galeria" :key="img._id" class="col-6 col-md-3" style="position:relative;">
                                      <img :src="$url+'/obtener_galeria_producto/'+img.imagen" style="width:100%;height:110px;object-fit:cover;border-radius:8px;border:1px solid #dee2e6;">
                                      <button @click="eliminarGaleria(img._id)" style="position:absolute;top:4px;right:8px;background:rgba(220,53,69,0.9);color:#fff;border:none;border-radius:50%;width:24px;height:24px;font-size:14px;line-height:1;cursor:pointer;">&times;</button>
                                  </div>
                              </div>


  
                      </div>  <!-- / mb-7 -->

                      </div>  <!-- / col-12 col-lg-10 col-xl-8 -->
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
    name: 'EditProductoApp',
    components: {
      Sidebar,
      TopNav
    },
    data() {
        return {
            str_image: '/assets/img/avatar-1.jpg',
            producto: {
                categoria: '',
                estado: false,
                descuento: false,
                portada: undefined,
            },
            portada : undefined,
            variedad: {},
            sku: '',
            variedades : [],
            galeria: [],
            tallas_opciones: ['CH','M','G','XL','XXL'],
            categorias: [],
            subcategorias: [],
        }
    },
    methods: {
        init_data(){
            axios.get(this.$url+'/obtener_producto_admin/'+this.$route.params.id,{
                headers:{
                     'Content-Type': 'application/json',
                      'Authorization': this.$store.state.token,
                }
            }).then((result)=>{
                this.producto = result.data;
                this.str_image = this.$url+'/obtener_portada_producto/'+this.producto.portada;
            });
        },
        uploadImage($event){
  
              var image;
  
              if($event.target.files.length >= 1){
                  image = $event.target.files[0];
              }
  
              if(image.size <= 1000000){
                 if(image.type == 'image/jpeg'||image.type == 'image/png'||image.type == 'image/webp'||image.type == 'image/jpg'){
                     this.str_image = URL.createObjectURL(image);
                      this.portada = image;
                      this.producto.portada = this.portada;
                 }else{
                     this.$notify({
                          group: 'foo',
                          title: 'ERROR',
                          text: 'El recurso debe ser imagen.',
                          type: 'error'
                      });
                      this.portada = undefined;
                 }
              }else{
                  this.$notify({
                      group: 'foo',
                      title: 'ERROR',
                      text: 'La imagen debe pesar menos de 1MB',
                      type: 'error'
                  });
                  this.portada = undefined;
              }
            
        },
        validar(){
              if(!this.producto.titulo){
                  this.$notify({
                      group: 'foo',
                      title: 'ERROR',
                      text: 'Ingrese el titulo del producto',
                      type: 'error'
                  });
              }else if(!this.producto.categoria){
                  this.$notify({
                      group: 'foo',
                      title: 'ERROR',
                      text: 'Seleccione la categoria del producto',
                      type: 'error'
                  });
              }else if(!this.producto.subcategoria){
                  this.$notify({
                      group: 'foo',
                      title: 'ERROR',
                      text: 'Seleccione la subcategoria del producto',
                      type: 'error'
                  });
              }else if(!this.producto.extracto){
                  this.$notify({
                      group: 'foo',
                      title: 'ERROR',
                      text: 'Ingrese el extracto del producto',
                      type: 'error'
                  });
              }else if(!this.producto.str_variedad){
                  this.$notify({
                      group: 'foo',
                      title: 'ERROR',
                      text: 'Ingrese la variedad del producto',
                      type: 'error'
                  });
              }else{
                  this.actualizar();
              }
            
        },
  
        actualizar(){
            var data;
            var content = '';
            if(this.portada != undefined){
              content = 'multipart/form-data';
              data = new FormData();
              data.append('titulo', this.producto.titulo);
              data.append('categoria', this.producto.categoria);
              data.append('subcategoria', this.producto.subcategoria);
              data.append('extracto', this.producto.extracto);
              data.append('estado', this.producto.estado);
              data.append('str_variedad', this.producto.str_variedad);
              data.append('descuento', this.producto.descuento);
              data.append('personalizable', this.producto.personalizable);
              data.append('precio', this.producto.precio);
              data.append('portada', this.producto.portada);
            }else{
                content = 'application/json';
                data = this.producto;
            }
  
            axios.put(this.$url+'/actualizar_producto_admin/'+this.$route.params.id,data,{
                headers: {
                    'Content-Type': content,
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
                      title: 'SUCCESS',
                      text: 'Se actualizó el producto.',
                      type: 'success'
                  });
                }
                
            })
  
  
        },
  
        validar_variedad(){
            if(!this.variedad.proveedor){
                  this.$notify({
                      group: 'foo',
                      title: 'ERROR',
                      text: 'Ingrese el proveedor del producto',
                      type: 'error'
                  });
            }else if(!this.variedad.variedad){
                  this.$notify({
                      group: 'foo',
                      title: 'ERROR',
                      text: 'Ingrese la variedad del producto',
                      type: 'error'
                  });
            }else{
                this.variedad.producto = this.$route.params.id;
                this.variedad.sku =  this.generar_sku();
  
                this.registro_variedad();
            }
           
        },
  
        registro_variedad(){
            axios.post(this.$url+'/registro_variedad_producto',this.variedad,{
                headers:{
                     'Content-Type': 'application/json',
                    'Authorization' : this.$store.state.token
                }
            }).then((result)=>{
                this.variedad = {};
                this.$notify({
                      group: 'foo',
                      title: 'SUCCESS',
                      text: 'Se agrego la nueva variedad.',
                      type: 'success'
                  });
                  this.init_variedades();
            });
        },  
        generar_sku(){
          let sku = this.producto.titulo.substr(0,3)+''+this.producto.str_variedad.substr(0,3)+''+this.variedad.variedad.substr(0,3)+''+this.variedad.proveedor.substr(0,3);
          return sku.toUpperCase();
          //XIACOLROJREA
        },
  
        init_variedades(){
            axios.get(this.$url+'/obtener_variedades_producto/'+this.$route.params.id,{
                headers:{
                     'Content-Type': 'application/json',
                    'Authorization' : this.$store.state.token
                }
            }).then((result)=>{
                this.variedades = result.data;
                /* this.variedad = {};
                this.$notify({
                      group: 'foo',
                      title: 'SUCCESS',
                      text: 'Se agrego la nueva variedad.',
                      type: 'success'
                  }); */
            });
        },
        confirmarEliminar(id){
            if(window.confirm('¿Seguro que deseas eliminar esta variedad?')){
                this.eliminar(id);
            }
        },

        eliminar(id){
          axios.delete(this.$url+'/eliminar_variedad_producto/'+id,{
                headers:{
                     'Content-Type': 'application/json',
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
                      title: 'SUCCESS',
                      text: 'Se eliminó la variedad.',
                      type: 'success'
                  });
  
                  this.init_variedades();
              }
                  
            });
        },
        init_galeria(){
            axios.get(this.$url+'/obtener_galeria_producto_admin/'+this.$route.params.id,{
                headers:{ 'Content-Type':'application/json', 'Authorization': this.$store.state.token }
            }).then((result)=>{ this.galeria = result.data; });
        },
        subirGaleria($event){
            const file = $event.target.files[0];
            if(!file) return;
            if(file.size > 1000000){ this.$notify({group:'foo',title:'ERROR',text:'La imagen debe pesar menos de 1MB',type:'error'}); return; }
            if(!['image/jpeg','image/png','image/webp','image/jpg'].includes(file.type)){ this.$notify({group:'foo',title:'ERROR',text:'Solo se aceptan imágenes.',type:'error'}); return; }
            const fm = new FormData();
            fm.append('imagen', file);
            fm.append('producto', this.$route.params.id);
            axios.post(this.$url+'/subir_imagen_producto_admin', fm,{
                headers:{ 'Content-Type':'multipart/form-data', 'Authorization': this.$store.state.token }
            }).then(()=>{
                this.$notify({group:'foo',title:'SUCCESS',text:'Imagen subida.',type:'success'});
                this.init_galeria();
                $event.target.value = '';
            }).catch(()=>{ this.$notify({group:'foo',title:'ERROR',text:'No se pudo subir la imagen.',type:'error'}); });
        },
        eliminarGaleria(id){
            if(!window.confirm('\u00bfEliminar esta imagen de la galería?')) return;
            axios.delete(this.$url+'/eliminar_galeria_producto_admin/'+id,{
                headers:{ 'Content-Type':'application/json', 'Authorization': this.$store.state.token }
            }).then(()=>{
                this.$notify({group:'foo',title:'SUCCESS',text:'Imagen eliminada.',type:'success'});
                this.init_galeria();
            });
        },
        init_categorias(){
            axios.get(this.$url+'/listar_categorias_admin',{
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': this.$store.state.token,
                }
            }).then((result)=>{
                this.categorias = result.data;
                this.subcategorias = this.categorias.filter(item=>item.categoria.titulo == this.producto.categoria)[0].subcategorias;
            });
        },

        getSubcategorias(event){
            this.subcategorias = this.categorias.filter(item=>item.categoria.titulo == event.target.value)[0].subcategorias;
        }
    },
    beforeMount() {
        this.init_data();
        this.init_categorias();
        this.init_variedades();
        this.init_galeria();
    },
  }
  </script>
  