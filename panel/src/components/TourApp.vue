<template>
  <div>
    <!-- Botón flotante para reabrir el tour (oculto en login) -->
    <button v-if="!visible && mostrarBoton && !esLoginPage" @click="abrirTour()"
      title="Ayuda / Tutorial"
      style="position:fixed;bottom:28px;right:28px;z-index:9999;width:48px;height:48px;border-radius:50%;background:#4c6ef5;color:#fff;border:none;box-shadow:0 4px 16px rgba(76,110,245,.4);cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;transition:transform .2s;"
      @mouseenter="$event.target.style.transform='scale(1.1)'"
      @mouseleave="$event.target.style.transform='scale(1)'">
      ?
    </button>

    <!-- Overlay -->
    <transition name="fade">
      <div v-if="visible"
        style="position:fixed;inset:0;background:rgba(15,20,40,.65);z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px;"
        @click.self="cerrar()">

        <!-- Modal -->
        <transition name="slide" mode="out-in">
          <div :key="paso" style="background:#fff;border-radius:20px;width:100%;max-width:580px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.25);position:relative;">

            <!-- Barra de progreso superior -->
            <div style="height:5px;background:#e9ecef;">
              <div style="height:5px;background:linear-gradient(90deg,#4c6ef5,#748ffc);border-radius:5px;transition:width .5s ease;"
                :style="{width: ((paso+1)/pasos.length)*100 + '%'}"></div>
            </div>

            <!-- Cabecera -->
            <div style="padding:24px 24px 0;display:flex;align-items:flex-start;justify-content:space-between;">
              <div style="display:flex;align-items:center;gap:14px;">
                <div style="width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;"
                  :style="{background: pasos[paso].bg}">
                  {{ pasos[paso].icono }}
                </div>
                <div>
                  <div style="font-size:11px;font-weight:700;color:#adb5bd;letter-spacing:.9px;text-transform:uppercase;margin-bottom:2px;">
                    {{ paso === 0 ? 'Introducción' : (paso === pasos.length - 1 ? '¡Todo listo!' : 'Paso ' + paso + ' de ' + (pasos.length - 2)) }}
                  </div>
                  <h3 style="margin:0;font-size:18px;font-weight:800;color:#212529;line-height:1.25;">{{ pasos[paso].titulo }}</h3>
                </div>
              </div>
              <button @click="cerrar()" style="background:none;border:none;font-size:20px;color:#adb5bd;cursor:pointer;padding:4px;line-height:1;flex-shrink:0;">✕</button>
            </div>

            <!-- Contenido -->
            <div style="padding:18px 24px 0;">
              <p style="font-size:14px;color:#495057;line-height:1.75;margin:0;">{{ pasos[paso].descripcion }}</p>

              <!-- Flujo visual (solo para bienvenida) -->
              <div v-if="paso === 0" style="margin-top:18px;display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;">
                <div v-for="(f, i) in flujo" :key="i" style="display:flex;align-items:center;gap:6px;">
                  <div style="background:#f0f4ff;border:1.5px solid #c5d0fa;border-radius:12px;padding:8px 14px;text-align:center;">
                    <div style="font-size:20px;">{{ f.icono }}</div>
                    <div style="font-size:11px;font-weight:700;color:#4c6ef5;margin-top:2px;">{{ f.label }}</div>
                  </div>
                  <span v-if="i < flujo.length - 1" style="color:#adb5bd;font-size:18px;font-weight:300;">→</span>
                </div>
              </div>

              <!-- Lista de pasos detallados -->
              <div v-if="pasos[paso].items" style="margin-top:14px;display:flex;flex-direction:column;gap:9px;">
                <div v-for="(item, i) in pasos[paso].items" :key="i"
                  style="display:flex;align-items:flex-start;gap:10px;">
                  <span style="min-width:24px;height:24px;border-radius:50%;background:#4c6ef5;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">{{ i+1 }}</span>
                  <span style="font-size:13.5px;color:#343a40;line-height:1.6;">{{ item }}</span>
                </div>
              </div>

              <!-- Paso final: resumen visual -->
              <div v-if="pasos[paso].resumen" style="margin-top:16px;display:flex;flex-direction:column;gap:8px;">
                <div v-for="(r, i) in pasos[paso].resumen" :key="i"
                  style="display:flex;align-items:center;gap:10px;background:#f8f9fa;border-radius:10px;padding:10px 14px;">
                  <span style="font-size:20px;">{{ r.icono }}</span>
                  <div>
                    <div style="font-size:13px;font-weight:700;color:#212529;">{{ r.titulo }}</div>
                    <div style="font-size:12px;color:#6c757d;">{{ r.desc }}</div>
                  </div>
                  <span style="margin-left:auto;font-size:16px;">✅</span>
                </div>
              </div>

              <!-- Tip resaltado -->
              <div v-if="pasos[paso].tip"
                style="margin-top:14px;background:#f0f4ff;border-left:3px solid #4c6ef5;border-radius:0 8px 8px 0;padding:10px 14px;font-size:12px;color:#364fc7;font-weight:600;line-height:1.6;">
                💡 {{ pasos[paso].tip }}
              </div>
            </div>

            <!-- Dots indicadores -->
            <div style="padding:18px 24px 0;display:flex;justify-content:center;gap:6px;">
              <button v-for="(p, i) in pasos" :key="i" @click="paso = i"
                style="border:none;padding:0;cursor:pointer;transition:all .25s;"
                :style="{width: i===paso ? '24px' : '8px', height:'8px', borderRadius: i===paso ? '4px':'50%', background: i===paso ? '#4c6ef5' : '#dee2e6'}">
              </button>
            </div>

            <!-- Botones de navegación -->
            <div style="padding:16px 24px 22px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">

              <!-- Izquierda: Anterior / No mostrar -->
              <div style="display:flex;align-items:center;gap:8px;">
                <button v-if="paso > 0" @click="paso--"
                  style="background:none;border:1.5px solid #dee2e6;border-radius:10px;padding:9px 18px;font-size:13px;font-weight:600;color:#495057;cursor:pointer;">
                  ← Anterior
                </button>
                <button v-if="paso === 0" @click="cerrarYNoMostrar()"
                  style="background:none;border:none;font-size:12px;color:#adb5bd;cursor:pointer;padding:9px 4px;text-decoration:underline;">
                  No mostrar de nuevo
                </button>
              </div>

              <!-- Derecha: Ir ahora + Siguiente / Empezar -->
              <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">

                <!-- Botón de acción directa (ir a la sección) -->
                <button v-if="pasos[paso].ruta && paso < pasos.length - 1"
                  @click="irA(pasos[paso].ruta)"
                  style="background:#fff;border:1.5px solid #4c6ef5;color:#4c6ef5;border-radius:10px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;">
                  {{ pasos[paso].botonRuta }} ↗
                </button>

                <!-- Siguiente -->
                <button v-if="paso < pasos.length - 1" @click="paso++"
                  style="background:#4c6ef5;color:#fff;border:none;border-radius:10px;padding:9px 22px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(76,110,245,.35);">
                  Siguiente →
                </button>

                <!-- Botón final -->
                <button v-else @click="irA(pasos[paso].ruta || '/categorias')"
                  style="background:linear-gradient(135deg,#4c6ef5,#748ffc);color:#fff;border:none;border-radius:10px;padding:9px 22px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(76,110,245,.4);">
                  🚀 {{ pasos[paso].botonRuta || '¡Empezar ahora!' }}
                </button>
              </div>

            </div>

          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>


<script>
export default {
  name: 'TourApp',
  data() {
    return {
      visible: false,
      mostrarBoton: false,
      paso: 0,

      // Flujo visual para la pantalla de bienvenida
      flujo: [
        { icono: '🏷️', label: 'Categoría' },
        { icono: '👕', label: 'Producto' },
        { icono: '📦', label: 'Ingreso' },
        { icono: '🛍️', label: 'Ventas' },
      ],

      pasos: [
        // ── Bienvenida ──────────────────────────────────────────────
        {
          icono: '👋',
          bg: '#fff3bf',
          titulo: '¡Bienvenido! Te enseñamos a usar el panel',
          descripcion: 'Para que tu tienda funcione correctamente debes seguir el orden de configuración. Este tutorial te lleva paso a paso — ¡en menos de 5 minutos tendrás todo listo!',
          tip: 'Sigue el flujo de abajo. Cada paso depende del anterior.',
        },

        // ── Paso 1: Categorías ──────────────────────────────────────
        {
          icono: '🏷️',
          bg: '#e7f5ff',
          titulo: 'Paso 1 — Crea tus categorías',
          descripcion: 'Lo primero es organizar tus productos en categorías. Por ejemplo: Playeras, Gorras, Sudaderas, Accesorios. Sin categorías no puedes crear productos.',
          items: [
            'En el menú lateral haz clic en "Categorías"',
            'Clic en el botón "+ Nueva Categoría"',
            'Escribe el nombre, por ej. "Playeras"',
            'Guarda — ¡ya tienes tu primera categoría!',
            'Repite para cada tipo de producto que vendas',
          ],
          tip: 'También puedes crear subcategorías dentro de cada categoría para organizar mejor (p. ej. "Manga corta", "Manga larga").',
          ruta: '/categorias',
          botonRuta: 'Ir a Categorías',
        },

        // ── Paso 2: Productos ───────────────────────────────────────
        {
          icono: '👕',
          bg: '#ebfbee',
          titulo: 'Paso 2 — Crea tus productos',
          descripcion: 'Ya tienes categorías. Ahora crea cada producto que quieras vender: ponle nombre, precio, descripción, tallas y colores disponibles.',
          items: [
            'En el menú lateral haz clic en "Productos"',
            'Clic en "+ Nuevo Producto"',
            'Llena el nombre, precio y selecciona su categoría',
            'Agrega las variedades: talla + color disponibles',
            'Sube fotos del producto desde la galería',
          ],
          tip: '¡Fotos de calidad = más ventas! Agrega varias fotos por producto desde la sección Galería.',
          ruta: '/producto/create',
          botonRuta: 'Crear producto',
        },

        // ── Paso 3: Ingresos ────────────────────────────────────────
        {
          icono: '📦',
          bg: '#fff0f6',
          titulo: 'Paso 3 — Registra tu inventario (Ingreso)',
          descripcion: '¡Paso clave! Aunque el producto exista, si no tiene stock registrado NO aparecerá disponible en la tienda. Debes registrar cuántas piezas tienes de cada variedad.',
          items: [
            'En el menú lateral haz clic en "Ingreso"',
            'Clic en "+ Nuevo Ingreso"',
            'Selecciona el producto y la variedad (talla/color)',
            'Escribe la cantidad de piezas que tienes',
            'Guarda — el stock se actualiza automáticamente',
          ],
          tip: 'Cada vez que recibas mercancía nueva, registra un ingreso para actualizar el stock.',
          ruta: '/ingreso/create',
          botonRuta: 'Registrar ingreso',
        },

        // ── Paso 4: Ventas ──────────────────────────────────────────
        {
          icono: '🛍️',
          bg: '#fff9db',
          titulo: 'Paso 4 — Revisa tus ventas',
          descripcion: '¡Tu tienda ya está operativa! Cuando un cliente realice una compra desde la tienda en línea, la venta aparecerá aquí automáticamente y recibirás una notificación en tiempo real.',
          items: [
            'En el menú lateral haz clic en "Ventas"',
            'Verás la lista de todos los pedidos con fecha y monto',
            'Haz clic en una venta para ver el detalle completo',
            'La campana 🔔 te avisa al instante de cada nueva compra',
          ],
          tip: 'No necesitas recargar la página — las notificaciones llegan en tiempo real gracias a la conexión automática.',
          ruta: '/ventas',
          botonRuta: 'Ver ventas',
        },

        // ── Final ───────────────────────────────────────────────────
        {
          icono: '🎉',
          bg: '#d3f9d8',
          titulo: '¡Todo listo para empezar a vender!',
          descripcion: 'Recuerda siempre seguir este orden cuando agregues productos nuevos:',
          resumen: [
            { icono: '🏷️', titulo: 'Crear categoría', desc: 'Organiza tus productos (Playeras, Gorras...)' },
            { icono: '👕', titulo: 'Crear producto', desc: 'Nombre, precio, tallas y colores' },
            { icono: '📦', titulo: 'Registrar ingreso', desc: 'Sin stock el producto no aparece en tienda' },
            { icono: '🛍️', titulo: 'Recibir ventas', desc: 'Llegan automáticamente con notificación' },
          ],
          tip: 'Puedes volver a ver este tutorial cuando quieras usando el botón "?" en la esquina inferior derecha.',
          ruta: '/categorias',
          botonRuta: '¡Crear primera categoría!',
        },
      ]
    };
  },
  computed: {
    esLoginPage() {
      return this.$route && this.$route.name === 'login';
    }
  },
  mounted() {
    // No mostrar tour ni botón en la página de login
    if (this.esLoginPage) return;
    const visto = localStorage.getItem('tour_visto');
    this.mostrarBoton = true;
    if (!visto) {
      setTimeout(() => { this.visible = true; }, 800);
    } else {
      const pasoGuardado = parseInt(localStorage.getItem('tour_paso') || '0');
      this.paso = pasoGuardado < this.pasos.length ? pasoGuardado : 0;
    }
  },
  methods: {
    abrirTour() {
      this.visible = true;
    },
    cerrar() {
      this.visible = false;
      localStorage.setItem('tour_visto', '1');
      localStorage.setItem('tour_paso', String(this.paso));
    },
    cerrarYNoMostrar() {
      localStorage.setItem('tour_visto', '1');
      localStorage.setItem('tour_paso', '0');
      this.visible = false;
    },
    irA(ruta) {
      this.visible = false;
      localStorage.setItem('tour_visto', '1');
      localStorage.setItem('tour_paso', String(this.paso));
      if (this.$route.path !== ruta) {
        this.$router.push(ruta);
      }
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active { animation: slideIn .25s ease; }
.slide-leave-active { animation: slideOut .2s ease; }
@keyframes slideIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slideOut {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-8px); }
}
</style>
