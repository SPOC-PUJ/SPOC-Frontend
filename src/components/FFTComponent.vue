<script setup>
import {computed, ref, toRaw} from 'vue';
import {useSignalStore} from '@/stores/signalStore';
import {SignalService} from '@/services/signalService';
import { JellyfishLoader } from "vue3-spinner";
import ProcessingToolsDangerModal from "@/components/dangerModals/ProcessingToolsDangerModal.vue";
import {openDB} from "idb";

// Obtener la instancia del store
const signalStore = useSignalStore();
const signalComputed = computed(() => signalStore.signalObject);

// Variables para el modal
const showModal = ref(false);
const modalMessage = ref('');

// Variable para el estado de carga
const loadingStatus = ref(false);

// Tool 4: Inverse Fast Fourier Transform (IFFT)
const submitToolFFT = () => {
  loadingStatus.value = true;

  if (!signalStore.signalJson)
  {
    modalMessage.value = 'El objeto signalObject es null o no está inicializado.';
    console.error("Error: ", modalMessage.value);
    loadingStatus.value = false;
    showModal.value = true;
  }
  else
  {
    console.log('FFT Tool:', signalStore.signalJson);

    // Llamar a la función para calcular FFT
    calcularFFT();
  }
};

// Función para calcular FFT
const calcularFFT = async () =>
{
  // Verificar si signalObject está inicializado
  if (!signalComputed.value)
  {
    modalMessage.value = 'El objeto signalObject es null o no está inicializado.';
    console.error("Error: ", modalMessage.value);
    loadingStatus.value = false;
    showModal.value = true;
    return;
  }

  // Obtener el índice de la señal seleccionada
  const selectedIndex = signalStore.signalSelected;

  // Obtener el objeto raw desde el store
  const signalJson = toRaw(signalStore.signalJson);

  try
  {
    console.log('Enviando solicitud gRPC para calcular FFT...');
    console.log('Signal JSON:', signalJson[selectedIndex], 'Selected Index:', selectedIndex);

    // Llamada al servicio gRPC para el cálculo de FFT
    const response = await SignalService.computeFFT(signalJson[selectedIndex]);
    console.log('Raw Response (FFT): ', response);

    // Guardar la respuesta en la base de datos.
    const db = await openDB('response-database', 2, {
      upgrade(db) {
        db.createObjectStore('responses');
      },
    });
    await db.put('responses', response, 'signalResponse');

    // Cambiar el estado de carga
    loadingStatus.value = false;

    // Abrir otra ventana (nueva tab) para ver los resultados de FFT
    window.open('/response-results/FFT-Tool', '_blank');
  }
  catch (error)
  {
    console.error('Error al realizar la solicitud gRPC:', error);
    modalMessage.value = 'Error al realizar la solicitud gRPC.';
    showModal.value = true;
    loadingStatus.value = false;
  }
};

// Manejar la confirmación del modal
const handleModalConfirm = () => {
  showModal.value = false;
};
</script>

<template>
  <h4 class="text-lg font-semibold text-green-500 mb-4">Fast Fourier Transform (FFT)</h4>
  <form @submit.prevent="submitToolFFT">
    <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Procesar...</button>
  </form>

  <!-- Modal para mostrar advertencias -->
  <ProcessingToolsDangerModal
      v-if="showModal"
      :message="modalMessage"
      @close="showModal = false"
      @confirm="handleModalConfirm"
  />

  <!-- Mostrar el loader si loadingStatus es true -->
  <div class="flex justify-center items-center w-full h-full fixed inset-0 m-auto bg-white bg-opacity-70"
       v-if="loadingStatus">
    <div class="transform scale-[2] flex flex-col justify-center items-center">
      <JellyfishLoader color="#3B82F6"/>
      <h2 class="text-blue-600 mt-4">Procesando respuesta...</h2>
    </div>
  </div>
</template>