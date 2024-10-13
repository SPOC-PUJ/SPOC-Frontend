<script setup>
import { ref, computed, toRaw } from 'vue';
import { useSignalStore } from "@/stores/signalStore";
import { SignalService } from '@/services/signalService';
import ProcessingToolsDangerModal from "@/components/dangerModals/ProcessingToolsDangerModal.vue";

// Store de señales
const signalStore = useSignalStore();
const selectedSignals = ref([]);  // Aquí se almacenan las señales seleccionadas

// Obtenemos el arreglo signalJson
const signalJson = computed(() => toRaw(signalStore.signalJson));

// Variables para el modal
const showModal = ref(false);
const modalMessage = ref('');

// Función para calcular el promedio de las señales seleccionadas
const calcularAverage = async () => {
  // Verificar si hay señales seleccionadas
  if (selectedSignals.value.length === 0) {
    modalMessage.value = 'Debe seleccionar al menos una señal para calcular el promedio.';
    showModal.value = true;
    return;
  }

  // Construir el selectedSignalJson con solo las señales seleccionadas
  const selectedSignalJson = selectedSignals.value.map(index => signalJson.value[index]);
  console.log('Selected Signals:', selectedSignalJson);

  try {
    const response = await SignalService.computeAverage(selectedSignalJson);
    console.log('Respuesta del servidor:', response);
  } catch (error) {
    console.error('Error al realizar la solicitud gRPC:', error);
    modalMessage.value = 'Error al realizar la solicitud gRPC.';
    console.error(modalMessage.value, error);
    showModal.value = true;
  }
};

// Función para manejar el envío del formulario
const submitForm = () => {
  calcularAverage();
};

// Función para manejar la confirmación del modal
const handleModalConfirm = () => {
  showModal.value = false;
};

// Función para verificar si una opción está seleccionada
const isSelected = (index) => selectedSignals.value.includes(index);
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
        <label class="text-gray-700">Opción {{ index + 1 }}</label>
      </div>
    </div>

    <button
        type="submit"
        class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
    >
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
</template>

<style scoped>
/* Aquí puedes agregar estilos adicionales si los necesitas */
</style>
