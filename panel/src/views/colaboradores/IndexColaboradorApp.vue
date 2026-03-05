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
                    <span style="background:#3b5bdb;color:#fff;border-radius:20px;padding:2px 12px;font-weight:600;">👥 Colaboradores</span>
                </nav>
            </div>

            <div class="container-fluid py-4">
                <div class="row justify-content-center">
                    <div class="col-12 col-xl-11">

                        <!-- Header -->
                        <div class="d-flex align-items-center justify-content-between mb-4">
                            <div>
                                <p class="text-muted mb-1" style="font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase">Panel de administración</p>
                                <h2 class="mb-0" style="font-weight:700">Colaboradores</h2>
                            </div>
                            <router-link to="/colaborador/create" class="btn d-flex align-items-center gap-2" style="border-radius:8px;font-weight:600;padding:10px 20px;background:#3b5bdb;color:#ffffff !important;text-decoration:none">
                                <i class="fe fe-user-plus" style="color:#fff"></i> Nuevo colaborador
                            </router-link>
                        </div>

                        <!-- Stats -->
                        <div class="row g-3 mb-4">
                            <div class="col-6 col-md-3">
                                <div class="card border-0 shadow-sm" style="border-radius:12px">
                                    <div class="card-body py-3">
                                        <p class="text-muted mb-1" style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">Total</p>
                                        <h3 class="mb-0" style="font-weight:700">{{ colaboradores.length }}</h3>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="card border-0 shadow-sm" style="border-radius:12px">
                                    <div class="card-body py-3">
                                        <p class="text-muted mb-1" style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">Activos</p>
                                        <h3 class="mb-0 text-success" style="font-weight:700">{{ colaboradores.filter(c=>c.estado).length }}</h3>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="card border-0 shadow-sm" style="border-radius:12px">
                                    <div class="card-body py-3">
                                        <p class="text-muted mb-1" style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">Inactivos</p>
                                        <h3 class="mb-0 text-danger" style="font-weight:700">{{ colaboradores.filter(c=>!c.estado).length }}</h3>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="card border-0 shadow-sm" style="border-radius:12px">
                                    <div class="card-body py-3">
                                        <p class="text-muted mb-1" style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">Página</p>
                                        <h3 class="mb-0" style="font-weight:700">{{ currentPage }} / {{ totalPages }}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        

                        <!-- Tabla -->
                        <div class="card border-0 shadow-sm" style="border-radius:14px;overflow:hidden">

                            <!-- Barra de búsqueda -->
                            <div class="card-header bg-white border-bottom py-3 px-4">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="flex-grow-1 position-relative">
                                        <i class="fe fe-search position-absolute" style="top:50%;left:12px;transform:translateY(-50%);color:#aaa"></i>
                                        <input
                                            type="search"
                                            class="form-control ps-5"
                                            style="border-radius:8px;background:#f8f9fa;border:1px solid #e9ecef"
                                            v-model="filtro"
                                            @input="filtrar()"
                                            placeholder="Buscar por nombre, cargo o correo..."
                                        >
                                    </div>
                                    <span class="text-muted" style="font-size:13px;white-space:nowrap">{{ colaboradores.length }} resultado(s)</span>
                                </div>
                            </div>

                            <!-- Loading -->
                            <div v-if="load_data" class="text-center py-5">
                                <div class="spinner-border text-primary" role="status"></div>
                                <p class="text-muted mt-3 mb-0">Cargando colaboradores...</p>
                            </div>

                            <!-- Sin resultados -->
                            <div v-if="!load_data && colaboradores.length === 0" class="text-center py-5">
                                <i class="fe fe-users" style="font-size:48px;color:#dee2e6"></i>
                                <p class="text-muted mt-3 mb-0">No se encontraron colaboradores</p>
                            </div>

                            <!-- Tabla -->
                            <div v-if="!load_data && colaboradores.length > 0" class="table-responsive">
                                <table class="table mb-0" style="font-size:14px">
                                    <thead style="background:#f8f9fa">
                                        <tr>
                                            <th class="px-4 py-3 border-0 text-muted" style="font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.5px">Colaborador</th>
                                            <th class="py-3 border-0 text-muted" style="font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.5px">Cargo</th>
                                            <th class="py-3 border-0 text-muted" style="font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.5px">Correo</th>
                                            <th class="py-3 border-0 text-muted" style="font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.5px">Estado</th>
                                            <th class="py-3 pe-4 border-0 text-muted text-end" style="font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.5px">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in paginatedColaboradores" :key="item._id" style="border-bottom:1px solid #f1f3f5;transition:background .15s" @mouseover="hoverId=item._id" @mouseleave="hoverId=null" :style="hoverId===item._id ? 'background:#f8f9fa' : ''">

                                            <!-- Colaborador -->
                                            <td class="px-4 py-3 border-0">
                                                <div class="d-flex align-items-center gap-3">
                                                    <div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" :style="'width:40px;height:40px;font-size:15px;flex-shrink:0;background:'+getColor(item.nombres)">
                                                        {{ iniciales(item.nombres, item.apellidos) }}
                                                    </div>
                                                    <div>
                                                        <p class="mb-0 fw-semibold" style="color:#212529">{{ item.nombres }} {{ item.apellidos }}</p>
                                                        <p class="mb-0 text-muted" style="font-size:12px">ID: {{ item._id.slice(-6).toUpperCase() }}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <!-- Cargo -->
                                            <td class="py-3 border-0">
                                                <span class="badge" :style="getRolStyle(item.rol)">{{ item.rol }}</span>
                                            </td>

                                            <!-- Correo -->
                                            <td class="py-3 border-0">
                                                <span style="color:#495057">{{ item.email }}</span>
                                            </td>

                                            <!-- Estado -->
                                            <td class="py-3 border-0">
                                                <span v-if="item.estado" class="badge d-inline-flex align-items-center gap-1" style="background:#d1fae5;color:#065f46;font-weight:600;border-radius:20px;padding:5px 12px">
                                                    <span style="width:6px;height:6px;border-radius:50%;background:#10b981;display:inline-block"></span> Activo
                                                </span>
                                                <span v-else class="badge d-inline-flex align-items-center gap-1" style="background:#fee2e2;color:#991b1b;font-weight:600;border-radius:20px;padding:5px 12px">
                                                    <span style="width:6px;height:6px;border-radius:50%;background:#ef4444;display:inline-block"></span> Inactivo
                                                </span>
                                            </td>

                                            <!-- Acciones -->
                                            <td class="py-3 pe-4 border-0 text-end">
                                                <div class="d-flex align-items-center justify-content-end gap-2">
                                                    <router-link :to="{name:'colaborador-edit',params:{id:item._id}}" class="btn btn-sm" style="border-radius:7px;background:#f0f4ff;color:#3b5bdb;border:none;font-weight:600;font-size:12px;padding:6px 16px;white-space:nowrap">
                                                        <i class="fe fe-edit-2"></i>
                                                    </router-link>
                                                    <button @click="abrirModal(item)" class="btn btn-sm" :style="item.estado ? 'border-radius:7px;background:#fff0f0;color:#c92a2a;border:none;font-weight:600;font-size:12px;padding:6px 16px;white-space:nowrap' : 'border-radius:7px;background:#ebfbee;color:#2b8a3e;border:none;font-weight:600;font-size:12px;padding:6px 16px;white-space:nowrap'">
                                                        <i :class="item.estado ? 'fe fe-user-x' : 'fe fe-user-check'"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Paginación -->
                            <div v-if="!load_data && totalPages > 1" class="card-footer bg-white border-top d-flex align-items-center justify-content-between px-4 py-3">
                                <span class="text-muted" style="font-size:13px">Mostrando {{ (currentPage-1)*perPage+1 }}–{{ Math.min(currentPage*perPage, colaboradores.length) }} de {{ colaboradores.length }}</span>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-sm" :disabled="currentPage===1" @click="goPrev()" style="border-radius:7px;border:1px solid #dee2e6;font-size:13px;padding:5px 14px">
                                        <i class="fe fe-arrow-left me-1"></i>Anterior
                                    </button>
                                    <button v-for="page in totalPages" :key="page" @click="goToPage(page)" class="btn btn-sm" :style="page===currentPage ? 'border-radius:7px;background:#3b5bdb;color:#fff;border:none;font-size:13px;padding:5px 12px' : 'border-radius:7px;border:1px solid #dee2e6;font-size:13px;padding:5px 12px'">
                                        {{ page }}
                                    </button>
                                    <button class="btn btn-sm" :disabled="currentPage===totalPages" @click="goNext()" style="border-radius:7px;border:1px solid #dee2e6;font-size:13px;padding:5px 14px">
                                        Siguiente<i class="fe fe-arrow-right ms-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <!-- Modal confirmación -->
        <div v-if="itemSeleccionado" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.45)">
            <div class="modal-dialog modal-dialog-centered" style="max-width:420px">
                <div class="modal-content border-0" style="border-radius:16px;overflow:hidden">
                    <div class="modal-body p-4 text-center">
                        <!-- Icono -->
                        <div class="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle" :style="itemSeleccionado.estado ? 'width:64px;height:64px;background:#fff0f0' : 'width:64px;height:64px;background:#ebfbee'">
                            <i :class="itemSeleccionado.estado ? 'fe fe-user-x' : 'fe fe-user-check'" :style="itemSeleccionado.estado ? 'font-size:28px;color:#c92a2a' : 'font-size:28px;color:#2b8a3e'"></i>
                        </div>
                        <h5 class="mb-1" style="font-weight:700">{{ itemSeleccionado.estado ? '¿Desactivar colaborador?' : '¿Activar colaborador?' }}</h5>
                        <p class="text-muted mb-4" style="font-size:14px">Esta acción cambiará el acceso de <strong>{{ itemSeleccionado.nombres }} {{ itemSeleccionado.apellidos }}</strong> al sistema.</p>
                        <div class="d-flex gap-2 justify-content-center">
                            <button class="btn px-4" @click="cerrarModal()" style="border-radius:8px;border:1px solid #dee2e6;font-weight:600">Cancelar</button>
                            <button class="btn px-4" :style="itemSeleccionado.estado ? 'border-radius:8px;background:#c92a2a;color:#fff;font-weight:600' : 'border-radius:8px;background:#2b8a3e;color:#fff;font-weight:600'" @click="confirmarCambioEstado()">
                                {{ itemSeleccionado.estado ? 'Sí, desactivar' : 'Sí, activar' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
// @ is an alias to /src

import Sidebar from '@/components/Sidebar.vue';
import TopNav from '@/components/TopNav.vue';
import axios from 'axios';
import store from '@/store/index';

export default {
  name: 'IndexColaboradorApp',

  data() {
    return {
      colaboradores : [],
      colaboradores_const: [],
      currentPage: 1,
      perPage: 10,
      filtro: '',
      load_data : false,
      itemSeleccionado: null,
      hoverId: null,
    }
  },
  
  components: {
      Sidebar,
      TopNav
  },

  computed: {
    paginatedColaboradores() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.colaboradores.slice(start, start + this.perPage);
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.colaboradores.length / this.perPage));
    }
  },

  methods: {
    onLangsPageChange(toPage) {
      this.currentPage = toPage;
    },
    goToPage(page) {
      this.currentPage = page;
    },
    goPrev(){
      if (this.currentPage > 1) this.currentPage--;
    },
    goNext(){
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    abrirModal(item){
      this.itemSeleccionado = item;
    },
    cerrarModal(){
      this.itemSeleccionado = null;
    },
    confirmarCambioEstado(){
      this.eliminar(this.itemSeleccionado._id, this.itemSeleccionado.estado);
      this.cerrarModal();
    },
    filtrar(){
      let term = new RegExp(this.filtro,'i');
      /* this.colaboradores = this.colaboradores_const.filter(item=>term.test(item.nombres)||term.test(item.apellidos)||term.test(item.email)); */
      this.init_data();
    },
    init_data(){
      this.load_data = true;
      axios.get(this.$url+'/listar_usuario_admin/'+this.filtro,{
        headers:{
          'Content-Type': 'application/json',
          'Authorization': store.state.token,
        }
      }).then((result)=>{
        this.colaboradores = result.data;
        this.colaboradores_const = this.colaboradores;
         this.load_data = false;
      }).catch((error)=>{
      });
    },
    iniciales(nombres, apellidos) {
      return ((nombres||'').charAt(0) + (apellidos||'').charAt(0)).toUpperCase();
    },
    getColor(nombre) {
      const colores = ['#3b5bdb','#0ca678','#e67700','#c92a2a','#862e9c','#1864ab','#2b8a3e','#5f3dc4'];
      let i = 0;
      for (let c of (nombre||'')) i += c.charCodeAt(0);
      return colores[i % colores.length];
    },
    getRolStyle(rol) {
      const map = {
        'Administrador': 'background:#e7f5ff;color:#1864ab;font-weight:600;border-radius:20px;padding:4px 12px',
        'Vendedor':      'background:#fff3bf;color:#7d4f00;font-weight:600;border-radius:20px;padding:4px 12px',
        'Inventariado':  'background:#f3f0ff;color:#5f3dc4;font-weight:600;border-radius:20px;padding:4px 12px',
        'ADMIN_ROL':     'background:#e7f5ff;color:#1864ab;font-weight:600;border-radius:20px;padding:4px 12px',
      };
      return map[rol] || 'background:#f1f3f5;color:#495057;font-weight:600;border-radius:20px;padding:4px 12px';
    },
    eliminar(id,estado){
      axios.put(this.$url+'/cambiar_estado_usuario_admin/'+id,{estado: estado},{
        headers:{
          'Content-Type': 'application/json',
          'Authorization': this.$token
        }
      }).then((result )=>{
        this.init_data();
        this.$notify({
            group: 'foo',
            title: 'SUCCESS',
            text: 'Se cambio el estado del colaborador',
            type: 'success'
        });

      });
    }
  },

  beforeMount() {
    this.init_data();
  },
}
</script>
