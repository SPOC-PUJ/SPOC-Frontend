<script setup>
import {computed, ref, toRaw} from 'vue';
import { useSignalStore } from '@/stores/signalStore';
import { SignalService } from '@/services/signalService';
import { JellyfishLoader } from "vue3-spinner";
import ProcessingToolsDangerModal from "@/components/dangerModals/ProcessingToolsDangerModal.vue";
import { openDB } from "idb";

// Obtener la instancia del store
const signalStore = useSignalStore();
const signalComputed = computed(() => signalStore.signalObject);

// Variables para el modal
const showModal = ref(false);
const modalMessage = ref('');

// Variable para el estado de carga
const loadingStatus = ref(false);

// Tool 3: First Difference
const submitTool3 = () =>
{
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
    console.log('First Difference Tool:', signalStore.signalJson);

    // Llamar a la función para calcular First Difference
    calcularFirstDifference();
  }
};

// Función para calcular First Difference
const calcularFirstDifference = async () => {
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
    console.log('Enviando solicitud gRPC para calcular First Difference...');
    console.log('Signal JSON:', signalJson[selectedIndex], 'Selected Index:', selectedIndex);

    // Llamada al servicio gRPC para el cálculo de First Difference
    const response = await SignalService.computeFirstDifference(signalJson[selectedIndex]);
    console.log('Raw Response (First Difference): ', response);

    // Guardar la respuesta en la base de datos.
    const db = await openDB('response-database', 1, {
      upgrade(db) {
        db.createObjectStore('responses');
      },
    });
    await db.put('responses', response, 'signalResponse');

    // Cambiar el estado de carga
    loadingStatus.value = false;

    // Abrir otra ventana (nueva tab), el componente de esta nueva tab es ServiceResponseView.vue
    window.open('/response-results/FirstDifference', '_blank');
  }
  catch (error)
  {
    console.error('Error al realizar la solicitud gRPC:', error);
    modalMessage.value = 'Error al realizar la solicitud gRPC.';
    console.error(modalMessage.value, error);
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
  <h4 class="text-lg font-semibold text-green-500 mb-4">First Difference</h4>
  <form @submit.prevent="submitTool3">
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
  <div class="flex justify-center items-center w-full h-full fixed inset-0 m-auto bg-white bg-opacity-70" v-if="loadingStatus">
    <div class="transform scale-[2] flex flex-col justify-center items-center">
      <JellyfishLoader color="#3B82F6"/>
      <h2 class="text-blue-600 mt-4">Procesando respuesta...</h2>
    </div>
  </div>
</template>