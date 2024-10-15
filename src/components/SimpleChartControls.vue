<script setup>
import { ref } from 'vue';
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

const routeLastSegment = (window.location.pathname).substring((window.location.pathname).lastIndexOf('/') + 1);
console.log('Last Segment of the URL:', routeLastSegment);

let showSignalSelector = true;

if (routeLastSegment === 'FastWaveletTransform' || routeLastSegment === 'MovingAverage' || routeLastSegment === 'SignalAverage' || routeLastSegment === 'FirstDifference' || routeLastSegment === 'IFFT-Tool')
{
  showSignalSelector = false;
}

</script>

<template>
  <!-- Sección de controles -->
  <div class="p-4 bg-white shadow-md flex items-center justify-between space-x-4 border-2 border-gray-200 rounded-lg">
    <!-- Habilitar zoom en Y -->
    <div class="flex items-center space-x-2">
      <label class="font-semibold text-gray-800">
        <input type="checkbox" @change="toggleZoomY" class="mr-2 text-green-600 focus:ring-green-500 rounded border-gray-300"/>
        Habilitar zoom en Y
      </label>
    </div>

    <!-- Grosor de la línea -->
    <div class="flex items-center space-x-2">
      <label for="lineWidth" class="font-semibold text-gray-800">
        Grosor de la línea: <strong>{{ lineWidth }}px</strong>
      </label>
      <input
          type="range"
          id="lineWidth"
          min="1"
          max="10"
          v-model="lineWidth"
          @input="updateLineWidth"
          class="w-48 h-2 bg-green-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    <!-- Selector de señal -->
    <div class="flex items-center space-x-2" v-if="showSignalSelector">
      <label for="signalSelect" class="font-semibold text-gray-800">
        Seleccionar señal:
      </label>
      <div class="relative">
        <select id="signalSelect" v-model="signalStore.signalSelected" @change="updateSignalSelected"
                class="block w-full appearance-none bg-white border border-gray-300 text-gray-800 py-2 px-3 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm">
          <option v-for="(signal, index) in signalStore.signalJson" :key="index" :value="index">
            Señal {{ index }}
          </option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type='range']::-webkit-slider-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #10b981; /* Verde de la paleta */
  cursor: pointer;
  border: 2px solid #fff;
}

input[type='range']::-moz-range-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #10b981; /* Verde de la paleta */
  cursor: pointer;
  border: 2px solid #fff;
}

select {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
}
</style>