<script setup>
import { ref, computed, toRaw } from 'vue';
import { useSignalStore } from '@/stores/signalStore';
import { SignalService } from '@/services/signalService';
import { openDB } from 'idb';
import ProcessingToolsDangerModal from "@/components/dangerModals/ProcessingToolsDangerModal.vue";

// Accede a la store
const signalStore = useSignalStore();
const signalComputed = computed(() => signalStore.signalObject);

// Variables para el modal
const showModal = ref(false);
const modalMessage = ref('');

// Tool 5: Moving Average
const tool5Data = ref({
  field1: ''
});

// Tool 5: Moving Average
const submitTool5 = () => {
  if (!tool5Data.value.field1) {
    modalMessage.value = 'Falta llenar el campo Window Size';
    console.error(modalMessage.value);
    showModal.value = true;
    return;
  } else if (isNaN(Number(tool5Data.value.field1))) {
    modalMessage.value = 'Window Size debe ser un número.';
    console.error(modalMessage.value);
    showModal.value = true;
    return;
  } else if (!Number.isInteger(Number(tool5Data.value.field1)) || Number(tool5Data.value.field1) <= 0 || !/^-?\d+$/.test(tool5Data.value.field1)) {
    modalMessage.value = 'Window Size debe ser un número entero positivo.';
    console.error(modalMessage.value);
    showModal.value = true;
    return;
  } else {
    console.log('Tool 5 Data:', tool5Data.value, 'Signal Store:', signalStore.signalJson, 'Signal Selected:', signalStore.signalSelected);
    calcularPromedioMovil();
  }
};

const calcularPromedioMovil = async () => {
  if (!signalComputed.value) {
    modalMessage.value = 'El objeto signalObject es null o no está inicializado.';
    console.error(modalMessage.value);
    showModal.value = true;
    return;
  }

  // Obtener el índice de la señal seleccionada
  const selectedIndex = signalStore.signalSelected;

  // Obtener el objeto raw desde el store
  const signalJson = toRaw(signalStore.signalJson);

  try {
    const response = await SignalService.computeMovingAverage(signalJson[selectedIndex], parseInt(tool5Data.value.field1));
    console.log('Raw Response (Moving Average): ', response);

    // Guardar la respuesta en la base de datos.
    const db = await openDB('response-database', 2, {
      upgrade(db) {
        db.createObjectStore('responses');
      },
    });
    await db.put('responses', response, 'signalResponse');

    // Abrir otra ventana (nueva tab), el componente de esta nueva tab es ServiceResponseView.vue
    window.open('/response-results/MovingAverage', '_blank');
  } catch (error) {
    modalMessage.value = 'Error al realizar la solicitud gRPC.';
    console.error(modalMessage.value, error);
    showModal.value = true;
  }
};

// Manejar la confirmación del modal
const handleModalConfirm = () => {
  showModal.value = false;
};
</script>

<template>
  <h4 class="text-lg font-semibold text-green-500 mb-4">Moving Average</h4>
  <form @submit.prevent="submitTool5">
    <label class="block text-sm font-medium text-gray-700 mb-2">Window Size:</label>
    <input type="text" v-model="tool5Data.field1" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm mb-4"/>
    <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
      Procesar...
    </button>
  </form>

  <!-- Incluir el modal -->
  <ProcessingToolsDangerModal
      v-if="showModal"
      :message="modalMessage"
      @close="showModal = false"
      @confirm="handleModalConfirm"
  />
</template>