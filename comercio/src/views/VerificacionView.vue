<template>
    <div>
        <!-- FAILURE -->
        <section class="hero" v-if="estado == 'failure'" style="margin-top: 8rem !important;">
            <div class="container text-center">
                <ol class="breadcrumb justify-content-center">
                    <li class="breadcrumb-item"><router-link to="/">Inicio</router-link></li>
                </ol>
                <div class="hero-content pb-5">
                    <div class="mb-4" style="font-size:64px;">❌</div>
                    <h1 class="mb-3">Pago rechazado</h1>
                    <p class="lead text-muted mb-4">Tu pago no pudo procesarse. Puedes intentarlo de nuevo con otra tarjeta o método de pago.</p>
                    <router-link to="/checkout" class="btn btn-dark me-2">Intentar de nuevo</router-link>
                    <router-link to="/cart" class="btn btn-outline-dark">Ver carrito</router-link>
                </div>
            </div>
        </section>

        <!-- PENDING -->
        <section class="hero" v-if="estado == 'pending'" style="margin-top: 8rem !important;">
            <div class="container text-center">
                <ol class="breadcrumb justify-content-center">
                    <li class="breadcrumb-item"><router-link to="/">Inicio</router-link></li>
                </ol>
                <div class="hero-content pb-5">
                    <div class="mb-4" style="font-size:64px;">⏳</div>
                    <h1 class="mb-3">Pago pendiente</h1>
                    <p class="lead text-muted mb-4">Tu pago está siendo procesado. Te notificaremos por correo cuando se confirme.</p>
                    <router-link to="/" class="btn btn-dark">Volver al inicio</router-link>
                </div>
            </div>
        </section>

        <!-- SUCCESS procesando -->
        <section class="hero" v-if="estado == 'success' && !msm_error && !venta_creada" style="margin-top: 8rem !important;">
            <div class="container text-center">
                <div class="hero-content pb-5">
                    <img src="/assets/media/reloj.gif" style="width: 80px;" class="mb-4">
                    <h1 class="mb-3">Validando pago...</h1>
                    <p class="text-muted">Por favor espera, estamos confirmando tu pedido.</p>
                </div>
            </div>
        </section>

        <!-- SUCCESS error -->
        <section class="hero" v-if="estado == 'success' && msm_error" style="margin-top: 8rem !important;">
            <div class="container text-center">
                <ol class="breadcrumb justify-content-center">
                    <li class="breadcrumb-item"><router-link to="/">Inicio</router-link></li>
                </ol>
                <div class="hero-content pb-5">
                    <div class="mb-4" style="font-size:64px;">⚠️</div>
                    <h1 class="mb-3">{{ msm_error }}</h1>
                    <p class="lead text-muted mb-4">Si tu pago fue cobrado, contáctanos con el número de transacción.</p>
                    <router-link to="/" class="btn btn-dark">Volver al inicio</router-link>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'VerificacionView',
    data() {
        return {
            estado: '',
            payment_id: '',
            pago: {},
            direccion: '',
            msm_error: '',
            venta: {},
            detalles: [],
            total: 0,
            carrito: [],
            venta_creada: false
        }
    },
    beforeMount() {
        this.estado = this.$route.params.estado;

        // Si no es success, no hacer nada más
        if (this.estado !== 'success') return;

        this.payment_id = this.$route.query.payment_id;

        let user_data = JSON.parse(this.$store.state.user);
   
        this.venta.transaccion = this.payment_id;
        this.venta.envio = this.$envio;
        this.venta.cliente = user_data._id;

        if(this.$route.params.direccion){
            this.direccion = this.$route.params.direccion;
            this.venta.direccion = this.direccion;
        }else{
            this.msm_error = 'No se obtuvo el código de la dirección';
            return;
        }

        // Esperar carrito antes de verificar el pago para evitar crear_venta con detalles vacíos
        this.init_carrito().then(() => {
            this.init_payment(this.payment_id);
        });
    },
    methods: {
        init_carrito(){
            return axios.get(this.$url+'/obtener_carrito_cliente',{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.$store.state.token
                }
            }).then((result)=>{
                this.total = 0;
                for(var item of result.data.carrito_general){
                    let subtotal = item.producto.precio * item.cantidad;
                    this.total = this.total+ subtotal;
                    this.detalles.push({
                        subtotal: subtotal,
                        precio_unidad: item.producto.precio,
                        cantidad: item.cantidad,
                        cliente: this.venta.cliente,
                        producto: item.producto._id,
                        variedad: item.variedad._id,
                        personalizacion: item.personalizacion || '',
                        imagen_diseno: item.imagen_diseno || ''
                    });
                }
                this.venta.total = this.total;
                this.carrito = result.data.carrito_general;
            });
        },
        validar_venta(payment_id){
            axios.get(this.$url+'/validar_payment_id_venta/'+payment_id,{
                headers: {
                    'Content-Type': 'application/json',
                     'Authorization': this.$store.state.token
                }
            }).then((result)=>{
               if(result.data.length >= 1){
                    this.msm_error = 'El pago ya fué asignado a otra venta';
               }else if(result.data.length == 0){
                    this.crear_venta();
               }
            });
        },

        crear_venta(){
            this.venta.detalles = this.detalles;
            axios.post(this.$url+'/crear_venta_cliente',this.venta,{
                headers: {
                    'Content-Type': 'application/json',
                     'Authorization': this.$store.state.token
                }
            }).then((result)=>{
                this.venta_creada = true;
                this.$router.push({name:'venta',params:{id:result.data._id}});
                this.$socket.emit('send_cart',true);
            });
        },
        init_payment(payment_id){
            // Verificación del pago a través del backend propio — el token de MP nunca está en el frontend
            axios.get(this.$url + '/verificar_pago_mp/' + payment_id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.$store.state.token
                }
            }).then((result) => {
                this.pago = result.data;
                if (this.pago.status === 'approved') {
                    this.validar_venta(payment_id);
                } else {
                    this.msm_error = 'El pago no fue aprobado. Estado: ' + this.pago.status;
                }
            }).catch(() => {
                this.msm_error = 'No se pudo verificar el pago. Intenta de nuevo.';
            });
        }
    },
}
</script>