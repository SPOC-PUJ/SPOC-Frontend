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

// Variable para el nivel de resolución
const resolutionLevel = ref(2); // 1: Baja, 2: Media, 3: Alta

// Computed para Num Scales basado en resolutionLevel
const numScales = computed(() => {
  if (resolutionLevel.value === 1) return 30;
  if (resolutionLevel.value === 2) return 75;
  if (resolutionLevel.value === 3) return 120;
  return 75; // Valor por defecto
});

// Marcas para el slider
const marks = {
  1: 'Baja',
  2: 'Media',
  3: 'Alta',
};

// Formatear el tooltip del slider
const formatTooltip = (value) => {
  if (value === 1) return 'Resolución Baja';
  if (value === 2) return 'Resolución Media';
  if (value === 3) return 'Resolución Alta';
  return '';
};

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
    <div class="flex flex-col items-center">
      <label class="text-sm font-medium text-gray-700 mb-1">Selecciona el rango</label>
      <div class="slider-container">
        <VueSlider
            v-model="rangeValues"
            :min="1"
            :max="signalLength + 1"
            :interval="1"
            :use-range="true"
            :lazy="true"
            class="mt-2 slider"
            :dot-size="20"
            :height="6"
            :process-style="{ backgroundColor: '#3B82F6' }"
            :rail-style="{ backgroundColor: '#D1D5DB' }"
        />
      </div>
      <div class="flex justify-between text-xs font-semibold mt-2 text-gray-500 w-full">
        <span>Inicio: {{ rangeValues[0] }}</span>
        <span>Fin: {{ rangeValues[1] }}</span>
      </div>
    </div>

    <!-- Slider para Resolución -->
    <div class="flex flex-col items-center">
      <label class="text-sm font-medium text-gray-700 mb-1">Resolución</label>
      <div class="slider-container">
        <VueSlider
            v-model="resolutionLevel"
            :min="1"
            :max="3"
            :step="1"
            :marks="marks"
            :tooltip="'always'"
            :tooltip-formatter="formatTooltip"
            class="mt-2 slider"
            :dot-size="20"
            :height="6"
            :process-style="{ backgroundColor: '#3B82F6' }"
            :rail-style="{ backgroundColor: '#D1D5DB' }"
        />
      </div>
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
.slider-container {
  width: 95%;
  margin: 0 auto;
}

.vue-slider {
  margin-top: 1rem;
}

.vue-slider-mark {
  font-size: 0.75rem;
  color: #4B5563; /* Texto en gris */
  white-space: nowrap;
}

.vue-slider-mark-text {
  transform: translateX(-50%);
  display: flex;
  align-items: center;
}

/* Ajustar las posiciones de las marcas */
.vue-slider-mark-1 .vue-slider-mark-text {
  left: 0% !important;
  transform: translateX(0%);
}

.vue-slider-mark-3 .vue-slider-mark-text {
  left: 100% !important;
  transform: translateX(-100%);
}

.vue-slider-mark-2 .vue-slider-mark-text {
  left: 50% !important;
}

.vue-slider-dot {
  background-color: #3B82F6; /* Azul */
  border: none;
}

.vue-slider-tooltip {
  background-color: #3B82F6;
  border-color: #3B82F6;
}

/* Estilos comunes */
.vue-slider-dot {
  border: none;
}
</style>
