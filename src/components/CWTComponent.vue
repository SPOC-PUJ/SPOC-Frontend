<script setup>
import { ref, computed, toRaw, watch } from 'vue';
import { useSignalStore } from '@/stores/signalStore';
import { SignalService } from '@/services/signalService';
import { JellyfishLoader } from "vue3-spinner";
import ProcessingToolsDangerModal from "@/components/dangerModals/ProcessingToolsDangerModal.vue";
import { openDB } from "idb";

// Instancia del store
const signalStore = useSignalStore();
const signalComputed = computed(() => signalStore.signalObject);

// Variables para el estado del modal y mensajes
const showModal = ref(false);
const modalMessage = ref('');

// Estado de carga
const loadingStatus = ref(false);

// Propiedades para los parámetros de CWT
const start = ref(1);
const end = ref(10);
const numScales = ref(1);  // Inicio en 1

// Función para manejar el submit del formulario
const submitToolCWT = () => {
  loadingStatus.value = true;

  if (!validarInputs()) {
    loadingStatus.value = false;
    showModal.value = true;
    return;
  }

  console.log('CWT Tool:', signalStore.signalJson);
  calcularCWT();
};

// Función para validar los inputs
const validarInputs = () => {
  const verificationSelectedIndex = signalStore.signalSelected;
  const verificationSignalJson = toRaw(signalStore.signalJson);

  console.log('Signal Length:', verificationSignalJson[verificationSelectedIndex].values.length);

  const signalLength = verificationSignalJson[verificationSelectedIndex].values.length;

  if (start.value < 0) {
    modalMessage.value = 'El valor de Start no puede ser menor que 0.';
    console.error("Error:", modalMessage.value);
    return false;
  }

  if (end.value > signalLength) {
    modalMessage.value = `El valor de End no puede ser mayor a la longitud de la señal (${signalLength}).`;
    console.error("Error:", modalMessage.value);
    return false;
  }

  if (start.value > end.value) {
    modalMessage.value = 'El valor de Start no puede ser mayor que End.';
    console.error("Error:", modalMessage.value);
    return false;
  }

  if (numScales.value < 1) {
    modalMessage.value = 'El valor de Num Scales debe ser al menos 1.';
    console.error("Error:", modalMessage.value);
    return false;
  }

  return true;
};

// Función asíncrona para calcular el CWT
const calcularCWT = async () => {
  if (!signalComputed.value) {
    modalMessage.value = 'El objeto signalObject es null o no está inicializado.';
    console.error("Error: ", modalMessage.value);
    loadingStatus.value = false;
    showModal.value = true;
    return;
  }

  const selectedIndex = signalStore.signalSelected;
  const signalJson = toRaw(signalStore.signalJson);

  try {
    console.log('Enviando solicitud gRPC para calcular CWT...');
    const response = await SignalService.computeCWT(
        signalJson[selectedIndex],
        start.value,
        end.value,
        numScales.value
    );

    const db = await openDB('response-database', 2, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('responses')) {
          db.createObjectStore('responses');
        }
        if (!db.objectStoreNames.contains('signals')) {
          db.createObjectStore('signals');
        }
      },
    });

    await db.put('responses', response, 'responses');
    await db.put('signals', signalJson[selectedIndex], 'signals');

    loadingStatus.value = false;
    window.open('/response-results/CWT-Tool', '_blank');
  } catch (error) {
    console.error('Error al realizar la solicitud gRPC:', error);
    modalMessage.value = 'Error al realizar la solicitud gRPC.';
    showModal.value = true;
    loadingStatus.value = false;
  }
};

// Función para confirmar el cierre del modal
const handleModalConfirm = () => {
  showModal.value = false;
};
</script>

<template>
  <h4 class="text-lg font-semibold text-green-500 mb-6">Continuous Wavelet Transform (CWT)</h4>

  <form @submit.prevent="submitToolCWT" class="space-y-6">
    <div class="flex flex-col">
      <label for="start" class="text-sm font-medium text-gray-700 mb-1">Start</label>
      <input
          id="start"
          type="number"
          v-model="start"
          class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>

    <div class="flex flex-col">
      <label for="end" class="text-sm font-medium text-gray-700 mb-1">End</label>
      <input
          id="end"
          type="number"
          v-model="end"
          class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>

    <div class="flex flex-col">
      <label class="text-sm font-medium text-gray-700 mb-1">Calidad</label>
      <div class="flex justify-between text-xs font-semibold mb-2 text-gray-500">
        <span>Calidad Baja</span>
        <span>Calidad Media</span>
        <span>Calidad Alta</span>
      </div>
      <input
          type="range"
          min="1"
          max="200"
          v-model="numScales"
          class="slider"
      />
      <span class="mt-1 text-center text-gray-600">Num Scales: {{ numScales }}</span>
    </div>

    <button
        type="submit"
        class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300"
    >
      Procesar...
    </button>
  </form>

  <ProcessingToolsDangerModal
      v-if="showModal"
      :message="modalMessage"
      @close="showModal = false"
      @confirm="handleModalConfirm"
  />

  <div
      class="flex justify-center items-center w-full h-full fixed inset-0 m-auto bg-white bg-opacity-70"
      v-if="loadingStatus"
  >
    <div class="transform scale-[2] flex flex-col justify-center items-center">
      <JellyfishLoader color="#3B82F6"/>
      <h2 class="text-blue-600 mt-4">Procesando respuesta...</h2>
    </div>
  </div>
</template>

<style scoped>
label {
  margin-right: 10px;
}

input[type="number"] {
  margin-bottom: 10px;
  display: block;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 10px;
  background: linear-gradient(to right, #10B981, #34D399);
  outline: none;
  transition: background 0.15s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #10B981;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: background 0.15s ease-in-out;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #10B981;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: background 0.15s ease-in-out;
}
</style>
