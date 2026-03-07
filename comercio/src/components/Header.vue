<template>
  <header class="header header-absolute">
      <!-- Top Bar-->
      <div class="top-bar" style="background:#1a1a1a; border-bottom:1px solid #2a2a2a;">
        <div class="container-fluid">
          <div class="row d-flex align-items-center">
            <div class="col-sm-7 d-none d-sm-block">
              <ul class="list-inline topbar-text mb-0" style="color:rgba(255,255,255,.55); font-size:12px;">
                <li class="list-inline-item pe-3 me-0" style="color:rgba(255,255,255,.55);">
                  <img src="/assets/icons/telephone-bl.png" style="width: 14px; opacity:.6;">
                  551906013
                </li>
                <li class="list-inline-item px-3 border-start d-none d-lg-inline-block" style="border-color:#333 !important;">Envios gratis desde 200 MXN</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- Top Bar End-->
      <!-- Navbar-->
      <nav class="navbar navbar-expand-lg navbar-sticky navbar-airy navbar-dark bg-fixed-white navbar-fixed-light" style="background: #111 !important;">
        <div class="container-fluid">  
          <!-- Navbar Header  -->
          <router-link class="navbar-brand" style="color:white !important" to="/"> 👕 OVERSIZE MX</router-link>

          <button class="navbar-toggler navbar-toggler-right" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <!-- Navbar Collapse -->
          <div class="collapse navbar-collapse" id="navbarCollapse">
            <ul class="navbar-nav mx-auto">
              <li class="nav-item">
                <router-link class="nav-link" to="/">Inicio</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :to="{name: 'shop'}" :class="{ 'nav-section-active': isShopSection }">Tienda</router-link>
              </li>
              <!-- Megamenu-->
             
             
            </ul>
            <div class="d-flex align-items-center justify-content-between justify-content-lg-end mt-1 mb-2 my-lg-0">
                <!-- Search Button-->
                <!-- User Not Logged - link to login page-->
                <div class="nav-item">

                    <router-link v-if="!$store.state.token" class="navbar-icon-link" to="/login">
                      <img src="/assets/icons/user.png" style="width: 25px;" />
                        <span class="text-sm ms-2 ms-lg-0 text-uppercase text-sm fw-bold d-none d-sm-inline d-lg-none">Log in </span>
                    </router-link>
                    <a v-if="$store.state.token" class="navbar-icon-link dropdown" >
                        <img src="/assets/icons/user.png" style="width: 25px;" />
                          <span class="text-sm ms-2 ms-lg-0 text-uppercase text-sm fw-bold d-none d-sm-inline dropdown-toggle" data-bs-target="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> &nbsp; {{user && user.nombres ? user.nombres.split(' ')[0] : ''}}

                        </span>
                        <div class="dropdown-menu dropdown-menu-animated" aria-labelledby="categoryDropdownMenuLink" style="    left: -50px !important;">
                            <router-link class="dropdown-item" to="/cuenta/perfil">Mi perfil</router-link>
                            <router-link class="dropdown-item" to="/cuenta/venta">Mis ventas</router-link>
                            <router-link class="dropdown-item" to="/cuenta/direcciones">Direcciones</router-link>
                            <a class="dropdown-item" v-on:click="logout()">Cerrar sesión   </a>
                        </div>
                    </a>
                </div>
                <!-- Cart Dropdown-->
                <div class="nav-item dropdown">
                    <router-link class="navbar-icon-link d-lg-none" to="/cart" style="position:relative;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        <span v-if="carrito_length > 0" style="position:absolute;top:-6px;right:-8px;background:#e34234;color:#fff;border-radius:50%;width:16px;height:16px;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;">{{carrito_length}}</span>
                    </router-link>
                    <div class="d-none d-lg-block">
                        <a class="navbar-icon-link" id="cartdetails" href="#" data-bs-target="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img src="/assets/icons/cart.png" style="width: 25px;" />
                            <div class="navbar-icon-link-badge">{{carrito_length}}</div>
                        </a>
                        <div class="dropdown-menu dropdown-menu-animated dropdown-menu-end p-4" aria-labelledby="cartdetails" style="max-width: 350px !important;">
                            <div class="navbar-cart-product-wrapper" style="    overflow-x: hidden !important;max-height: 340px !important;">
                                <!-- cart item-->
                                <div class="navbar-cart-product" v-for="item in carrito" :key="item.id">
                                    <div class="d-flex align-items-center">
                                        <a href="detail.html">
                                          <img class="img-fluid navbar-cart-product-image" :src="$imgSrc(item.producto.portada)" alt="..." /></a>
                                        <div class="w-100">
                                            <a class="navbar-cart-product-close" href="#">
                                              <img src="/assets/icons/close.png" style="width: 15px;" />
                                            </a>
                                            <div class="ps-3">
                                              <router-link :to="{name: 'show-producto',params:{slug: item.producto.slug}}" class="navbar-cart-product-link"  style="text-overflow:ellipsis;overflow: hidden;white-space: nowrap;">{{item.producto.titulo}}</router-link>
                                              <small class="d-block text-muted">{{item.producto.str_variedad}}: {{item.variedad.variedad}} </small>
                                              <small class="d-block text-muted">Cantidad: {{item.cantidad}} </small>
                                              <strong class="d-block text-sm">{{convertCurrency(item.producto.precio*item.cantidad)}} </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            <!-- total price-->
                            <div class="navbar-cart-total"><span class="text-uppercase text-muted">Total</span><strong class="text-uppercase">{{convertCurrency(total)}}</strong></div>
                            <!-- buttons-->
                            <div class="d-flex justify-content-between">
                                <router-link class="btn btn-link text-dark me-3" to="/cart"> Carrito 
                                  <img src="/assets/icons/shopping-bag.png" style="width: 15px;">
                                </router-link>
                                <router-link to="/checkout" class="btn btn-outline-dark" >Checkout</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </nav>
      <!-- /Navbar -->
      <!-- Fullscreen search area-->
      <div class="search-area-wrapper">
        <div class="search-area d-flex align-items-center justify-content-center">
          <div class="close-btn">
            <svg class="svg-icon svg-icon-light w-3rem h-3rem">
              <use xlink:href="#close-1"> </use>
            </svg>
          </div>
          <form class="search-area-form" action="#">
            <div class="mb-4 position-relative">
              <input class="search-area-input" type="search" name="search" id="search" placeholder="What are you looking for?">
              <button class="search-area-button" type="submit">
                <svg class="svg-icon">
                  <use xlink:href="#search-1"> </use>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
      <!-- /Fullscreen search area-->
  </header>
</template>

<style>
.navbar-light .navbar-nav .nav-link, .navbar-hover-light:hover .navbar-nav .nav-link, .navbar-fixed-light.fixed-top .navbar-nav .nav-link {
    color: rgb(255 255 255) !important;
}

/* Indicador de sección activa */
.navbar-nav .nav-item .nav-link.router-link-exact-active,
.navbar-nav .nav-item .nav-link.nav-section-active {
    color: #fff !important;
    font-weight: 700;
    position: relative;
}
.navbar-nav .nav-item .nav-link.router-link-exact-active::after,
.navbar-nav .nav-item .nav-link.nav-section-active::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 2px;
    background: #fff;
    border-radius: 2px;
    animation: nav-underline-in .2s ease;
}
@keyframes nav-underline-in {
    from { width: 0; }
    to   { width: 60%; }
}
</style>

<script>

import axios from 'axios';
import currency_formatter from 'currency-formatter';

export default {
  name: 'Header',
  data() {
    return {
      carrito: [],
      total: 0,
      carrito_length : 0,
    }
  },
 
  computed: {
    isShopSection() {
      return ['shop', 'show-producto'].includes(this.$route.name);
    },
    user() {
      try { return this.$store.state.user ? JSON.parse(this.$store.state.user) : null; }
      catch(e) { return null; }
    }
  },
  methods: {
    convertCurrency(number){
        return currency_formatter.format(number, { code: 'MXN' });
    },
    logout(){
        this.$store.dispatch('logout');
        if(this.$route.path !== '/') this.$router.push({name: 'home'});
        /* window.location.reload(); */
        this.carrito = [];
        this.carrito_length = 0;
    },
    init_carrito(){
      if(this.$store.state.token != null){
        axios.get(this.$url+'/obtener_carrito_cliente',{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.$store.state.token
            }
        }).then((result)=>{
          this.carrito_length = result.data.carrito_general.length;
          this.total = 0;
          for(var item of result.data.carrito_general){
            let subtotal = item.producto.precio * item.cantidad;
            this.total = this.total+ subtotal;
          }
          this.carrito = result.data.carrito;
        });
      }
    },
    click_event(){
      this.$socket.emit('emit_method', 'Hola socket');
    },
    closeNavbar() {
      const navbar = document.getElementById('navbarCollapse');
      if (navbar && navbar.classList.contains('show')) {
        navbar.classList.remove('show');
      }
    }
  },

  watch: {
    $route() {
      this.closeNavbar();
    }
  },

  created() {
    this.sockets.subscribe('listen_cart', (data) => {
        this.init_carrito();
    });
  },  
  
  beforeMount() {
   this.init_carrito();
    
  },

  

}
</script>