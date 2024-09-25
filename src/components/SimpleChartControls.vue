<script setup>
import { ref } from 'vue';

const emit = defineEmits(['toggle-zoom-y', 'update-line-width']); // Definir eventos emitidos
const lineWidth = ref(1); // Estado del grosor de la línea

function toggleZoomY(event) {
  emit('toggle-zoom-y', event.target.checked); // Emitir el estado del checkbox
}

function updateLineWidth() {
  emit('update-line-width', lineWidth.value); // Emitir el valor del slider (grosor de la línea)
}
</script>

<template>
  <div>
    <label>
      <input type="checkbox" @change="toggleZoomY" />
      Habilitar zoom en Y
    </label>

    <label for="lineWidth">Grosor de la línea: {{ lineWidth }}px</label>
    <input type="range" id="lineWidth" min="1" max="10" v-model="lineWidth" @input="updateLineWidth" />
  </div>
</template>
