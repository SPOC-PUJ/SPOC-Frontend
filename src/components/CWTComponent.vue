<script setup>
import { ref, computed, toRaw, watch } from 'vue';
import { useSignalStore } from '@/stores/signalStore';
import { SignalService } from '@/services/signalService';
import { JellyfishLoader } from 'vue3-spinner';
import ProcessingToolsDangerModal from '@/components/dangerModals/ProcessingToolsDangerModal.vue';
import { openDB } from 'idb';
import VueSlider from 'vue-slider-component/dist/vue-slider-component.umd.min';
import 'vue-slider-component/theme/default.css';

// Instancia del store
const signalStore = useSignalStore();
const signalComputed = computed(() => signalStore.signalObject);

// Variables para el estado del modal y mensajes
const showModal = ref(false);
const modalMessage = ref('');

// Estado de carga
const loadingStatus = ref(false);

// Longitud de la señal
const signalLength = computed(() => {
  const selectedIndex = signalStore.signalSelected;
  const signalJson = toRaw(signalStore.signalJson);
  return signalJson[selectedIndex]?.values.length || 0;
});

// Valores iniciales para el rango (iniciando en 1 y terminando en signalLength + 1)
const rangeValues = ref([1, signalLength.value + 1]);

// Actualizar 'rangeValues' cuando cambia 'signalLength'
watch(signalLength, (newLength) => {
  rangeValues.value = [1, newLength + 1];
});

// Propiedades para los parámetros de CWT
const numScales = ref(1); // Inicio en 1

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

  const signalLengthValue = verificationSignalJson[verificationSelectedIndex]?.values.length || 0;

  const [startValue, endValue] = rangeValues.value;

  if (startValue < 1) {
    modalMessage.value = 'El valor de Inicio no puede ser menor que 1.';
    console.error('Error:', modalMessage.value);
    return false;
  }

  if (endValue > signalLengthValue + 1) {
    modalMessage.value = `El valor de Fin no puede ser mayor que la longitud de la señal más uno (${signalLengthValue + 1}).`;
    console.error('Error:', modalMessage.value);
    return false;
  }

  if (startValue > endValue) {
    modalMessage.value = 'El valor de Inicio no puede ser mayor que Fin.';
    console.error('Error:', modalMessage.value);
    return false;
  }

  if (numScales.value < 1) {
    modalMessage.value = 'El valor de Num Scales debe ser al menos 1.';
    console.error('Error:', modalMessage.value);
    return false;
  }

  return true;
};

// Función asíncrona para calcular el CWT
const calcularCWT = async () => {
  if (!signalComputed.value) {
    modalMessage.value = 'El objeto signalObject es null o no está inicializado.';
    console.error('Error:', modalMessage.value);
    loadingStatus.value = false;
    showModal.value = true;
    return;
  }

  const selectedIndex = signalStore.signalSelected;
  const signalJson = toRaw(signalStore.signalJson);

  const [startValue, endValue] = rangeValues.value;

  try {
    console.log('Enviando solicitud gRPC para calcular CWT...');

    console.log("Datos a enviar: ", signalJson[selectedIndex], startValue, endValue, numScales.value);

    const response = await SignalService.computeCWT(
        signalJson[selectedIndex],
        startValue,
        endValue,
        numScales.value
    );

    console.log("Respuesta del servidor: ", response);

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
    <!-- Rango Deslizante para Start y End -->
    <div class="flex flex-col">
      <label class="text-sm font-medium text-gray-700 mb-1">Selecciona el rango</label>
      <VueSlider
          v-model="rangeValues"
          :min="1"
          :max="signalLength + 1"
          :interval="1"
          :use-range="true"
          :lazy="true"
          class="mt-2"
      />
      <div class="flex justify-between text-xs font-semibold mt-2 text-gray-500">
        <span>Inicio: {{ rangeValues[0] }}</span>
        <span>Fin: {{ rangeValues[1] }}</span>
      </div>
    </div>

    <!-- Slider para Num Scales -->
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

  <!-- Modal de Error -->
  <ProcessingToolsDangerModal
      v-if="showModal"
      :message="modalMessage"
      @close="showModal = false"
      @confirm="handleModalConfirm"
  />

  <!-- Indicador de Carga -->
  <div
      class="flex justify-center items-center w-full h-full fixed inset-0 m-auto bg-white bg-opacity-70"
      v-if="loadingStatus"
  >
    <div class="transform scale-[2] flex flex-col justify-center items-center">
      <JellyfishLoader color="#3B82F6" />
      <h2 class="text-blue-600 mt-4">Procesando respuesta...</h2>
    </div>
  </div>
</template>

<style scoped>
/* Estilos para el slider de Num Scales */
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
