<template>
    <div class="mc-page">

        <!-- ── Header ── -->
        <section class="mc-header">
            <div class="container">
                <ol class="mc-breadcrumb">
                    <li><router-link to="/">Home</router-link></li>
                    <li class="sep">/</li>
                    <li class="active">Mis compras</li>
                </ol>
                <h1 class="mc-title">Mis compras</h1>
                <p class="mc-sub">Historial completo de tus pedidos</p>
            </div>
        </section>

        <!-- ── Content ── -->
        <section class="mc-content">
            <div class="container">
                <div class="mc-grid">

                    <!-- ── Orders ── -->
                    <div class="mc-orders">

                        <!-- Loading -->
                        <div v-if="cargando" class="mc-empty">
                            <div class="mc-spinner"></div>
                            <p>Cargando pedidos…</p>
                        </div>

                        <!-- Empty state -->
                        <div v-else-if="ventas.length === 0" class="mc-empty">
                            <svg viewBox="0 0 64 64" fill="none" stroke="#ccc" stroke-width="2">
                                <rect x="8" y="8" width="48" height="56" rx="4"/>
                                <path d="M20 8v4a12 12 0 0 0 24 0V8"/>
                                <line x1="20" y1="32" x2="44" y2="32"/>
                                <line x1="20" y1="42" x2="36" y2="42"/>
                            </svg>
                            <h4>Sin pedidos aún</h4>
                            <p>Cuando realices una compra aparecerá aquí.</p>
                            <router-link to="/productos" class="mc-btn-shop">Ir a la tienda</router-link>
                        </div>

                        <!-- Order cards -->
                        <div v-else class="mc-card-list">
                            <div class="mc-card" v-for="item in ventas" :key="item._id">
                                <div class="mc-card-top">
                                    <span class="mc-order-num">
                                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 2h12a1 1 0 0 1 1 1v16l-3-2-3 2-3-2-3 2V3a1 1 0 0 1 1-1z"/></svg>
                                        # {{ item.serie.toString().padStart(6, '000000') }}
                                    </span>
                                    <span class="mc-estado" :class="estadoClass(item.estado)">{{ item.estado }}</span>
                                </div>
                                <div class="mc-card-body">
                                    <div class="mc-info-row">
                                        <div class="mc-info-item">
                                            <span class="mc-info-label">Fecha</span>
                                            <span class="mc-info-val">{{ convertDate(item.createdAt) }}</span>
                                        </div>
                                        <div class="mc-info-item">
                                            <span class="mc-info-label">Envío</span>
                                            <span class="mc-info-val">{{ convertCurrency(item.envio) }}</span>
                                        </div>
                                        <div class="mc-info-item">
                                            <span class="mc-info-label">Total</span>
                                            <span class="mc-info-val mc-total">{{ convertCurrency(item.total + item.envio) }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="mc-card-foot">
                                    <router-link :to="{ name: 'venta', params: { id: item._id } }" class="mc-btn-detail">
                                        Ver detalles
                                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10h12M11 5l5 5-5 5"/></svg>
                                    </router-link>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- ── Sidebar ── -->
                    <aside class="mc-sidebar">
                        <SiderCliente />
                    </aside>

                </div>
            </div>
        </section>

    </div>
</template>

<script>
import SiderCliente from '@/components/SidebarCliente.vue';
import axios from 'axios';
import moment from 'moment';
import currency_formatter from 'currency-formatter';

export default {
    name: 'VentaIndexApp',
    components: { SiderCliente },
    data() {
        return {
            ventas: [],
            cargando: true,
        };
    },
    beforeMount() {
        this.init_ventas();
    },
    methods: {
        init_ventas() {
            axios.get(this.$url + '/obtener_ventas_cliente', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.$store.state.token,
                },
            }).then((result) => {
                this.ventas = result.data;
            }).catch(() => {
                this.ventas = [];
            }).finally(() => {
                this.cargando = false;
            });
        },
        convertDate(val) {
            return moment(val).format('DD MMM YYYY');
        },
        convertCurrency(number) {
            return currency_formatter.format(number, { code: 'MXN' });
        },
        estadoClass(estado) {
            const e = (estado || '').toLowerCase();
            if (e === 'entregado' || e === 'completado') return 'estado-ok';
            if (e === 'cancelado')                        return 'estado-cancel';
            if (e === 'enviado' || e === 'en camino')     return 'estado-ship';
            return 'estado-pending';
        },
    },
};
</script>

<style scoped>
/* ── Page wrapper ── */
.mc-page {
    background: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 60px;
}

/* ── Header ── */
.mc-header {
    margin-top: 8rem;
    padding: 40px 0 32px;
    background: #fff;
    border-bottom: 1px solid #ebebeb;
    text-align: center;
}
.mc-breadcrumb {
    list-style: none;
    padding: 0;
    margin: 0 0 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #999;
}
.mc-breadcrumb a { color: #555; text-decoration: none; }
.mc-breadcrumb a:hover { color: #111; }
.mc-breadcrumb .sep { color: #ccc; }
.mc-breadcrumb .active { color: #111; font-weight: 600; }
.mc-title {
    margin: 0 0 8px;
    font-size: 28px;
    font-weight: 800;
    color: #111;
    letter-spacing: -0.5px;
}
.mc-sub {
    margin: 0;
    font-size: 14px;
    color: #888;
}

/* ── Content layout ── */
.mc-content { padding-top: 36px; }
.mc-grid {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 28px;
    align-items: start;
}
@media (max-width: 900px) {
    .mc-grid {
        grid-template-columns: 1fr;
    }
    .mc-sidebar { order: -1; }
}

/* ── Empty / loading ── */
.mc-empty {
    background: #fff;
    border: 1px solid #ebebeb;
    border-radius: 14px;
    padding: 60px 24px;
    text-align: center;
    color: #aaa;
}
.mc-empty svg {
    width: 72px;
    height: 72px;
    margin-bottom: 16px;
}
.mc-empty h4 {
    margin: 0 0 8px;
    font-size: 18px;
    font-weight: 700;
    color: #555;
}
.mc-empty p {
    margin: 0 0 20px;
    font-size: 14px;
    color: #aaa;
}
.mc-btn-shop {
    display: inline-block;
    padding: 10px 24px;
    background: #111;
    color: #fff;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: background .15s;
}
.mc-btn-shop:hover { background: #333; }

/* ── Spinner ── */
.mc-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #eee;
    border-top-color: #111;
    border-radius: 50%;
    animation: spin .7s linear infinite;
    margin: 0 auto 16px;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Card list ── */
.mc-card-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

/* ── Order card ── */
.mc-card {
    background: #fff;
    border: 1px solid #ebebeb;
    border-radius: 14px;
    overflow: hidden;
    transition: box-shadow .2s;
}
.mc-card:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,.07);
}

/* Card top: order# + estado */
.mc-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #f5f5f5;
    background: #fafafa;
}
.mc-order-num {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 14px;
    font-weight: 700;
    color: #111;
}
.mc-order-num svg { width: 16px; height: 16px; color: #555; flex-shrink: 0; }

/* Estado badges */
.mc-estado {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .4px;
}
.estado-ok      { background: #e6f9f0; color: #1a8a52; }
.estado-cancel  { background: #fff0f0; color: #c0392b; }
.estado-ship    { background: #e8f3ff; color: #1a5fb4; }
.estado-pending { background: #fff8e6; color: #b07d00; }

/* Card body: info row */
.mc-card-body { padding: 18px 20px; }
.mc-info-row {
    display: flex;
    gap: 28px;
    flex-wrap: wrap;
}
.mc-info-item {
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.mc-info-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .5px;
    color: #aaa;
}
.mc-info-val {
    font-size: 14px;
    font-weight: 500;
    color: #333;
}
.mc-total {
    font-size: 16px;
    font-weight: 800;
    color: #111;
}

/* Card footer */
.mc-card-foot {
    padding: 14px 20px;
    border-top: 1px solid #f5f5f5;
    display: flex;
    justify-content: flex-end;
}
.mc-btn-detail {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 20px;
    background: #111;
    color: #fff;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    transition: background .15s;
}
.mc-btn-detail:hover { background: #333; color: #fff; }
.mc-btn-detail svg { width: 15px; height: 15px; flex-shrink: 0; }
</style>