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
                    <span style="background:#5c7cfa;color:#fff;border-radius:20px;padding:2px 12px;font-weight:600;">📂 Categorías</span>
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
                                    <h6 class="header-pretitle">Control</h6>
                                    <h1 class="header-title"><b>Categorías</b></h1>
                                </div>
                                <div class="col-auto">
                                    <button v-if="!section_form" class="btn btn-dark btn-sm" style="color:#fff!important" v-on:click="section_form = true;">
                                        <i class="fe fe-plus me-1"></i> Nueva categoría
                                    </button>
                                    <button v-if="section_form" class="btn btn-secondary btn-sm" v-on:click="section_form = false;">
                                        <i class="fe fe-x me-1"></i> Cancelar
                                    </button>
                                </div>
                                </div> <!-- / .row -->
                            </div>
                        </div>

                        <!-- GUÍA DE USO -->
                        <div class="alert mb-4" style="background:linear-gradient(135deg,#e7f5ff,#d0ebff);border:1px solid #74c0fc;border-radius:12px;padding:18px 22px;">
                            <div class="d-flex align-items-start gap-3">
                                <div style="font-size:28px;line-height:1.2">📂</div>
                                <div>
                                    <h5 class="mb-1" style="color:#1864ab;font-weight:700">¿Cómo funcionan las categorías?</h5>
                                    <p class="mb-2" style="color:#495057;font-size:14px">
                                        Las categorías organizan los productos de la tienda. Cada categoría puede tener <b>subcategorías</b> para clasificar mejor los productos.
                                    </p>
                                    <div class="d-flex flex-wrap gap-2">
                                        <span style="background:#fff;border:1px solid #74c0fc;border-radius:8px;padding:4px 12px;font-size:13px;color:#1864ab;"><b>1.</b> Crea una categoría (ej: "Aceites")</span>
                                        <span style="background:#fff;border:1px solid #74c0fc;border-radius:8px;padding:4px 12px;font-size:13px;color:#1864ab;"><b>2.</b> Agrega subcategorías (ej: "Sintético")</span>
                                        <span style="background:#fff;border:1px solid #74c0fc;border-radius:8px;padding:4px 12px;font-size:13px;color:#1864ab;"><b>3.</b> Publícala para que aparezca en la tienda</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- FORMULARIO NUEVA CATEGORÍA -->
                        <div class="card mb-4" v-if="section_form" style="border:2px solid #228be6;border-radius:12px;">
                            <div class="card-body" style="border-radius:10px;">
                                <h5 class="mb-3" style="color:#1864ab;"><i class="fe fe-folder-plus me-2"></i><b>Nueva categoría</b></h5>
                                <div class="input-group">
                                    <input type="text" class="form-control" placeholder="Nombre de la categoría (ej: Aceites de motor)" v-model="nueva_categoria">
                                    <button class="btn btn-primary" v-on:click="crear_categoria()">
                                        <i class="fe fe-check me-1"></i> Crear categoría
                                    </button>
                                </div>
                                <small class="text-muted mt-2 d-block">
                                    <i class="fe fe-info me-1"></i> Elige un nombre descriptivo. Después podrás añadir subcategorías a esta categoría.
                                </small>
                            </div>
                        </div>

                        <!-- LISTA DE CATEGORÍAS -->
                        <div class="card" style="border-radius:12px;overflow:hidden;">
                            <div class="card-header d-flex align-items-center justify-content-between" style="background:#f8f9fa;">
                                <h4 class="mb-0"><b>Categorías registradas</b></h4>
                                <span class="badge bg-secondary" style="font-size:13px;">{{ categorias.length }} total</span>
                            </div>

                            <div v-if="categorias.length === 0" class="text-center py-5">
                                <div style="font-size:48px;">📂</div>
                                <h4 class="mt-3 text-muted">Aún no hay categorías</h4>
                                <p class="text-muted mb-3">Usa el botón <b>"Nueva categoría"</b> para comenzar.</p>
                            </div>

                            <div class="card-body p-0" v-if="categorias.length > 0">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item py-3 px-4" v-for="item in categorias" :key="item.categoria._id">
                                        <div class="row align-items-center">
                                            <div class="col-auto">
                                                <div style="width:46px;height:46px;border-radius:12px;background:linear-gradient(135deg,#228be6,#1864ab);display:flex;align-items:center;justify-content:center;">
                                                    <i class="fe fe-folder" style="color:#fff;font-size:20px;"></i>
                                                </div>
                                            </div>
                                            <div class="col ms-n1">
                                                <h4 class="mb-1" style="font-weight:600;">
                                                    {{ item.categoria.titulo }}
                                                    <small class="text-muted ms-2" style="font-size:13px;font-weight:400;">({{ item.nproductos }} producto{{ item.nproductos !== 1 ? 's' : '' }})</small>
                                                </h4>
                                                <div class="d-flex gap-2 flex-wrap">
                                                    <span v-if="item.categoria.estado" style="font-size:12px;color:#2b8a3e;font-weight:600;">● Publicada — visible en la tienda</span>
                                                    <span v-if="!item.categoria.estado" style="font-size:12px;color:#c92a2a;font-weight:600;">● Oculta — no aparece en la tienda</span>
                                                    <span v-if="item.subcategorias && item.subcategorias.length > 0" style="font-size:12px;color:#868e96;background:#f1f3f5;padding:2px 8px;border-radius:20px;">
                                                        {{ item.subcategorias.length }} subcategoría{{ item.subcategorias.length !== 1 ? 's' : '' }}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="col-auto d-flex gap-2 flex-wrap">
                                                <button v-if="item.categoria.estado" class="btn btn-sm btn-danger" style="border-radius:8px;font-size:13px;"
                                                    @click="abrirModalEstado(item.categoria._id, item.categoria.estado, item.categoria.titulo)">
                                                    <i class="fe fe-eye-off me-1"></i> Ocultar
                                                </button>
                                                <button v-if="!item.categoria.estado" class="btn btn-sm btn-success" style="border-radius:8px;font-size:13px;color:#fff!important;"
                                                    @click="abrirModalEstado(item.categoria._id, item.categoria.estado, item.categoria.titulo)">
                                                    <i class="fe fe-eye me-1"></i> Publicar
                                                </button>
                                                <button class="btn btn-sm btn-outline-secondary" style="border-radius:8px;font-size:13px;" @click="openInputGroup(item.categoria._id)">
                                                    <i class="fe fe-plus me-1"></i> + Subcategoría
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Agregar subcategoría -->
                                        <div class="mt-3 hide_input content_group" :id="'content_'+item.categoria._id"
                                            style="background:#f8f9fa;border-radius:8px;padding:12px;">
                                            <small class="text-muted d-block mb-2"><i class="fe fe-info me-1"></i> Escribe el nombre de la nueva subcategoría para "{{ item.categoria.titulo }}"</small>
                                            <div class="input-group">
                                                <input type="text" class="form-control" placeholder="Nombre de la subcategoría (ej: Sintético 5W30)" v-model="nueva_subcategoria">
                                                <button class="btn btn-dark" v-on:click="crear_subcategoria()" style="color:#fff!important;">
                                                    <i class="fe fe-check me-1"></i> Agregar
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Lista de subcategorías -->
                                        <div v-if="item.subcategorias && item.subcategorias.length > 0" class="mt-3">
                                            <small class="text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.5px;font-weight:600;">Subcategorías</small>
                                            <ul class="list-group mt-1">
                                                <li v-for="subitem in item.subcategorias" :key="subitem._id"
                                                    class="list-group-item d-flex justify-content-between align-items-center"
                                                    style="font-size:13px;padding:8px 14px;border-radius:6px;margin-bottom:3px;border:1px solid #e9ecef;">
                                                    <span><i class="fe fe-tag me-2" style="color:#868e96;"></i>{{ subitem.titulo }}</span>
                                                    <button class="btn btn-sm btn-outline-danger" style="border-radius:6px;font-size:12px;padding:2px 10px;"
                                                        @click="abrirModalEliminarSub(subitem._id, subitem.titulo)">
                                                        <i class="fe fe-trash-2 me-1"></i> Quitar
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL: Cambiar estado de categoría -->
    <div v-if="modalEstado.visible" style="position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;" @click.self="modalEstado.visible=false">
        <div style="background:#fff;border-radius:16px;overflow:hidden;width:100%;max-width:420px;box-shadow:0 20px 60px rgba(0,0,0,.25);">
            <div :style="modalEstado.estadoActual ? 'background:linear-gradient(135deg,#c92a2a,#e03131);padding:24px;text-align:center;' : 'background:linear-gradient(135deg,#2b8a3e,#37b24d);padding:24px;text-align:center;'">
                <div style="font-size:36px;margin-bottom:8px;">{{ modalEstado.estadoActual ? '🙈' : '👁️' }}</div>
                <h4 class="mb-0" style="color:#fff;font-weight:700;">{{ modalEstado.estadoActual ? 'Ocultar categoría' : 'Publicar categoría' }}</h4>
            </div>
            <div style="padding:20px 24px 24px;">
                <p style="color:#495057;text-align:center;margin-bottom:16px;">
                    ¿Deseas <b v-if="modalEstado.estadoActual" style="color:#c92a2a">ocultar</b><b v-if="!modalEstado.estadoActual" style="color:#2b8a3e">publicar</b> la categoría <b>"{{ modalEstado.titulo }}"</b>?
                </p>
                <div :style="modalEstado.estadoActual ? 'background:#fff5f5;border:1px solid #ffc9c9;color:#c92a2a;border-radius:8px;padding:10px 14px;font-size:13px;margin-bottom:16px;' : 'background:#ebfbee;border:1px solid #b2f2bb;color:#2b8a3e;border-radius:8px;padding:10px 14px;font-size:13px;margin-bottom:16px;'">
                    <span v-if="modalEstado.estadoActual">⚠️ Al ocultarla, los clientes no verán esta categoría ni sus productos en la tienda.</span>
                    <span v-if="!modalEstado.estadoActual">✅ Al publicarla, será visible para todos los clientes en la tienda.</span>
                </div>
                <div class="d-flex gap-2 justify-content-end">
                    <button class="btn btn-secondary btn-sm" @click="modalEstado.visible=false" style="border-radius:8px;">Cancelar</button>
                    <button class="btn btn-sm" :style="modalEstado.estadoActual ? 'background:#c92a2a;color:#fff;border-radius:8px;' : 'background:#2b8a3e;color:#fff;border-radius:8px;'"
                        @click="confirmarCambioEstado()">
                        {{ modalEstado.estadoActual ? 'Sí, ocultar' : 'Sí, publicar' }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL: Eliminar subcategoría -->
    <div v-if="modalEliminarSub.visible" style="position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;" @click.self="modalEliminarSub.visible=false">
        <div style="background:#fff;border-radius:16px;overflow:hidden;width:100%;max-width:400px;box-shadow:0 20px 60px rgba(0,0,0,.25);">
            <div style="background:linear-gradient(135deg,#c92a2a,#e03131);padding:24px;text-align:center;">
                <div style="font-size:36px;margin-bottom:8px;">🗑️</div>
                <h4 class="mb-0" style="color:#fff;font-weight:700;">Eliminar subcategoría</h4>
            </div>
            <div style="padding:20px 24px 24px;">
                <p style="color:#495057;text-align:center;margin-bottom:16px;">
                    ¿Eliminar la subcategoría <b>"{{ modalEliminarSub.titulo }}"</b>?
                </p>
                <div style="background:#fff5f5;border:1px solid #ffc9c9;color:#c92a2a;border-radius:8px;padding:10px 14px;font-size:13px;margin-bottom:16px;">
                    ⚠️ Esta acción no se puede deshacer. Los productos con esta subcategoría asignada quedarán sin subcategoría.
                </div>
                <div class="d-flex gap-2 justify-content-end">
                    <button class="btn btn-secondary btn-sm" @click="modalEliminarSub.visible=false" style="border-radius:8px;">Cancelar</button>
                    <button class="btn btn-sm" style="background:#c92a2a;color:#fff;border-radius:8px;" @click="confirmarEliminarSub()">
                        <i class="fe fe-trash-2 me-1"></i> Sí, eliminar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.hide_input { display: none; }
.show_input { display: block; }
</style>

<script>
import Sidebar from '@/components/Sidebar.vue';
import TopNav from '@/components/TopNav.vue';
import axios from 'axios';
import $ from 'jquery';

export default {
    name: 'IndexCategoriaApp',
    data() {
        return {
            section_form: false,
            nueva_categoria: '',
            nueva_subcategoria: '',
            idcategoria: '',
            categorias: [],
            modalEstado: { visible: false, id: null, estadoActual: false, titulo: '' },
            modalEliminarSub: { visible: false, id: null, titulo: '' }
        };
    },
    methods: {
        abrirModalEstado(id, estadoActual, titulo) {
            this.modalEstado = { visible: true, id, estadoActual, titulo };
        },
        confirmarCambioEstado() {
            this.cambiar_estado(this.modalEstado.id, this.modalEstado.estadoActual);
            this.modalEstado.visible = false;
        },
        abrirModalEliminarSub(id, titulo) {
            this.modalEliminarSub = { visible: true, id, titulo };
        },
        confirmarEliminarSub() {
            this.eliminar_subcategoria(this.modalEliminarSub.id);
            this.modalEliminarSub.visible = false;
        },
        crear_categoria() {
            if (this.nueva_categoria) {
                axios.post(this.$url + '/crear_categoria_admin', { titulo: this.nueva_categoria }, {
                    headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
                }).then((result) => {
                    if (result.data.message) {
                        this.$notify({ group: 'foo', title: 'ERROR', text: result.data.message, type: 'error' });
                    } else {
                        this.nueva_categoria = '';
                        this.section_form = false;
                        this.$notify({ group: 'foo', title: 'Categoría creada', text: 'La categoría se registró correctamente.', type: 'success' });
                        this.init_data();
                    }
                });
            } else {
                this.$notify({ group: 'foo', title: 'Campo requerido', text: 'Escribe el nombre de la categoría antes de continuar.', type: 'error' });
            }
        },
        init_data() {
            axios.get(this.$url + '/listar_categorias_admin', {
                headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
            }).then((result) => {
                this.categorias = result.data;
            });
        },
        openInputGroup(id) {
            setTimeout(() => {
                this.idcategoria = id;
                this.nueva_subcategoria = '';
                $('.content_group').addClass('hide_input');
                $('#content_' + id).removeClass('hide_input');
            }, 50);
        },
        crear_subcategoria() {
            if (this.nueva_subcategoria) {
                axios.post(this.$url + '/crear_subcategoria_admin', {
                    titulo: this.nueva_subcategoria, categoria: this.idcategoria
                }, {
                    headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
                }).then((result) => {
                    if (result.data.message) {
                        this.$notify({ group: 'foo', title: 'ERROR', text: result.data.message, type: 'error' });
                    } else {
                        this.nueva_subcategoria = '';
                        this.$notify({ group: 'foo', title: 'Subcategoría creada', text: 'La subcategoría se registró correctamente.', type: 'success' });
                        this.init_data();
                    }
                });
            } else {
                this.$notify({ group: 'foo', title: 'Campo requerido', text: 'Escribe el nombre de la subcategoría.', type: 'error' });
            }
        },
        eliminar_subcategoria(id) {
            axios.delete(this.$url + '/eliminar_subcategoria_admin/' + id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
            }).then(() => {
                this.init_data();
                this.$notify({ group: 'foo', title: 'Eliminada', text: 'La subcategoría fue eliminada.', type: 'success' });
            });
        },
        cambiar_estado(id, estado) {
            axios.put(this.$url + '/cambiar_estado_producto_admin/' + id, { estado: estado }, {
                headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
            }).then(() => {
                this.init_data();
                this.$notify({ group: 'foo', title: 'Estado actualizado', text: 'El estado de la categoría fue cambiado.', type: 'success' });
            });
        }
    },
    beforeMount() { this.init_data(); },
    components: { Sidebar, TopNav }
};
</script>
