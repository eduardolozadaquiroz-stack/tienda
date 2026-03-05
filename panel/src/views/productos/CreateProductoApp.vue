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
                      <span style="background:#1864ab;color:#fff;border-radius:20px;padding:2px 12px;font-weight:600;">✏️ Nuevo producto</span>
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
                                      Nuevo producto
                                      </h1>
  
                                  </div>
                                  </div> <!-- / .row -->
                                  <div class="row align-items-center">
                                  <div class="col">
  
                                      <!-- Navegación en píldoras -->
                                      <div class="d-flex gap-2 mt-2 flex-wrap">
                                          <router-link to="/producto" style="background:#f1f3f5;color:#495057;border-radius:20px;padding:5px 18px;font-size:14px;font-weight:500;text-decoration:none;border:1px solid #dee2e6;">← Todos los productos</router-link>
                                          <span style="background:#1864ab;color:#fff;border-radius:20px;padding:5px 18px;font-size:14px;font-weight:600;cursor:default;">✏️ Nuevo producto</span>
                                      </div>
  
                                  </div>
                                  </div>
                              </div>
                          </div>
  
                      <!-- INDICADOR DE PASOS -->
                          <div class="card mb-5" style="background:linear-gradient(135deg,#e7f5ff,#d0ebff);border:1px solid #74c0fc;border-radius:12px;">
                              <div class="card-body py-3">
                                  <h6 class="mb-3" style="color:#1864ab;font-weight:700;"><i class="fe fe-info me-2"></i>Para crear un producto completa estos pasos en orden:</h6>
                                  <div class="d-flex flex-wrap gap-3">
                                      <div style="background:#fff;border:1px solid #74c0fc;border-radius:10px;padding:8px 14px;min-width:160px;">
                                          <div style="font-size:20px;">1️⃣</div>
                                          <div style="font-size:13px;color:#1864ab;font-weight:600;">Sube la imagen de portada</div>
                                          <div style="font-size:12px;color:#868e96;">PNG o JPG, máx 1MB</div>
                                      </div>
                                      <div style="background:#fff;border:1px solid #74c0fc;border-radius:10px;padding:8px 14px;min-width:160px;">
                                          <div style="font-size:20px;">2️⃣</div>
                                          <div style="font-size:13px;color:#1864ab;font-weight:600;">Completa los datos básicos</div>
                                          <div style="font-size:12px;color:#868e96;">Título, categoría, subcategoría</div>
                                      </div>
                                      <div style="background:#fff;border:1px solid #74c0fc;border-radius:10px;padding:8px 14px;min-width:160px;">
                                          <div style="font-size:20px;">3️⃣</div>
                                          <div style="font-size:13px;color:#1864ab;font-weight:600;">Agrega tallas y descripción</div>
                                          <div style="font-size:12px;color:#868e96;">El precio lo asigna el Ingreso</div>
                                      </div>
                                      <div style="background:#fff;border:1px solid #74c0fc;border-radius:10px;padding:8px 14px;min-width:160px;">
                                          <div style="font-size:20px;">4️⃣</div>
                                          <div style="font-size:13px;color:#1864ab;font-weight:600;">Haz clic en Crear producto</div>
                                          <div style="font-size:12px;color:#868e96;">Luego ve a Editar para añadir galería</div>
                                      </div>
                                  </div>
                                  <p class="mb-0 mt-2" style="font-size:12px;color:#c92a2a;font-weight:600;">⚠️ Los campos marcados con <b>*</b> son obligatorios. No podrás guardar si faltan.</p>
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
                                      Subir imagen
                                  </label>
                                  <input style="display:none" id="file-upload" type="file" v-on:change="uploadImage($event)"/>
  
                                  </div>
                              </div> <!-- / .row -->
  
                              <!-- Divider -->
                              <hr class="my-5">
  
                              <div class="row">
<!-- Paso 2: Datos básicos -->
                                  <div class="col-12 col-md-12">

                                  <!-- Email address -->
                                  <div class="form-group">

                                      <!-- Label -->
                                      <label class="mb-1">
                                      Título del producto <span style="color:#c92a2a;font-weight:700;">*</span>
                                      </label>

                                      <!-- Form text -->
                                      <small class="form-text text-muted">
                                      Este nombre verán los clientes en la tienda. Sé descriptivo (ej: "Playera Oversize Unisex Negra").
                                      </small>

                                      <!-- Input -->
                                      <input type="text" class="form-control" placeholder="Ej: Playera Oversize Unisex Negra Talla M" v-model="producto.titulo">
  
                                  </div>
                                  </div>

                                  <div class="col-12 col-md-6">
  
                                    <!-- First name -->
                                    <div class="form-group">

                                        <!-- Label -->
                                        <label class="form-label">
                                        Categoría <span style="color:#c92a2a;font-weight:700;">*</span>
                                        </label>

                                        <small class="form-text text-muted">
                                        Selecciona la categoría principal. Primero debes haberla creado en el módulo Categorías.
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
                                      Subcategoría <span style="color:#c92a2a;font-weight:700;">*</span>
                                      </label>

                                      <small class="form-text text-muted">
                                      Primero selecciona la categoría de arriba; las subcategorías aparecerán automáticamente.
                                      </small>
  
                                      <!-- Input -->
                                      <select name="" class="form-select" v-model="producto.subcategoria">
                                          <option value="" disabled selected>Seleccionar</option>
                                          <option :value="item.titulo" v-for="item in subcategorias">{{item.titulo}}</option>
                                      </select>
  
                                  </div>
  
                                  </div>

                                  <div class="col-12">
                                        <div class="form-group">
                                            <label class="form-label">Tallas disponibles <span style="color:#c92a2a;font-weight:700;">*</span></label>
                                            <small class="form-text text-muted d-block mb-2">Selecciona las tallas que tendrá este producto. Se crearán automáticamente al guardar.</small>
                                            <div class="d-flex flex-wrap gap-2">
                                                <button type="button" v-for="talla in tallas_opciones" :key="talla"
                                                    class="btn btn-sm"
                                                    :style="tallas_seleccionadas.includes(talla) ? 'background:#111;color:#fff;border-color:#111;' : 'background:#fff;color:#333;border:1.5px solid #ddd;'"
                                                    @click="toggleTalla(talla)">
                                                    {{ talla }}
                                                </button>
                                            </div>
                                            <small v-if="tallas_seleccionadas.length" class="d-block mt-2" style="color:#2f9e44;font-weight:600;">✓ Seleccionadas: {{ tallas_seleccionadas.join(', ') }}</small>
                                            <small v-else class="d-block mt-2 text-muted">Ninguna talla seleccionada aún</small>
                                        </div>
                                  </div>

                                  <div class="col-12 col-md-6">
                                        <div class="form-group">
                                            <label class="form-label">Proveedor</label>
                                            <small class="form-text text-muted d-block mb-1">Nombre del proveedor de las prendas (opcional, por defecto "Propio").</small>
                                            <input type="text" class="form-control" placeholder="Ej: Propio / Mayorista XYZ" v-model="producto.proveedor">
                                        </div>
                                  </div>

                                  <div class="col-12 col-md-6">
                                  <div class="form-group">
                      <label class="form-label">Precio de venta</label>
                      <div style="background:#fff8e1;border:1px solid #ffe082;border-radius:8px;padding:10px 14px;font-size:13px;color:#795548;">
                          <b>⚠️ Se calcula automáticamente</b><br>
                          El precio lo fija el <b>Ingreso</b> según el costo del proveedor y el margen de ganancia que configures. Se guardará como <b>$0</b> hasta que registres tu primer ingreso.
                      </div>
                  </div>
                  </div>

                                  <div class="col-12 col-md-12">
                                  <div class="form-group">
                                      <label class="form-label">
                                      Descripción del producto <span style="color:#c92a2a;font-weight:700;">*</span>
                                      </label>
                                      <small class="form-text text-muted d-block mb-1">Explica qué es el producto, sus características o cómo se usa. Los clientes verán este texto.</small>
  
                                      <!-- Input -->
                                      <textarea class="form-control" id=""  rows="3" placeholder="Describe el producto: para qué sirve, características, etc." v-model="producto.extracto"></textarea>
  
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

                              <!-- Divider -->
                              <hr class="mt-4 mb-5">

                              <!-- Button -->
                              <button class="btn btn-primary" v-on:click="validar()">
                                  Crear producto
                              </button>

                          </div>

                      </div>
                  </div> <!-- / .row -->
              </div>

          </div>
      </div>
  </template>

  <script>
  import Sidebar from '@/components/Sidebar.vue';
  import TopNav from '@/components/TopNav.vue';
  import axios from 'axios';

  export default {
    name: 'CreateProductoApp',
    data() {
        return {
            str_image: undefined,
            producto: {
                categoria: '',
                estado: false,
                descuento: false,
                personalizable: false,
                portada: undefined,
                subcategoria: ''
            },
            categorias: [],
            subcategorias: [],
            portada : undefined,
            tallas_opciones: ['CH','M','G','XL','XXL'],
            tallas_seleccionadas: [],
        }
    },

    beforeMount(){
        this.init_categorias();
    },
    methods: {
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
              }else if(this.tallas_seleccionadas.length === 0){
                  this.$notify({
                      group: 'foo',
                      title: 'ERROR',
                      text: 'Selecciona al menos una talla',
                      type: 'error'
                  });
              }else if(this.producto.portada == undefined){
                  this.$notify({
                      group: 'foo',
                      title: 'ERROR',
                      text: 'Selecciona una imagen de portada',
                      type: 'error'
                  });
              }else{
                  this.registro();
              }
            
        },
  
        toggleTalla(talla){
            const idx = this.tallas_seleccionadas.indexOf(talla);
            if(idx >= 0){
                this.tallas_seleccionadas.splice(idx, 1);
            }else{
                this.tallas_seleccionadas.push(talla);
            }
            this.producto.str_variedad = this.tallas_seleccionadas.join(', ');
        },

        async registro(){
            var fm = new FormData();
            fm.append('titulo',this.producto.titulo);
            fm.append('categoria',this.producto.categoria);
            fm.append('subcategoria',this.producto.subcategoria);
            fm.append('extracto',this.producto.extracto);
            fm.append('estado',this.producto.estado);
            fm.append('str_variedad', this.tallas_seleccionadas.join(', '));
            fm.append('descuento',this.producto.descuento);
            fm.append('personalizable', this.producto.personalizable);
            fm.append('precio', this.producto.precio || 0);
            fm.append('portada',this.producto.portada);

            try {
                const result = await axios.post(this.$url+'/registro_producto_admin',fm,{
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization' : this.$store.state.token
                    }
                });

                if(result.data.message){
                    this.$notify({ group:'foo', title:'ERROR', text: result.data.message, type:'error' });
                    return;
                }

                // Crear variedad por cada talla seleccionada
                const productoId = result.data.data._id;
                const proveedor = this.producto.proveedor || 'Propio';
                for(const talla of this.tallas_seleccionadas){
                    const sku = (this.producto.titulo.substr(0,3) + talla.substr(0,3) + proveedor.substr(0,3)).toUpperCase();
                    await axios.post(this.$url+'/registro_variedad_producto',{
                        proveedor,
                        variedad: talla,
                        sku,
                        producto: productoId,
                        stock: 0
                    },{
                        headers:{ 'Content-Type':'application/json', 'Authorization': this.$store.state.token }
                    });
                }

                this.$notify({ group:'foo', title:'SUCCESS', text:'Producto creado con tallas: '+this.tallas_seleccionadas.join(', '), type:'success' });
                this.$router.push({name: 'producto-index'});

            } catch(e) {
                this.$notify({ group:'foo', title:'ERROR', text:'Error al crear el producto.', type:'error' });
            }
        },

        init_categorias(){
          axios.get(this.$url+'/listar_categorias_admin',{
              headers:{
                  'Content-Type': 'application/json',
                  'Authorization': this.$store.state.token,
              }
          }).then((result)=>{
              this.categorias = result.data;
          });
      },

      getSubcategorias(event){
        this.subcategorias = this.categorias.filter(item=>item.categoria.titulo == event.target.value)[0].subcategorias;
      }
    },
    components: {
      Sidebar,
      TopNav
    }
  }
  </script>
  