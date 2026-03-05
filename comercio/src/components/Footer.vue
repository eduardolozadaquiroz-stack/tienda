<template>
  <footer class="main-footer">
   <!-- Services block-->
   <div class="text-dark-700 py-4" style="background:#f9f9f9; border-bottom: 1px solid #eee;">
     <div class="container">
       <div class="row">
         <div class="col-lg-4 service-column">
           <!-- <svg class="svg-icon service-icon">
             <use xlink:href="#delivery-time-1"> </use>
           </svg> -->
           <img class="svg-icon service-icon" src="/assets/media/camion.gif" alt="">
           <div class="service-text">
             <h6 class="text-uppercase">ENVÍO Y DEVOLUCIÓN GRATIS</h6>
             <p class="text-muted fw-light text-sm mb-0">Envío gratis a partir de $300</p>
           </div>
         </div>
         <div class="col-lg-4 service-column">
           <img class="svg-icon service-icon" src="/assets/media/devolucion-de-dinero.gif" alt="">
           <div class="service-text">
             <h6 class="text-uppercase">GARANTÍA DE DEVOLUCIÓN DE DINERO</h6>
             <p class="text-muted fw-light text-sm mb-0">30 días de garantía de devolución de dinero</p>
           </div>
         </div>
         <div class="col-lg-4 service-column">
           <img class="svg-icon service-icon" src="/assets/media/apoyo-tecnico.gif" alt="">
           <div class="service-text">
             <h6 class="text-uppercase">800-124-6000</h6>
             <p class="text-muted fw-light text-sm mb-0">Soporte disponible 24/7</p>
           </div>
         </div>
       </div>
     </div>
   </div>
   <!-- Main block - menus, subscribe form-->
   <div class="py-4 text-muted" style="background-color: #111 !important;"> 
     <div class="container">
       <div class="row">
         <div class="col-lg-4 mb-5 mb-lg-0">
           <div class="fw-bold text-uppercase text-lg text-white mb-3" style="letter-spacing:2px; font-size:15px;">👕 OVERSIZE MX<span style="color:#6366f1">.</span></div>
           <p class="text-white" style="color:rgba(255,255,255,.6) !important; font-size:13px;">Marca mexicana de playeras oversize con diseños únicos y personalizados. Tallas S, M, G, XL y XXL. Envíos a todo México.</p>
           <ul class="list-inline">
             <li class="list-inline-item">
               <a class="text-muted text-primary-hover" href="https://www.flaticon.es/uicons?word=facebook" target="_blank" title="Facebook">
                 <img src="/assets/media/facebook.png" style="width:20px">
               </a>
             </li>
             <li class="list-inline-item">
               <a class="text-muted text-primary-hover" href="https://www.flaticon.es/uicons?word=facebook" target="_blank" title="Twitter">
                 <img src="/assets/media/twitter.png" style="width:20px">
               </a>
             </li>
             <li class="list-inline-item">
               <a class="text-muted text-primary-hover" href="https://www.flaticon.es/uicons?word=facebook" target="_blank" title="Instagram">
                 <img src="/assets/media/instagram.png" style="width:20px">
               </a>
             </li>
           </ul>
         </div>
         <div class="col-lg-2 col-md-6 mb-5 mb-lg-0">
           <h6 class="text-uppercase mb-3" style="color:#6366f1; font-size:11px; letter-spacing:3px;">Categorías</h6>
           <ul class="list-unstyled">
             <li> <a class="text-white" href="/shop?categoria=HOMBRE">HOMBRE</a></li>
             <li> <a class="text-white" href="/shop?categoria=MUJER">MUJER</a></li>
             <li> <a class="text-white" href="/shop?categoria=PERSONALIZADAS">PERSONALIZADAS</a></li>
           </ul>
         </div>
         <div class="col-lg-2 col-md-6 mb-5 mb-lg-0">
           <h6 class="text-uppercase mb-3" style="color:#6366f1; font-size:11px; letter-spacing:3px;">Soporte</h6>
           <ul class="list-unstyled">
             <li> <a class="text-white" href="/login">INICIAR SESIÓN</a></li>
             <li> <a class="text-white" href="/login">REGISTRAR</a></li>
           </ul>
         </div>
         <div class="col-lg-4">
           <h6 class="text-uppercase mb-3" style="color:#6366f1; font-size:11px; letter-spacing:3px;">Quejas y Sugerencias</h6>
           <p class="mb-3" style="color:rgba(255,255,255,.5); font-size:13px;"> Aqui pueden enviar sus quejas o sugerencias</p>
           <form action="#" id="newsletter-form">
             <div class="input-group mb-3">
               <input class="form-control bg-transparent border-secondary border-end-0" type="email" placeholder="Tu correo electrónico" aria-label="Your Email Address" style="    border-color: #ffffff !important;color:white !important">
               <div class="input-group-append" >
                 <button class="btn border-start-0" type="submit" style="    border-color: #ffffff !important;">
                   <img src="/assets/media/paper-plane.png" style="width: 18px" alt="">
                 </button>
               </div>
             </div>
           </form>
         </div>
       </div>
     </div>
   </div>
   <!-- Copyright section of the footer-->
   <div class="py-3 fw-light text-gray-300" style="background-color: #0a0a0a !important;">
     <div class="container">
       <div class="row align-items-center">
         <div class="col-md-6 text-center text-md-start">
           <p class="mb-md-0">&copy; {{year}} Mi tienda.  Todos los derechos reservados.</p>
         </div>
         <div class="col-md-6">
           <ul class="list-inline mb-0 mt-2 mt-md-0 text-center text-md-end">
             <li class="list-inline-item"><img class="w-2rem" src="https://d19m59y37dris4.cloudfront.net/sell/2-0/img/visa.svg" alt="..."></li>
             <li class="list-inline-item"><img class="w-2rem" src="https://d19m59y37dris4.cloudfront.net/sell/2-0/img/mastercard.svg" alt="..."></li>
             <li class="list-inline-item"><img class="w-2rem" src="https://d19m59y37dris4.cloudfront.net/sell/2-0/img/paypal.svg" alt="..."></li>
             <li class="list-inline-item"><img class="w-2rem" src="https://d19m59y37dris4.cloudfront.net/sell/2-0/img/western-union.svg" alt="..."></li>
           </ul>
         </div>
       </div>
     </div>
   </div>
 </footer>
</template>

<script>
export default {
name: 'Footer',
data() {
 return {
   year: new Date().getFullYear(),
 }
},
}
</script>
