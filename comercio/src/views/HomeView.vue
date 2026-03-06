<template>
  <div class="home">

    <!-- HERO -->
    <section class="hero-section">
      <div class="hero-bg" style="background-image: url('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600')"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="hero-badge">Nueva coleccion 2026</span>
        <h1 class="hero-title">OVERSIZE<br><span class="hero-title-accent">MX</span></h1>
        <p class="hero-subtitle">"Expresate con estilo - playeras oversize unicas para ti"</p>
        <div class="hero-actions">
          <router-link to="/shop" class="btn-hero-primary">Ver coleccion</router-link>
          <router-link to="/shop?categoria=PERSONALIZADAS" class="btn-hero-secondary">Personalizar</router-link>
        </div>
      </div>
      <div class="hero-scroll-hint"><span></span></div>
    </section>

    <!-- VALORES -->
    <section class="values-section">
      <div class="container">
        <div class="values-grid">
          <div class="value-item"><span class="value-icon">🚚</span><div><strong>Envio gratis</strong><p>En pedidos desde $200 MXN</p></div></div>
          <div class="value-item"><span class="value-icon">✂️</span><div><strong>Hecho a medida</strong><p>Tallas S hasta XXL disponibles</p></div></div>
          <div class="value-item"><span class="value-icon">🎨</span><div><strong>Diseno unico</strong><p>Acepta disenos personalizados</p></div></div>
          <div class="value-item"><span class="value-icon">🇲🇽</span><div><strong>Marca mexicana</strong><p>Calidad y orgullo nacional</p></div></div>
        </div>
      </div>
    </section>

    <!-- NUEVOS PRODUCTOS -->
    <section class="products-section">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Lo ultimo</span>
          <h2 class="section-title">Nuevos productos</h2>
          <p class="section-subtitle">Las piezas mas recientes de nuestra coleccion</p>
        </div>
        <div class="products-grid" v-if="!load_nuevos_productos && nuevos_productos.length">
          <router-link v-for="item in nuevos_productos" :key="item.id" :to="{ name: 'show-producto', params: { slug: item.slug } }" class="product-card">
            <div class="product-card-img">
              <span v-if="item.descuento" class="product-badge">Oferta</span>
              <img :src="$imgSrc(item.portada)" :alt="item.titulo" />
              <div class="product-card-overlay"><span>Ver producto &rarr;</span></div>
            </div>
            <div class="product-card-info">
              <span class="product-category">{{ item.categoria }}</span>
              <h3 class="product-name">{{ item.titulo }}</h3>
              <span class="product-price">{{ convertCurrency(item.precio) }}</span>
            </div>
          </router-link>
        </div>
        <div class="loading-state" v-if="load_nuevos_productos">
          <img src="/assets/media/idea.gif" alt="Cargando" style="width:60px;opacity:.6;">
          <p>Cargando productos...</p>
        </div>
        <div class="empty-state" v-if="!load_nuevos_productos && !nuevos_productos.length">
          <p>Proximamente nuevos productos ✨</p>
        </div>
        <div class="section-cta">
          <router-link to="/shop" class="btn-outline">Ver todos los productos</router-link>
        </div>
      </div>
    </section>

    <!-- COLECCIONES -->
    <section class="collections-section">
        <div class="section-header">
          <span class="section-label">Categorias</span>
          <h2 class="section-title">Colecciones</h2>
        </div>
        <div class="collections-grid">
          <router-link to="/shop?categoria=HOMBRE" class="collection-card">
            <img src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=700&auto=format&fit=crop&q=80" alt="Hombre" />
            <div class="collection-overlay">
              <span class="collection-tag">Coleccion</span>
              <h3>HOMBRE</h3>
              <span class="collection-link">Explorar &rarr;</span>
            </div>
          </router-link>
          <router-link to="/shop?categoria=MUJER" class="collection-card">
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&auto=format&fit=crop&q=80" alt="Mujer" />
            <div class="collection-overlay">
              <span class="collection-tag">Coleccion</span>
              <h3>MUJER</h3>
              <span class="collection-link">Explorar &rarr;</span>
            </div>
          </router-link>
          <router-link to="/shop?categoria=PERSONALIZADAS" class="collection-card">
            <img src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&auto=format&fit=crop&q=80" alt="Personalizadas" />
            <div class="collection-overlay">
              <span class="collection-tag">Exclusivo</span>
              <h3>PERSONALI&shy;ZADAS</h3>
              <span class="collection-link">Explorar &rarr;</span>
            </div>
          </router-link>
        </div>
    </section>

    <!-- ABOUT -->
    <section class="about-section">
      <div class="about-bg" style="background-image: url('https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1600')"></div>
      <div class="about-overlay"></div>
      <div class="container about-content">
        <div class="about-inner">
          <span class="about-label">QUIENES SOMOS</span>
          <h2 class="about-title">OVERSIZE MX</h2>
          <p class="about-text">Somos una marca mexicana especializada en playeras oversize de alta calidad. Cada pieza esta disenada para que te expreses con libertad y estilo unico. Ofrecemos tallas desde Chica hasta XXL y aceptamos disenos personalizados.</p>
          <router-link to="/shop" class="btn-hero-primary">Descubrir mas</router-link>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
* { box-sizing: border-box; }
a { text-decoration: none; color: inherit; }

.hero-section { position: relative; height: 92vh; min-height: 560px; max-height: 820px; display: flex; align-items: center; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center top; transform: scale(1.04); transition: transform 8s ease; }
.hero-section:hover .hero-bg { transform: scale(1); }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,0,0,.72) 0%, rgba(0,0,0,.35) 60%, rgba(0,0,0,.15) 100%); }
.hero-content { position: relative; z-index: 2; max-width: 620px; padding: 0 48px; color: #fff; }
.hero-badge { display: inline-block; background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.3); backdrop-filter: blur(8px); color: #fff; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 6px 16px; border-radius: 20px; margin-bottom: 24px; }
.hero-title { font-size: clamp(3.5rem, 8vw, 7rem); font-weight: 900; line-height: 1; letter-spacing: -2px; margin: 0 0 8px; text-transform: uppercase; }
.hero-title-accent { color: #a5b4fc; }
.hero-subtitle { font-size: 1.1rem; color: rgba(255,255,255,.75); margin: 0 0 36px; max-width: 420px; line-height: 1.6; }
.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
.btn-hero-primary { background: #fff; color: #111; font-weight: 700; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; padding: 14px 32px; border-radius: 4px; transition: background .2s, transform .15s; display: inline-block; }
.btn-hero-primary:hover { background: #e8e8e8; transform: translateY(-1px); }
.btn-hero-secondary { background: transparent; color: #fff; font-weight: 700; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; padding: 14px 32px; border-radius: 4px; border: 2px solid rgba(255,255,255,.6); transition: border-color .2s, transform .15s; }
.btn-hero-secondary:hover { border-color: #fff; transform: translateY(-1px); }
.hero-scroll-hint { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); z-index: 2; }
.hero-scroll-hint span { display: block; width: 1px; height: 48px; background: linear-gradient(to bottom, rgba(255,255,255,.7), transparent); margin: 0 auto; animation: scrollDown 1.6s ease-in-out infinite; }
@keyframes scrollDown { 0% { opacity: 0; transform: scaleY(0); transform-origin: top; } 50% { opacity: 1; transform: scaleY(1); } 100% { opacity: 0; transform: scaleY(0); transform-origin: bottom; } }

.values-section { background: #fff; border-bottom: 1px solid #f0f0f0; padding: 28px 0; }
.values-grid { display: flex; justify-content: center; flex-wrap: wrap; }
.value-item { display: flex; align-items: center; gap: 14px; padding: 16px 32px; border-right: 1px solid #f0f0f0; flex: 1; min-width: 200px; }
.value-item:last-child { border-right: none; }
.value-icon { font-size: 1.8rem; flex-shrink: 0; }
.value-item strong { display: block; font-size: 13px; font-weight: 700; color: #111; }
.value-item p { margin: 0; font-size: 12px; color: #888; }

.container { max-width: 1260px; margin: 0 auto; padding: 0 24px; }
.section-header { text-align: center; margin-bottom: 48px; }
.section-label { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #6366f1; margin-bottom: 10px; }
.section-title { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800; color: #111; margin: 0 0 10px; letter-spacing: -0.5px; }
.section-subtitle { color: #888; font-size: 1rem; margin: 0; }

.products-section { padding: 80px 0; background: #fafafa; }
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 28px; }
.product-card { display: block; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.07); transition: transform .22s ease, box-shadow .22s ease; }
.product-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(0,0,0,.12); }
.product-card-img { position: relative; overflow: hidden; height: 280px; background: #f5f5f5; }
.product-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s ease; }
.product-card:hover .product-card-img img { transform: scale(1.06); }
.product-badge { position: absolute; top: 12px; left: 12px; z-index: 2; background: #ef4444; color: #fff; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; }
.product-card-overlay { position: absolute; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity .22s; }
.product-card:hover .product-card-overlay { opacity: 1; }
.product-card-overlay span { color: #fff; font-weight: 700; font-size: 14px; letter-spacing: 1px; border: 2px solid #fff; padding: 10px 24px; border-radius: 4px; }
.product-card-info { padding: 16px 18px; }
.product-category { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px; }
.product-name { font-size: 14px; font-weight: 700; color: #111; margin: 4px 0 8px; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.product-price { font-size: 15px; font-weight: 800; color: #6366f1; }
.loading-state, .empty-state { text-align: center; padding: 60px 0; color: #aaa; }
.section-cta { text-align: center; margin-top: 48px; }
.btn-outline { display: inline-block; border: 2px solid #111; color: #111; font-weight: 700; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; padding: 13px 36px; border-radius: 4px; transition: background .2s, color .2s; }
.btn-outline:hover { background: #111; color: #fff; }

.collections-section { padding: 80px 0 100px; background: #f9f9f9; }
.section-header { padding: 0 40px; }
.collections-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 48px; padding: 0 40px; max-width: 1400px; margin-left: auto; margin-right: auto; }
.collections-stack { display: flex; flex-direction: column; gap: 6px; }
.collection-card { position: relative; overflow: hidden; border-radius: 12px; display: block; height: 360px; cursor: pointer; }
.collection-large { height: 100%; }
.collection-card img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; transition: transform .6s ease; }
.collection-card:hover img { transform: scale(1.07); }
.collection-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,.78) 0%, rgba(0,0,0,.18) 45%, transparent 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: 28px 28px 32px; transition: background .35s; }
.collection-card:hover .collection-overlay { background: linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.28) 50%, transparent 100%); }
.collection-tag { font-size: 10px; font-weight: 700; letter-spacing: 3.5px; text-transform: uppercase; color: #a5b4fc; margin-bottom: 8px; display: block; }
.collection-overlay h3 { font-size: clamp(1.8rem, 3vw, 2.8rem); font-weight: 900; letter-spacing: -0.5px; color: #fff; margin: 0 0 12px; text-transform: uppercase; line-height: 1; }
.collection-link { font-size: 12px; font-weight: 700; color: rgba(255,255,255,.65); letter-spacing: 1.5px; text-transform: uppercase; display: inline-flex; align-items: center; gap: 6px; transition: color .2s, gap .2s; }
.collection-card:hover .collection-link { color: #fff; gap: 10px; }
.collection-overlay::after { content: ''; position: absolute; bottom: 0; left: 28px; right: 28px; height: 2px; background: linear-gradient(90deg, #6366f1, #a5b4fc); transform: scaleX(0); transform-origin: left; transition: transform .35s ease; border-radius: 2px; }
.collection-card:hover .collection-overlay::after { transform: scaleX(1); }

.about-section { position: relative; padding: 36px 0; overflow: hidden; }
.about-bg { position: absolute; inset: 0; background-size: cover; background-position: center 30%; filter: brightness(.38); }
.about-overlay { position: absolute; inset: 0; background: linear-gradient(105deg, rgba(10,10,30,.85) 0%, rgba(0,0,0,.5) 55%, rgba(0,0,0,.1) 100%); }
.about-content { position: relative; z-index: 2; }
.about-inner { max-width: 500px; color: #fff; }
.about-label { display: inline-flex; align-items: center; gap: 8px; font-size: 9px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #a5b4fc; margin-bottom: 10px; }
.about-label::before { content: ''; display: block; width: 24px; height: 2px; background: #6366f1; border-radius: 1px; }
.about-title { font-size: clamp(1.2rem, 2vw, 1.8rem); font-weight: 900; letter-spacing: -1px; margin: 0 0 12px; text-transform: uppercase; line-height: 1; }
.about-text { font-size: .82rem; line-height: 1.55; color: rgba(255,255,255,.75); margin-bottom: 18px; max-width: 380px; }
.about-inner .btn-hero-primary { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,.5); }
.about-inner .btn-hero-primary:hover { background: #fff; color: #111; border-color: #fff; }

@media (max-width: 768px) {
  .hero-content { padding: 0 24px; }
  .hero-section { height: 80vh; max-height: 640px; }
  .values-grid { flex-direction: column; }
  .value-item { border-right: none; border-bottom: 1px solid #f0f0f0; padding: 14px 24px; }
  .value-item:last-child { border-bottom: none; }
  .collections-grid { grid-template-columns: 1fr; padding: 0 20px; gap: 16px; }
  .collection-card { height: 320px !important; }
  .about-inner { max-width: 100%; }
}
@media (max-width: 480px) {
  .hero-actions { flex-direction: column; }
  .btn-hero-primary, .btn-hero-secondary { text-align: center; }
  .collections-stack { flex-direction: column; }
  .collection-card { height: 200px !important; }
}
</style>

<script>
import axios from 'axios';
import currency_formatter from 'currency-formatter';
import { useHead } from '@vueuse/head';

export default {
  name: 'HomeView',
  setup() {
    useHead({
      title: 'OVERSIZE MX | Playeras Oversize para Hombre y Mujer en México',
      meta: [
        { name: 'description', content: 'Descubre la colección de playeras oversize para hombre y mujer en México. Diseños únicos, tallas S a XXL, envío a todo el país.' },
        { property: 'og:title', content: 'OVERSIZE MX | Playeras Oversize en México' },
        { property: 'og:description', content: 'Playeras oversize con diseños únicos para hombre y mujer. Envío a todo México.' },
        { property: 'og:url', content: 'https://oversizemx.pages.dev/' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:title', content: 'OVERSIZE MX | Playeras Oversize en México' },
        { name: 'twitter:description', content: 'Playeras oversize con diseños únicos para hombre y mujer. Envío a todo México.' },
      ],
    });
  },
  data() {
    return {
      nuevos_productos: [],
      load_nuevos_productos: true,
      productos_recomendados: [],
      load_productos_recomendados: true,
    };
  },
  methods: {
    init_nuevos_productos() {
      this.load_nuevos_productos = true;
      axios.get(this.$url + '/obtener_nuevos_productos', {
        headers: { 'Content-Type': 'application/json' }
      }).then(result => {
        this.nuevos_productos = result.data;
        this.load_nuevos_productos = false;
      }).catch(() => { this.load_nuevos_productos = false; });
    },
    init_productos_recomendados() {
      axios.get(this.$url + '/obtener_productos_recomendados', {
        headers: { 'Content-Type': 'application/json' }
      }).then(result => {
        this.productos_recomendados = result.data;
        this.load_productos_recomendados = false;
      }).catch(() => { this.load_productos_recomendados = false; });
    },
    convertCurrency(number) {
      return currency_formatter.format(number, { code: 'MXN' });
    }
  },
  beforeMount() {
    this.init_nuevos_productos();
    this.init_productos_recomendados();
  },
};
</script>