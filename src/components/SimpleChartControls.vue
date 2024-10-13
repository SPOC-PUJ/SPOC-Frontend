<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useSignalStore } from '@/stores/signalStore'; // Importa el store de señales

const emit = defineEmits(['toggle-zoom-y', 'update-line-width']); // Definir eventos emitidos
const lineWidth = ref(1); // Estado del grosor de la línea

const signalStore = useSignalStore(); // Obtener la instancia del store

function toggleZoomY(event) {
  emit('toggle-zoom-y', event.target.checked); // Emitir el estado del checkbox
}

function updateLineWidth() {
  emit('update-line-width', lineWidth.value); // Emitir el valor del slider (grosor de la línea)
}

function updateSignalSelected(event) {
  const selectedIndex = parseInt(event.target.value);
  signalStore.signalSelected = selectedIndex; // Actualizar el índice seleccionado en el store
}

const route = useRoute();

const showSignalSelector = computed(() => {
  console.log('Route:', route);
  return !route.path.includes('/response-results/FastWaveletTransform');
});

</script>

<template>
  <!-- Sección de controles -->
  <div class="p-4 bg-blue-50 rounded-lg shadow-md flex items-center justify-between space-x-4">
    <!-- Habilitar zoom en Y -->
    <div class="flex items-center space-x-2">
      <label class="font-semibold text-black">
        <input type="checkbox" @change="toggleZoomY" class="mr-2 text-green-500 focus:ring-green-400"/>
        Habilitar zoom en Y
      </label>
    </div>

    <!-- Grosor de la línea -->
    <div class="flex items-center space-x-2">
      <label for="lineWidth" class="font-semibold text-black">
        Grosor de la línea: <strong>{{ lineWidth }}px</strong>
      </label>
      <input
          type="range"
          id="lineWidth"
          min="1"
          max="10"
          v-model="lineWidth"
          @input="updateLineWidth"
          class="w-48 h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>

    <!-- Selector de señal -->
    <div class="flex items-center space-x-2" v-if="showSignalSelector">
      <label for="signalSelect" class="font-semibold text-black">
        Seleccionar señal:
      </label>
      <select id="signalSelect" v-model="signalStore.signalSelected" @change="updateSignalSelected" class="form-select">
        <option v-for="(signal, index) in signalStore.signalJson" :key="index" :value="index">
          Señal {{ index }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
input[type='range']::-webkit-slider-thumb {
  appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #10b981; /* Verde de la paleta */
  cursor: pointer;
}

input[type='range']::-moz-range-thumb {
  appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #10b981; /* Verde de la paleta */
  cursor: pointer;
}
</style>
