<template>
  <div class="cp-wrap">

    <div class="cp-header mb-2">
      <h6 class="fw-bold mb-1">🎨 Personaliza tu prenda</h6>
      <p class="text-muted small mb-0">
        Sube tu diseño y arrástralo al lugar exacto que quieres.<br>
        <span style="font-size:11px;color:#aaa;">Usa las esquinas para escalar · el ícono circular para girar</span>
      </p>
    </div>

    <!-- Canvas responsivo -->
    <div class="cp-canvas-outer" ref="canvasOuter">
      <div class="cp-canvas-inner" :style="{ width: canvasSize+'px', height: canvasSize+'px' }">
        <canvas ref="fabricEl"></canvas>
      </div>
    </div>

    <!-- Controles -->
    <div class="cp-controls mt-2 d-flex flex-wrap gap-2 align-items-center">
      <button type="button" class="btn btn-dark btn-sm" @click="$refs.fileInputDiseno.click()">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="me-1" viewBox="0 0 16 16">
          <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
          <path d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"/>
        </svg>
        Cargar diseño
      </button>
      <button type="button" class="btn btn-outline-secondary btn-sm" @click="quitarDiseno" :disabled="!designLoaded">
        🗑 Quitar
      </button>
      <button type="button" class="btn btn-outline-secondary btn-sm" @click="centrarDiseno" :disabled="!designLoaded">
        ⊹ Centrar
      </button>
      <button type="button" class="btn btn-outline-warning btn-sm" @click="resetTodo">
        ↺ Reiniciar
      </button>
    </div>

    <!-- Slider de tamaño + rotación -->
    <div v-if="designLoaded" class="cp-sliders mt-3">
      <div class="d-flex align-items-center gap-2 mb-2">
        <span class="cp-slider-label">Tamaño</span>
        <input
          type="range"
          class="form-range flex-grow-1"
          min="5" max="100" step="1"
          v-model.number="sliderSize"
          @input="onSliderSize"
        />
        <span class="cp-slider-val">{{ sliderSize }}%</span>
      </div>
      <div class="d-flex align-items-center gap-2">
        <span class="cp-slider-label">Rotación</span>
        <input
          type="range"
          class="form-range flex-grow-1"
          min="-180" max="180" step="1"
          v-model.number="sliderAngle"
          @input="onSliderAngle"
        />
        <span class="cp-slider-val">{{ sliderAngle }}°</span>
      </div>
    </div>

    <div v-if="designLoaded" class="mt-2 small text-success fw-semibold">
      ✓ Diseño colocado — se guardará la vista previa con tu pedido
    </div>
    <div v-if="errorMsg" class="mt-1 small text-danger">{{ errorMsg }}</div>

    <!-- Nota adicional (opcional) -->
    <div class="mt-3" v-if="designLoaded">
      <label class="form-label small fw-semibold">Nota adicional <span class="text-muted fw-normal">(opcional)</span></label>
      <textarea
        class="form-control form-control-sm"
        rows="2"
        placeholder="Ej: Color del diseño: blanco, aumentar 10% el tamaño..."
        v-model="nota"
        @input="$emit('nota-updated', nota)"
        style="font-size:13px;"
      ></textarea>
    </div>

    <input
      ref="fileInputDiseno"
      type="file"
      accept="image/png,image/jpeg,image/gif,image/webp"
      style="display:none"
      @change="onFileUpload"
    />
  </div>
</template>

<script>
import { fabric } from 'fabric';

export default {
  name: 'CanvasPersonalizador',
  props: {
    productImageUrl: { type: String, required: true }
  },
  emits: ['canvas-updated', 'nota-updated'],
  data() {
    return {
      canvas: null,
      designLoaded: false,
      designObj: null,
      canvasSize: 380,
      errorMsg: '',
      nota: '',
      sliderSize: 42,
      sliderAngle: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      // Ajustar tamaño al contenedor
      const outer = this.$refs.canvasOuter;
      if (outer) {
        const w = outer.clientWidth;
        this.canvasSize = Math.min(w, 380);
      }
      this.initCanvas();
    });
  },
  beforeUnmount() {
    if (this.canvas) {
      this.canvas.dispose();
      this.canvas = null;
    }
  },
  methods: {
    initCanvas() {
      const size = this.canvasSize;
      this.canvas = new fabric.Canvas(this.$refs.fabricEl, {
        width: size,
        height: size,
        backgroundColor: '#f8f8f8',
        preserveObjectStacking: true
      });

      this.cargarFondo();

      // Sincronizar sliders + emitir cuando el usuario mueve/escala/rota con handles
      this.canvas.on('object:modified', () => { this.syncSliders(); this.emitirCanvas(); });
      this.canvas.on('object:scaling', () => this.syncSliders());
      this.canvas.on('object:rotating', () => this.syncSliders());
    },

    cargarFondo() {
      const size = this.canvasSize;
      const url = this.productImageUrl;

      // Fetch como blob para evitar problemas de CORS en canvas
      fetch(url, { mode: 'cors' })
        .then(r => r.blob())
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          fabric.Image.fromURL(blobUrl, (img) => {
            const scale = Math.min(size / img.width, size / img.height);
            img.set({
              left: (size - img.width * scale) / 2,
              top:  (size - img.height * scale) / 2,
              scaleX: scale,
              scaleY: scale,
              selectable: false,
              evented: false,
              hoverCursor: 'default',
              hasBorders: false,
              hasControls: false
            });
            this.canvas.add(img);
            this.canvas.sendToBack(img);
            this.canvas.renderAll();
          });
        })
        .catch(() => {
          // Fallback: fondo gris si la imagen no carga
          this.canvas.setBackgroundColor('#e9ecef', () => this.canvas.renderAll());
        });
    },

    onFileUpload(event) {
      const file = event.target.files[0];
      event.target.value = '';
      if (!file) return;

      if (file.size > 6000000) {
        this.errorMsg = 'La imagen debe pesar menos de 6MB';
        return;
      }
      this.errorMsg = '';

      const reader = new FileReader();
      reader.onload = (e) => {
        fabric.Image.fromURL(e.target.result, (img) => {
          // Quitar diseño anterior si existe
          if (this.designObj) this.canvas.remove(this.designObj);

          // Tamaño inicial ~40% del canvas
          const maxDim = Math.round(this.canvasSize * 0.42);
          const scale = Math.min(maxDim / img.width, maxDim / img.height);
          const sw = img.width * scale;
          const sh = img.height * scale;

          img.set({
            left: (this.canvasSize - sw) / 2,
            top:  (this.canvasSize - sh) / 2,
            scaleX: scale,
            scaleY: scale,
            cornerColor: '#2563eb',
            cornerStrokeColor: '#1e40af',
            cornerSize: 11,
            transparentCorners: false,
            padding: 6,
            borderColor: '#3b82f6'
          });

          this.designObj = img;
          this.sliderSize = 42;
          this.sliderAngle = 0;
          this.canvas.add(img);
          this.canvas.setActiveObject(img);
          this.canvas.bringToFront(img);
          this.canvas.renderAll();
          this.designLoaded = true;
          this.emitirCanvas();
        });
      };
      reader.readAsDataURL(file);
    },

    onSliderSize() {
      if (!this.designObj) return;
      const maxDim = this.canvasSize * (this.sliderSize / 100);
      const naturalMax = Math.max(this.designObj.width, this.designObj.height);
      const scale = maxDim / naturalMax;
      this.designObj.set({ scaleX: scale, scaleY: scale });
      this.canvas.renderAll();
      this.emitirCanvas();
    },

    onSliderAngle() {
      if (!this.designObj) return;
      this.designObj.set({ angle: this.sliderAngle });
      this.canvas.renderAll();
      this.emitirCanvas();
    },

    syncSliders() {
      if (!this.designObj) return;
      const naturalMax = Math.max(this.designObj.width, this.designObj.height);
      const scaled = this.designObj.scaleX * naturalMax;
      this.sliderSize = Math.min(100, Math.max(5, Math.round((scaled / this.canvasSize) * 100)));
      this.sliderAngle = Math.round(this.designObj.angle || 0);
    },

    quitarDiseno() {
      if (this.designObj) {
        this.canvas.remove(this.designObj);
        this.designObj = null;
        this.designLoaded = false;
        this.sliderSize = 42;
        this.sliderAngle = 0;
        this.canvas.renderAll();
        this.$emit('canvas-updated', null);
      }
    },

    centrarDiseno() {
      if (this.designObj) {
        this.designObj.set({
          left: (this.canvasSize - this.designObj.getScaledWidth()) / 2,
          top:  (this.canvasSize - this.designObj.getScaledHeight()) / 2
        });
        this.canvas.renderAll();
        this.emitirCanvas();
      }
    },

    resetTodo() {
      if (this.designObj) {
        this.canvas.remove(this.designObj);
        this.designObj = null;
      }
      this.designLoaded = false;
      this.nota = '';
      this.sliderSize = 42;
      this.sliderAngle = 0;
      this.canvas.renderAll();
      this.$emit('canvas-updated', null);
      this.$emit('nota-updated', '');
    },

    emitirCanvas() {
      if (!this.designLoaded) {
        this.$emit('canvas-updated', null);
        return;
      }
      // Desactivar selección antes de exportar para que no se vea el borde azul
      this.canvas.discardActiveObject();
      this.canvas.renderAll();

      const dataUrl = this.canvas.toDataURL({ format: 'png', quality: 0.92, multiplier: 1 });
      fetch(dataUrl)
        .then(r => r.blob())
        .then(blob => this.$emit('canvas-updated', blob));
    },

    // Método público para llamar desde el padre al momento de añadir al carrito
    async obtenerBlob() {
      if (!this.designLoaded) return null;
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
      const dataUrl = this.canvas.toDataURL({ format: 'png', quality: 0.92 });
      const r = await fetch(dataUrl);
      return r.blob();
    }
  }
};
</script>

<style scoped>
.cp-wrap {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  padding: 16px 18px;
}
.cp-canvas-outer {
  width: 100%;
}
.cp-canvas-inner {
  margin: 0 auto;
  border: 2px dashed #adb5bd;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  line-height: 0;
}
.cp-sliders {
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 10px 14px;
}
.cp-slider-label {
  font-size: 12px;
  font-weight: 600;
  color: #495057;
  min-width: 62px;
  white-space: nowrap;
}
.cp-slider-val {
  font-size: 12px;
  color: #6c757d;
  min-width: 38px;
  text-align: right;
}
</style>
