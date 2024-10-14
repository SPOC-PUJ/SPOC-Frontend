<script setup>
import {computed, toRaw} from 'vue';
import {useSignalStore} from '@/stores/signalStore';
import {SignalService} from '@/services/signalService';

// Obtener la instancia del store
const signalStore = useSignalStore();

// Computed property para acceder a signalObject
const signalComputed = computed(() => signalStore.signalObject);

// Tool 1: Fast Wavelet Harr
const submitTool1 = () => {
  if (!signalStore.signalJson)
  {
    console.error('El objeto signalObject es null o no está inicializado.');
  }
  else
  {
    console.log('Fast Wavelet Harr:', signalStore.signalJson, signalStore.signalSelected);

    calcularFastWaveletHarr();
  }
};

// Función para calcular Fast Wavelet Harr
const calcularFastWaveletHarr = async () => {
  // Verificar si signalObject está inicializado
  if (!signalComputed.value) {
    console.error('El objeto signalObject es null o no está inicializado.');
    return;
  }

  // Obtener el índice de la señal seleccionada
  const selectedIndex = signalStore.signalSelected;

  // Obtener el objeto raw desde el store
  const signalJson = toRaw(signalStore.signalJson);


  console.log('Signal JSON:', signalJson);
  console.log('Selected Index:', selectedIndex);
  console.log('Signal:', signalJson[selectedIndex]);

  console.log('Singal Numbers:', signalJson[selectedIndex].values);

  try {
    // Llamada al servicio gRPC para el cálculo de Fast Wavelet Harr
    const response = await SignalService.computeFastWaveletHarr(signalJson[selectedIndex]);
    console.log(response);

    // Abrir otra ventana (nueva tab), el componente de esta nueva tab es ServiceResponseView.vue
    window.open('/response-results/FastWaveletHaar', '_blank');
  } catch (error) {
    console.error('Error al realizar la solicitud gRPC:', error);
  }
};
</script>


<template>
  <h4 class="text-lg font-semibold text-green-500 mb-4">Fast Wavelet Harr</h4>
  <form @submit.prevent="submitTool1">
    <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Procesar...</button>
  </form>
</template>