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
                      <span style="background:#1864ab;color:#fff;border-radius:20px;padding:2px 12px;font-weight:600;">📋 Todos los productos</span>
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
                                      Listado de Productos
                                      </h1>
  
                                  </div>
                                  </div> <!-- / .row -->
                                  <div class="row align-items-center">
                                  <div class="col">
  
                                      <!-- Navegación en píldoras -->
                                      <div class="d-flex gap-2 mt-2 flex-wrap">
                                          <span style="background:#1864ab;color:#fff;border-radius:20px;padding:5px 18px;font-size:14px;font-weight:600;cursor:default;">📋 Todos los productos</span>
                                          <router-link to="/producto/create" style="background:#f1f3f5;color:#495057;border-radius:20px;padding:5px 18px;font-size:14px;font-weight:500;text-decoration:none;border:1px solid #dee2e6;">➕ Nuevo producto</router-link>
                                      </div>
  
                                  </div>
                                  </div>
                              </div>
                          </div>
  
                          <!-- GUÍA DE USO -->
                          <div class="alert mb-4" style="background:linear-gradient(135deg,#e7f5ff,#d0ebff);border:1px solid #74c0fc;border-radius:12px;padding:16px 20px;">
                              <div class="d-flex align-items-start gap-3">
                                  <div style="font-size:26px;line-height:1.2">🛒</div>
                                  <div>
                                      <h5 class="mb-1" style="color:#1864ab;font-weight:700">Gestión de Productos</h5>
                                      <p class="mb-2" style="color:#495057;font-size:14px">
                                          Aquí ves todos los productos registrados. Usa el menú <b>⋮</b> de cada producto para <b>editarlo</b> o gestionar su <b>galería de imágenes</b>.
                                      </p>
                                      <div class="d-flex flex-wrap gap-2">
                                          <span style="background:#fff;border:1px solid #74c0fc;border-radius:8px;padding:3px 10px;font-size:13px;color:#1864ab;">🟢 Publicado = visible en tienda</span>
                                          <span style="background:#fff;border:1px solid #74c0fc;border-radius:8px;padding:3px 10px;font-size:13px;color:#1864ab;">⚫ Borrador = solo lo ves tú</span>
                                          <span style="background:#fff;border:1px solid #74c0fc;border-radius:8px;padding:3px 10px;font-size:13px;color:#1864ab;">🔍 Busca por nombre en la caja de texto</span>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <div class="row mb-5">
                              <div class="col-12">
  
                                  <!-- Files -->
                                  <div class="card" data-list="{&quot;valueNames&quot;: [&quot;name&quot;]}">
                                      <div class="card-header">
  
                                          <!-- Title -->
                                          <h4 class="card-header-title">
                                              <b>Productos de tu almacén</b>
                                          </h4>
  
                                      
                                      </div>
                                      <div class="card-header">
                                          <div class="input-group input-group-flush input-group-merge input-group-reverse">
  
                                              <!-- Input -->
                                              <input class="form-control list-search" type="search" placeholder="Busca tu producto" v-model="filtro">
  
                                              <!-- Prepend -->
                                              <div class="input-group-text" style="cursor:pointer" v-on:click="init_data()">
                                              <span class="fe fe-search"></span>
                                              </div>
  
                                          </div>
  
                                      </div>
                                      <div class="card-body">
  
                                          <!-- List -->
                                          <template v-if="load_data">
                                              <div>
                                                  <div class="row">
                                                      <div class="col-12 text-center">
                                                          <div class="spinner-border mt-5 mb-5" role="status">
                                                          <span class="visually-hidden">Loading...</span>
                                                          </div>
                                                      </div>
                                                  </div>  
                                              </div>
                                          </template>
                                          <template v-if="!load_data">
                                              <div>
                                                  <ul id="my-table" class="list-group list-group-lg list-group-flush list my-n4" v-if="productos.length >= 1">
                                                      <li class="list-group-item" v-for="item in itemsForList">
                                                          <div class="row align-items-center">
                                                          <div class="col-auto">
  
                                                              <!-- Avatar -->
                                                              <a href="#!" class="avatar avatar-lg">
                                                              <img :src="$imgSrc(item.portada)" alt="..." class="avatar-img rounded">
                                                              </a>
  
                                                          </div>
                                                          <div class="col ms-n2">
  
                                                              <!-- Title -->
                                                              <h4 class="mb-1 name">
                                                              <a href="#!">{{item.titulo}}</a>
                                                              </h4>
  
                                                              <!-- Text -->
                                                              <p class="card-text small text-muted mb-1">
                                                                  {{item.categoria}} &nbsp;
                                                                  <span v-if="!item.estado" class="item-score badge bg-danger-soft">Borrador</span>
                                                                  <span v-if="item.estado" class="item-score badge bg-success-soft">Publicado</span>
                                                              </p>
  
                                                              <!-- Time -->
                                                              <p class="card-text small text-muted">
                                                                  Creación <time datetime="2018-01-03">{{convertDate(item.createdAt)}}</time>
                                                              </p>
  
                                                          </div>
                                                          <div class="col-auto">
                                                              <span><b>{{convertCurrency(item.precio)}}</b></span>
  
                                                          </div>
                                                          <div class="col-auto">
  
                                                              <!-- Dropdown -->
                                                              <div class="dropdown">
                                                              <a href="#" class="dropdown-ellipses dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                  <i class="fe fe-more-vertical"></i>
                                                              </a>
                                                              <div class="dropdown-menu dropdown-menu-end">
  
                                                                  <router-link :to="{name: 'producto-edit',params: {id:item._id}}" class="dropdown-item">
                                                                      Editar producto
                                                                  </router-link>
                                                                  <router-link :to="{name: 'producto-galeria',params: {id:item._id}}" class="dropdown-item">
                                                                      Galeria
                                                                  </router-link>
                                                                  <a class="dropdown-item text-danger" style="cursor:pointer" @click="eliminarProducto(item._id)">
                                                                      Eliminar producto
                                                                  </a>
                                                              </div>
                                                              </div>
  
                                                          </div>
                                                          </div> <!-- / .row -->
                                                      </li>
                                                  </ul>
  
                                                  <div class="row justify-content-center" v-if="productos.length == 0">
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
                                              </div>
                                          </template>
                                      </div>
                                      <div class="card-footer">
                                          <nav v-if="productos.length > perPage">
                                              <ul class="pagination pagination-sm mb-0">
                                                  <li class="page-item" :class="{disabled: currentPage === 1}">
                                                      <a class="page-link" href="#" @click.prevent="currentPage > 1 && currentPage--">&#8249;</a>
                                                  </li>
                                                  <li class="page-item" v-for="p in totalPages" :key="p" :class="{active: currentPage === p}">
                                                      <a class="page-link" href="#" @click.prevent="currentPage = p">{{p}}</a>
                                                  </li>
                                                  <li class="page-item" :class="{disabled: currentPage === totalPages}">
                                                      <a class="page-link" href="#" @click.prevent="currentPage < totalPages && currentPage++">&#8250;</a>
                                                  </li>
                                              </ul>
                                          </nav>
                                      </div>
                                  </div>
  
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
    name: 'IndexProductoApp',
    data() {
        return {
            productos: [],
            filtro: '',
            load_data: false,
            currentPage: 1,
            perPage: 15,
            get itemsForList(){
                return this.productos.slice(
                    (this.currentPage-1) * this.perPage, this.currentPage* this.perPage
                )
            }
        }
    },
    computed: {
        totalPages(){
            return Math.ceil(this.productos.length / this.perPage);
        }
    },
    methods: {
        init_data(){
            this.load_data = true;
            axios.get(this.$url+'/listar_productos_admin/'+this.filtro,{
                headers:{
                      'Content-Type': 'application/json',
                      'Authorization': this.$store.state.token,
                }
            }).then((result)=>{
                this.productos = result.data;
                this.load_data = false;
            });
        },
  
        eliminarProducto(id){
            if(!window.confirm('¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer.')) return;
            axios.delete(this.$url+'/eliminar_producto_admin/'+id,{
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': this.$store.state.token,
                }
            }).then(()=>{
                this.init_data();
            }).catch(()=>{
                alert('No se pudo eliminar el producto.');
            });
        },

        convertDate(date){
            return moment(date).format('YYYY-MM-DD');
        },
  
        convertCurrency(number){
            const n = parseFloat(number) || 0;
            return '$ ' + n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MXN';
        }
    },
    beforeMount() {
        this.init_data();
    },
    components: {
      Sidebar,
      TopNav
    }
  }
  </script>
  