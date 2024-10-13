<script setup>
import { ref, computed, toRaw } from 'vue';
import { useSignalStore } from "@/stores/signalStore";
import { SignalService } from '@/services/signalService';
import ProcessingToolsDangerModal from "@/components/dangerModals/ProcessingToolsDangerModal.vue";
import { JellyfishLoader } from "vue3-spinner";
import { openDB } from "idb";

// Store de señales
const signalStore = useSignalStore();
const selectedSignals = ref([]);  // Aquí se almacenan las señales seleccionadas

// Obtenemos el arreglo signalJson
const signalJson = computed(() => toRaw(signalStore.signalJson));

// Variables para el modal
const showModal = ref(false);
const modalMessage = ref('');

// Variable para el estado de carga
const loadingStatus = ref(false);

// Función para calcular el promedio de las señales seleccionadas
const calcularAverage = async () => {
  // Verificar si hay señales seleccionadas
  if (selectedSignals.value.length === 0) {
    modalMessage.value = 'Debe seleccionar al menos una señal para calcular el promedio.';
    showModal.value = true;
    loadingStatus.value = false;
    return;
  }

  // Construir el selectedSignalJson con solo las señales seleccionadas
  const selectedSignalJson = selectedSignals.value.map(index => signalJson.value[index]);
  console.log('Selected Signals:', selectedSignalJson);

  try {
    console.log('Enviando solicitud gRPC para calcular el promedio...');

    const response = await SignalService.computeAverage(selectedSignalJson);
    console.log('Respuesta del servidor:', response);

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
    window.open('/response-results/SignalAverage', '_blank');
  } catch (error) {
    console.error('Error al realizar la solicitud gRPC:', error);
    modalMessage.value = 'Error al realizar la solicitud gRPC.';
    console.error(modalMessage.value, error);
    showModal.value = true;
    loadingStatus.value = false;
  }
};

// Función para manejar el envío del formulario
const submitForm = () => {
  // Cambiar el estado de carga
  loadingStatus.value = true;

  calcularAverage();
};

// Función para manejar la confirmación del modal
const handleModalConfirm = () => {
  showModal.value = false;
};

// Función para verificar si una opción está seleccionada
const isSelected = (index) => selectedSignals.value.includes(index);

// Función para seleccionar todas las señales
const selectAllSignals = () => {
  selectedSignals.value = signalJson.value.map((_, index) => index); // Seleccionar todos los índices
};
</script>

<template>
  <h4 class="text-lg font-semibold text-green-500 mb-4">Calcular Average</h4>

  <form @submit.prevent="submitForm">
    <label class="block text-sm font-medium text-gray-700 mb-2">Selecciona las señales:</label>

    <!-- Estilizar checkboxes con Tailwind y recuadro -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div
          v-for="(signal, index) in signalJson"
          :key="index"
          @click="selectedSignals.includes(index) ? selectedSignals.splice(selectedSignals.indexOf(index), 1) : selectedSignals.push(index)"
          :class="isSelected(index) ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-white'"
          class="p-4 rounded-lg border cursor-pointer transition-colors duration-300"
      >
        <input
            type="checkbox"
            :value="index"
            v-model="selectedSignals"
            class="hidden"
        />
        <label class="text-gray-700">Señal #{{ index + 1 }}</label>
      </div>
    </div>

    <!-- Botón para seleccionar todas las señales -->
    <button type="button" @click="selectAllSignals" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mr-4">
      Seleccionar todas las señales
    </button>

    <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
      Calcular Average
    </button>
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
      <JellyfishLoader color="#3B82F6" />
      <h2 class="text-blue-600 mt-4">Procesando respuesta...</h2>
    </div>
  </div>
</template>

<style scoped>

</style>
