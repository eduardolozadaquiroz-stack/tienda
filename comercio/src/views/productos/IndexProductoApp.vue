<template>
  <div class="shop-page">

    <!-- BANNER -->
    <section class="shop-banner">
      <div class="shop-banner-bg" style="background-image: url('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600&auto=format&fit=crop&q=80')"></div>
      <div class="shop-banner-overlay"></div>
      <div class="shop-banner-content">
        <nav class="shop-breadcrumb">
          <router-link to="/">Inicio</router-link>
          <span>/</span>
          <span>Tienda</span>
        </nav>
        <h1 class="shop-banner-title">Colección</h1>
        <p class="shop-banner-sub">Playeras oversize · Tallas S–XXL · Diseños únicos</p>
      </div>
    </section>

    <!-- CONTENIDO -->
    <div class="shop-body">
      <div class="shop-container">

        <!-- SIDEBAR -->
        <aside class="shop-sidebar">
          <div class="sbar-block">
            <h6 class="sbar-title">Categorías</h6>
            <div class="nav flex-column" role="menu">
              <template v-for="(item, index) in categorias" :key="index">
                <div class="sbar-cat-group">
                  <button class="sbar-cat-btn" :class="{ active: item.categoria._id == categoria_activa }" data-bs-toggle="collapse" :data-bs-target="'#subcats_' + index" :aria-expanded="item.categoria._id == categoria_activa">
                    <span>{{ item.categoria.titulo }}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                  <div class="collapse" :class="{ show: item.categoria._id == categoria_activa }" :id="'subcats_' + index">
                    <div class="sbar-subcat-list">
                      <a class="sbar-subcat-item" style="cursor:pointer" @click="redirectCategoria(item.categoria.titulo)">Ver todos</a>
                      <a class="sbar-subcat-item" :class="{ 'sbar-subcat-active': subitem.titulo == subcategoria_activa }" style="cursor:pointer" v-for="subitem in item.subcategorias" :key="subitem.id" @click="redirectSubcategoria(subitem.titulo, item.categoria._id)">{{ subitem.titulo }}</a>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="sbar-block">
            <h6 class="sbar-title">Rango de precio</h6>
            <div ref="slider" class="sbar-slider"></div>
            <div class="sbar-price-range">
              <span>{{ convertCurrency(minRange) }}</span>
              <span>{{ convertCurrency(maxRange) }}</span>
            </div>
          </div>
          <div class="sbar-block">
            <h6 class="sbar-title">Tallas</h6>
            <div class="sbar-sizes">
              <button class="sbar-size-btn" :class="{ active: talla_activa === 'CH' }" @click="selectedColor('CH')">CH</button>
              <button class="sbar-size-btn" :class="{ active: talla_activa === 'M' }" @click="selectedColor('M')">M</button>
              <button class="sbar-size-btn" :class="{ active: talla_activa === 'G' }" @click="selectedColor('G')">G</button>
              <button class="sbar-size-btn" :class="{ active: talla_activa === 'XL' }" @click="selectedColor('XL')">XL</button>
              <button class="sbar-size-btn" :class="{ active: talla_activa === 'XXL' }" @click="selectedColor('XXL')">XXL</button>
            </div>
          </div>
        </aside>

        <!-- GRID PRINCIPAL -->
        <main class="shop-main">
          <div class="shop-toolbar">
            <p class="shop-count">
              <strong>{{ productos.length }}</strong> productos
              <span v-if="$route.query.categoria || $route.query.subcategoria" class="shop-filter-tag">
                {{ $route.query.subcategoria || $route.query.categoria }}
                <router-link :to="{ name: 'shop' }" class="shop-filter-clear">✕</router-link>
              </span>
            </p>
            <div class="shop-toolbar-right">
              <select class="shop-sort" v-model="sort_by" @change="setSortBy()">
                <option value="Defecto">Más recientes</option>
                <option value="Precio +-">Mayor precio</option>
                <option value="Precio -+">Menor precio</option>
              </select>
            </div>
          </div>

          <div class="shop-grid" id="my-table" v-if="itemsForList.length">
            <router-link class="scard" v-for="item in itemsForList" :key="item.id" :to="{ name: 'show-producto', params: { slug: item.slug } }">
              <div class="scard-img">
                <span class="scard-badge" v-if="item.descuento">Oferta</span>
                <img :src="$url + '/obtener_portada_producto/' + item.portada" :alt="item.titulo" />
                <div class="scard-overlay"><span>Ver producto →</span></div>
              </div>
              <div class="scard-info">
                <span class="scard-cat">{{ item.categoria }}</span>
                <h3 class="scard-name">{{ item.titulo }}</h3>
                <span class="scard-price">{{ convertCurrency(item.precio) }}</span>
              </div>
            </router-link>
          </div>

          <div class="shop-empty" v-if="!itemsForList.length">
            <div class="shop-empty-icon">👕</div>
            <p>No hay productos en esta categoría por el momento.</p>
            <router-link :to="{ name: 'shop' }" class="shop-empty-btn">Ver toda la colección</router-link>
          </div>

          <div class="shop-pagination" v-if="productos.length > perPage">
            <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">&#8592;</button>
            <span class="page-info">{{ currentPage }} / {{ Math.ceil(productos.length / perPage) }}</span>
            <button class="page-btn" :disabled="currentPage >= Math.ceil(productos.length / perPage)" @click="currentPage++">&#8594;</button>
          </div>
        </main>

      </div>
    </div>
  </div>
</template>

<style scoped>
* { box-sizing: border-box; }
a { text-decoration: none; color: inherit; }

.shop-banner { position: relative; height: 220px; display: flex; align-items: flex-end; overflow: hidden; }
.shop-banner-bg { position: absolute; inset: 0; background-size: cover; background-position: center 40%; filter: brightness(.45); }
.shop-banner-overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,0,0,.65) 0%, rgba(0,0,0,.2) 100%); }
.shop-banner-content { position: relative; z-index: 2; padding: 0 48px 22px; color: #fff; }
.shop-breadcrumb { font-size: 12px; color: rgba(255,255,255,.6); margin-bottom: 18px; display: flex; gap: 8px; }
.shop-breadcrumb a { color: rgba(255,255,255,.55); }
.shop-breadcrumb a:hover { color: #fff; }
.shop-banner-title { font-size: 2.6rem; font-weight: 900; letter-spacing: -1px; margin: 0 0 4px; text-transform: uppercase; line-height: 1; }
.shop-banner-sub { font-size: 12px; color: rgba(255,255,255,.55); letter-spacing: 1.5px; text-transform: uppercase; margin: 0; }

.shop-page { background: #f5f5f5; min-height: 100vh; }
.shop-body { padding: 36px 0 60px; }
.shop-container { max-width: 1320px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: 240px 1fr; gap: 32px; }

.shop-sidebar { display: flex; flex-direction: column; gap: 6px; }
.sbar-block { background: #fff; border-radius: 10px; padding: 20px; }
.sbar-title { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #999; margin: 0 0 14px; }
.sbar-cat-group { margin-bottom: 4px; }
.sbar-cat-btn { width: 100%; background: none; border: none; display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; border-radius: 6px; font-size: 13px; font-weight: 600; color: #222; cursor: pointer; transition: background .15s; }
.sbar-cat-btn:hover, .sbar-cat-btn.active { background: #f0f0f0; }
.sbar-subcat-list { padding: 4px 0 4px 12px; display: flex; flex-direction: column; gap: 2px; }
.sbar-subcat-item { padding: 6px 10px; border-radius: 6px; font-size: 13px; color: #555; cursor: pointer; transition: background .15s, color .15s; }
.sbar-subcat-item:hover { background: #f5f5f5; color: #111; }
.sbar-subcat-active { background: #111 !important; color: #fff !important; font-weight: 600; }
.sbar-slider { margin-bottom: 10px; }
.sbar-price-range { display: flex; justify-content: space-between; font-size: 12px; color: #666; font-weight: 600; }
.sbar-sizes { display: flex; flex-wrap: wrap; gap: 8px; }
.sbar-size-btn { padding: 6px 14px; border: 1.5px solid #ddd; border-radius: 6px; background: #fff; font-size: 12px; font-weight: 700; color: #333; cursor: pointer; transition: border-color .15s, background .15s, color .15s; }
.sbar-size-btn:hover, .sbar-size-btn.active { border-color: #111; background: #111; color: #fff; }

.shop-toolbar { display: flex; align-items: center; justify-content: space-between; background: #fff; border-radius: 10px; padding: 12px 20px; margin-bottom: 20px; }
.shop-count { font-size: 13px; color: #555; margin: 0; }
.shop-count strong { color: #111; }
.shop-filter-tag { display: inline-flex; align-items: center; gap: 6px; background: #f0f0f0; border-radius: 20px; padding: 2px 10px; margin-left: 10px; font-size: 12px; color: #333; text-transform: uppercase; }
.shop-filter-clear { color: #999; font-size: 11px; text-decoration: none; }
.shop-filter-clear:hover { color: #e00; }
.shop-toolbar-right { display: flex; align-items: center; gap: 16px; }
.shop-per-page { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #777; }
.shop-per-page button { width: 32px; height: 32px; border: 1.5px solid #ddd; border-radius: 6px; background: #fff; font-size: 12px; font-weight: 700; cursor: pointer; transition: all .15s; }
.shop-per-page button.active { border-color: #111; background: #111; color: #fff; }
.shop-sort { border: 1.5px solid #ddd; border-radius: 6px; padding: 6px 12px; font-size: 13px; color: #333; background: #fff; cursor: pointer; outline: none; }

.shop-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.scard { display: block; background: #fff; border-radius: 12px; overflow: hidden; transition: transform .2s, box-shadow .2s; }
.scard:hover { transform: translateY(-5px); box-shadow: 0 14px 34px rgba(0,0,0,.1); }
.scard-img { position: relative; overflow: hidden; height: 280px; background: #f5f5f5; }
.scard-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s ease; }
.scard:hover .scard-img img { transform: scale(1.06); }
.scard-badge { position: absolute; top: 10px; left: 10px; z-index: 2; background: #ef4444; color: #fff; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 3px 9px; border-radius: 4px; }
.scard-overlay { position: absolute; inset: 0; background: rgba(0,0,0,.42); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity .2s; }
.scard:hover .scard-overlay { opacity: 1; }
.scard-overlay span { color: #fff; font-weight: 700; font-size: 13px; letter-spacing: 1px; border: 2px solid rgba(255,255,255,.85); padding: 9px 22px; border-radius: 4px; }
.scard-info { padding: 14px 16px 18px; }
.scard-cat { font-size: 10px; color: #aaa; text-transform: uppercase; letter-spacing: 1.5px; }
.scard-name { font-size: 13px; font-weight: 700; color: #111; margin: 4px 0 8px; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.scard-price { font-size: 15px; font-weight: 800; color: #2983df; }

.shop-empty { text-align: center; padding: 60px 20px; }
.shop-empty-icon { font-size: 3rem; margin-bottom: 12px; }
.shop-empty p { color: #999; font-size: 14px; margin-bottom: 20px; }
.shop-empty-btn { display: inline-block; border: 2px solid #111; color: #111; font-weight: 700; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; padding: 10px 28px; border-radius: 4px; transition: background .2s, color .2s; }
.shop-empty-btn:hover { background: #111; color: #fff; }
.shop-pagination { margin-top: 32px; justify-content: center; display: flex; align-items: center; gap: 16px; }
.page-btn { background: #111; color: #fff; border: none; padding: 8px 18px; border-radius: 4px; font-size: 16px; cursor: pointer; transition: opacity .2s; }
.page-btn:disabled { opacity: 0.3; cursor: default; }
.page-info { font-size: 14px; color: #555; font-weight: 600; }

@media (max-width: 1024px) { .shop-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .shop-container { grid-template-columns: 1fr; } .shop-sidebar { display: none; } .shop-banner { height: 160px; } .shop-banner-content { padding: 0 24px 24px; } .shop-banner-title { font-size: 1.8rem; } }
@media (max-width: 480px) { .shop-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } .scard-img { height: 200px; } }
</style>


<script>


    import noUiSlider from '../../../public/assets/js/nouislider.min.js';
    import currency_formatter from 'currency-formatter';
    import axios from 'axios';

    export default {
       
        data() {
            return {
                slider: {
                    starMin: 0,
                    starMax: 10000,
                    min: 0,
                    max: 10000,
                    start: 40,
                    step: 1
                },
                minRange: 0,
                maxRange: 10000,
                productos: [],
                productos_const: [],
                categoria_activa: '',
                subcategoria_activa: '',
                categorias: [],
                currentPage: 1,
                perPage: 12,
                sort_by: 'Defecto',
                talla_activa: '',
            }
        },
        mounted() {
            noUiSlider.create(this.$refs.slider, {
                start: [this.slider.starMin, this.slider.starMax],
                step: this.slider.step,
                range: {
                    'min': this.slider.min,
                    'max': this.slider.max
                }
            });

            this.$refs.slider.noUiSlider.on('update',(values, handle) => {
                
                this[handle ? 'maxRange' : 'minRange'] = parseInt(values[handle]);
            }); 
            
        },  
        beforeMount() {
            axios.get(this.$url+'/obtener_productos_shop',{
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((result)=>{
                this.productos = result.data;
                this.productos_const = this.productos;
  
                if(this.$route.query.subcategoria){  
                    this.initProductosSubcategoria(); 
                }
                if(this.$route.query.categoria){
                    this.initProductosCategoria();
                }

               
            });
            this.init_categorias();
        },
     
        computed: {
            itemsForList() {
                return this.productos.slice(
                    (this.currentPage - 1) * this.perPage,
                    this.currentPage * this.perPage
                );
            }
        },
        methods: {
            convertCurrency(number){
                return currency_formatter.format(number, { code: 'MXN' });
            },
            setPerPage(item){
                this.perPage = item;
            },
            setSortBy(){
                if(this.sort_by == 'Defecto'){
                  this.productos.sort((a,b)=>new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime() ? 1:-1);
                }

                if(this.sort_by == 'Precio +-'){
                    this.productos.sort((a,b)=>a.precio < b.precio ? 1:-1);
                } 

                if(this.sort_by == 'Precio -+'){
                    this.productos.sort((a,b)=>a.precio > b.precio ? 1:-1);
                }
            },
            init_categorias(){
                 axios.get(this.$url+'/listar_categorias_public',{
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((result)=>{
                    this.categorias = result.data;
                    if(this.$route.query.subcategoria){
                        this.categoria_activa = this.categorias.filter(item=>item.subcategorias.some(subcat=>subcat.titulo == this.$route.query.subcategoria))[0].categoria._id;
                        this.subcategoria_activa = this.$route.query.subcategoria;
                    }
                 
                });
            },
            redirectSubcategoria(item,categoria){
                this.categoria_activa = categoria;
                this.subcategoria_activa = item;
                this.talla_activa = '';
                this.$router.push({name:'shop', query: {subcategoria: item}});
                // Filtrar directo con el valor, sin esperar que cambie la ruta
                this.productos = this.productos_const.filter(p => p.subcategoria == item);
            },
            initProductosSubcategoria(){
               this.productos = this.productos_const.filter(item=>item.subcategoria== this.$route.query.subcategoria );
            },
            redirectCategoria(item){
                this.talla_activa = '';
                this.$router.push({name:'shop', query: {categoria: item}});
                // Filtrar directo con el valor, sin esperar que cambie la ruta
                this.productos = this.productos_const.filter(p => p.categoria == item);
            },
            initProductosCategoria(){
               this.productos = this.productos_const.filter(item=>item.categoria== this.$route.query.categoria );
            },
            selectedColor(value){
                // Toggle: si ya está activa, deseleccionar y restaurar productos
                if(this.talla_activa === value){
                    this.talla_activa = '';
                    // Restaurar base según filtro activo
                    if(this.$route.query.subcategoria){
                        this.productos = this.productos_const.filter(item => item.subcategoria == this.$route.query.subcategoria);
                    } else if(this.$route.query.categoria){
                        this.productos = this.productos_const.filter(item => item.categoria == this.$route.query.categoria);
                    } else {
                        this.productos = this.productos_const;
                    }
                    return;
                }
                this.talla_activa = value;
                // Partir de la base ya filtrada por categoría/subcategoría si hay query activo
                let base = this.productos_const;
                if(this.$route.query.subcategoria){
                    base = base.filter(item => item.subcategoria == this.$route.query.subcategoria);
                } else if(this.$route.query.categoria){
                    base = base.filter(item => item.categoria == this.$route.query.categoria);
                }
                // Comparación case-insensitive para que "CH" == "ch" etc.
                this.productos = base.filter(item =>
                    item.variedades.some(subitem =>
                        subitem.variedad.toUpperCase() == value.toUpperCase()
                    )
                );
            },
            selectedSizes(event){
                this.productos = this.productos_const.filter(item=>item.variedades.some(subitem=>subitem.variedad == event.target.value));
            }
        },
        watch: {
            $route (to,from){
                if(!this.$route.query.subcategoria && !this.$route.query.categoria){  
                    this.talla_activa = '';
                    this.productos = this.productos_const; 
                }
            },
            minRange: function(value){
                if(!this.productos_const.length) return;
                let base = this.productos_const;
                if(this.$route.query.subcategoria) base = base.filter(i => i.subcategoria == this.$route.query.subcategoria);
                else if(this.$route.query.categoria) base = base.filter(i => i.categoria == this.$route.query.categoria);
                if(this.talla_activa) base = base.filter(i => i.variedades.some(v => v.variedad.toUpperCase() == this.talla_activa.toUpperCase()));
                this.productos = base.filter(i => i.precio >= value && i.precio <= this.maxRange);
            },
            maxRange: function(value){
                if(!this.productos_const.length) return;
                let base = this.productos_const;
                if(this.$route.query.subcategoria) base = base.filter(i => i.subcategoria == this.$route.query.subcategoria);
                else if(this.$route.query.categoria) base = base.filter(i => i.categoria == this.$route.query.categoria);
                if(this.talla_activa) base = base.filter(i => i.variedades.some(v => v.variedad.toUpperCase() == this.talla_activa.toUpperCase()));
                this.productos = base.filter(i => i.precio <= value && i.precio >= this.minRange);
            }
        }
    }
</script>


<style>
.noUi-horizontal .noUi-handle {
    background:#111 !important;
    border-radius: 5px !important;
}
.noUi-horizontal .noUi-handle {
    width: 0.5rem !important;
    height: 1rem !important;
}
.noUi-horizontal {
    height: 5px !important;
    background: #ddd !important;
    border: none !important;
}
.noUi-connect {
    background: #111 !important;
}
.sidebar-menu-item[data-bs-toggle="collapse"]::before{
    display: none !important;
}
.nav-pills .nav-link.active, .nav-pills .show>.nav-link {
    color: #ffffff !important;
    background-color: #111 !important;
}
</style>