<script setup>
import { ref, watch } from 'vue';
import { useSignalStore } from '@/stores/signalStore';

// Props
const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

// Acceso al store de señales
const signalStore = useSignalStore();

// Reactive variables
const selectedTool = ref('');

// Datos para cada formulario
// Tool 1: Fast Wavelet Harr
const tool1Data = ref({
  field1: ''
});

// Tool 2: Fast Wavelet Transform
const tool2Data = ref({
  decLevel: '',
  waveName: 'db1' // valor por defecto
});

// Tool 3: First Difference
const tool3Data = ref({
  field1: ''
});

// Tool 4: Inverse Fast Fourier Transform
const tool4Data = ref({
  field1: ''
});

// Tool 5: Moving Average
const tool5Data = ref({
  field1: ''
});

// Tool 6: Running Sum
const tool6Data = ref({
  field1: ''
});

// TODO: Revisar si se queda o no  el revisar la señal desde el graficador
watch(
    () => props.data,
    (newValues) => {
      console.log('Valores reales actualizados:', newValues);
    }
);


// Validación de datos y submit
// Tool 1: Fast Wavelet Harr
const submitTool1 = () => {
  if (!tool1Data.value.field1) {
    console.error('Error: Falta llenar el campo en Tool 1');
  } else {
    console.log('Tool 1 Data:', tool1Data.value, 'Real Values:', props.data);
  }
};

// Tool 2: Fast Wavelet Transform
const submitTool2 = () => {
  if (!tool2Data.value.decLevel) {
    console.error('Error: Falta llenar el campo Dec Level en Tool 2');
  } else {
    console.log('Tool 2 Data:', tool2Data.value, 'Real Values:', props.data);
  }
};

// Tool 3: First Difference
const submitTool3 = () => {
  if (!tool3Data.value.field1) {
    console.error('Error: Falta llenar el campo en Tool 3');
  } else {
    console.log('Tool 3 Data:', tool3Data.value, 'Real Values:', props.data);
  }
};

// Tool 4: Inverse Fast Fourier Transform
const submitTool4 = () => {
  if (!tool4Data.value.field1) {
    console.error('Error: Falta llenar el campo en Tool 4');
  } else {
    console.log('Tool 4 Data:', tool4Data.value, 'Real Values:', props.data);
  }
};

// Tool 5: Moving Average
const submitTool5 = () => {
  if (!tool5Data.value.field1) {
    console.error('Error: Falta llenar el campo Window Size en Tool 5');
  } else {
    console.log('Tool 5 Data:', tool5Data.value, 'Real Values:', props.data, 'Signal Store:', signalStore.signalJson);
  }
};

// Tool 6: Running Sum
const submitTool6 = () => {
  if (!tool6Data.value.field1) {
    console.error('Error: Falta llenar el campo Window Size en Tool 6');
  } else {
    console.log('Tool 6 Data:', tool6Data.value, 'Real Values:', props.data);
  }
};
</script>


<template>
    <div class="bg-white rounded-xl shadow-md p-6">
      <div class="mb-6">
        <h3 class="text-xl font-bold">Processing Tools</h3>
        <p class="text-gray-600">Select a tool and fill out the corresponding form.</p>
      </div>

      <div class="mb-5">
        <label for="toolSelect" class="block text-sm font-medium text-gray-700 mb-2">Select a tool:</label>
        <select id="toolSelect" v-model="selectedTool" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm">
          <option value="" disabled>Select a tool</option>
          <option value="FastWaveletHarr">Fast Wavelet Harr</option>
          <option value="FastWaveletTransform">Fast Wavelet Transform</option>
          <option value="FirstDifference">First Difference</option>
          <option value="IFFT-Tool">Inverse Fast Fourier Transform</option>
          <option value="MovingAverage">Moving Average</option>
          <option value="RunningSum">Running Sum</option>
        </select>
      </div>

      <!-- Formularios Condicionales -->
      <!-- Formulario para la Herramienta 1: Fast Wavelet Harr -->
      <div v-if="selectedTool === 'FastWaveletHarr'" class="mb-6">
        <h4 class="text-lg font-semibold text-green-500 mb-4">Fast Wavelet Harr</h4>
        <form @submit.prevent="submitTool1">
          <label class="block text-sm font-medium text-gray-700 mb-2">SOLO ESPERA SEÑAL</label>
          <input type="text" v-model="tool1Data.field1" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm mb-4"/>
          <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Procesar...</button>
        </form>
      </div>

      <!-- Formulario para la Herramienta 2: Fast Wavelet Transform -->
      <div v-if="selectedTool === 'FastWaveletTransform'" class="mb-6">
        <h4 class="text-lg font-semibold text-green-500 mb-4">Fast Wavelet Transform</h4>
        <form @submit.prevent="submitTool2">
          <!-- Dec Level -->
          <label class="block text-sm font-medium text-gray-700 mb-2">Dec Level:</label>
          <input type="text" v-model="tool2Data.decLevel" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm mb-4"/>

          <!-- Wave Name (Select Menu) -->
          <label class="block text-sm font-medium text-gray-700 mb-2">Wave Name:</label>
          <select v-model="tool2Data.waveName" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm mb-4">
            <option value="db1">Daubechies 1 (db1)</option>
            <option value="db2">Daubechies 2 (db2)</option>
            <option value="coif1">Coiflet 1 (coif1)</option>
            <option value="sym2">Symlet 2 (sym2)</option>
          </select>

          <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Submit Tool 2</button>
        </form>
      </div>


      <!-- Formulario para la Herramienta 3: First Difference -->
      <div v-if="selectedTool === 'FirstDifference'" class="mb-6">
        <h4 class="text-lg font-semibold text-green-500 mb-4">First Difference</h4>
        <form @submit.prevent="submitTool3">
          <label class="block text-sm font-medium text-gray-700 mb-2">SOLO ESPERA SEÑAL</label>
          <input type="text" v-model="tool3Data.field1" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm mb-4"/>
          <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Procesar...</button>
        </form>
      </div>

      <!-- Formulario para la Herramienta 4: Inverse Fast Fourier Transform -->
      <div v-if="selectedTool === 'IFFT-Tool'" class="mb-6">
        <h4 class="text-lg font-semibold text-green-500 mb-4">Inverse Fast Fourier Transform</h4>
        <form @submit.prevent="submitTool4">
          <label class="block text-sm font-medium text-gray-700 mb-2">SOLO ESPERA SEÑAL</label>
          <input type="text" v-model="tool4Data.field1" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm mb-4"/>
          <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Procesar...</button>
        </form>
      </div>

      <!-- Formulario para la Herramienta 5: Moving Average -->
      <div v-if="selectedTool === 'MovingAverage'" class="mb-6">
        <h4 class="text-lg font-semibold text-green-500 mb-4">Moving Average</h4>
        <form @submit.prevent="submitTool5">
          <label class="block text-sm font-medium text-gray-700 mb-2">Window Size:</label>
          <input type="number" v-model="tool5Data.field1" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm mb-4"/>
          <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Procesar...</button>
        </form>
      </div>

      <!-- Formulario para la Herramienta 6: Running Sum -->
      <div v-if="selectedTool === 'RunningSum'" class="mb-6">
        <h4 class="text-lg font-semibold text-green-500 mb-4">Running Sum</h4>
        <form @submit.prevent="submitTool6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Window Size:</label>
          <input type="number" v-model="tool6Data.field1" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm mb-4"/>
          <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Procesar...</button>
        </form>
      </div>

    </div>
</template>

<style scoped>
</style>
