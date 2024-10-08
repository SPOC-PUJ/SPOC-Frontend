<script setup>
import {ref, computed, toRaw} from 'vue';
import {Complex} from '../proto/proto-ts/signal';
import {useSignalStore} from '@/stores/signalStore';
import {SignalService} from '@/services/signalService';

// Obtener la instancia del store
const signalStore = useSignalStore();

// Computed property para acceder a signalObject
const signalComputed = computed(() => signalStore.signalObject);


// Tool 2: Fast Wavelet Transform
const tool2Data = ref({
  decLevel: '',
  waveName: 'db1' // valor por defecto
});

// Tool 2: Fast Wavelet Transform
const submitTool2 = () => {
  if (!tool2Data.value.decLevel)
  {
    console.error('Error: Falta llenar el campo Dec Level en el Fast Wavelet Transform.');
  }
  else
  {
    console.log('Fast Wavelet Transform:', tool2Data.value, "Signal:", signalStore.signalJson);

    // Llamar a la función para calcular Fast Wavelet Transform
    calcularFastWaveletTransform();
  }
};

// Función para calcular Fast Wavelet Transform
const calcularFastWaveletTransform = async () => {
  // Verificar si signalObject está inicializado
  if (!signalComputed.value) {
    console.error('El objeto signalObject es null o no está inicializado.');
    return;
  }

  // Obtener el objeto raw desde el store
  const signalJson = toRaw(signalStore.signalJson);
  console.log('después de traer el json', signalJson[0]);

  try {
    // Llamada al servicio gRPC para el cálculo de Fast Wavelet Transform
    const response = await SignalService.computeFastWaveletTransform(signalJson[0], 3, 'db1');
    console.log(response);

    // Abrir otra ventana (nueva tab), el componente de esta nueva tab es ServiceResponseView.vue
    window.open('/response-results/FastWaveletTransform', '_blank');
  } catch (error) {
    console.error('Error al realizar la solicitud gRPC:', error);
  }
};
</script>


<template>
  <h4 class="text-lg font-semibold text-green-500 mb-4">Fast Wavelet Transform</h4>
  <form @submit.prevent="submitTool2">
    <!-- Dec Level -->
    <label class="block text-sm font-medium text-gray-700 mb-2">Dec Level:</label>
    <input type="text" v-model="tool2Data.decLevel"
           class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm mb-4"/>

    <!-- Wave Name (Select Menu) -->
    <label class="block text-sm font-medium text-gray-700 mb-2">Wave Name:</label>
    <select v-model="tool2Data.waveName"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm mb-4">
      <option value="db1">Daubechies 1 (db1)</option>
      <option value="db2">Daubechies 2 (db2)</option>
      <option value="db3">Daubechies 3 (db3)</option>
      <option value="db4">Daubechies 4 (db4)</option>
      <option value="bior3.1">Biorthogonal 3.1</option>
    </select>

    <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Submit Tool 2
    </button>
  </form>
</template>