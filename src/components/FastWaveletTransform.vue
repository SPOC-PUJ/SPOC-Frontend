<script setup>
import { ref, computed, toRaw } from 'vue';
import { useSignalStore } from '@/stores/signalStore';
import { SignalService } from '@/services/signalService';
import { openDB } from 'idb';
import ProcessingToolsDangerModal from "@/components/dangerModals/ProcessingToolsDangerModal.vue";

// Obtener la instancia del store
const signalStore = useSignalStore();

// Computed property para acceder a signalObject
const signalComputed = computed(() => signalStore.signalObject);

// Variables para el modal
const showModal = ref(false);
const modalMessage = ref('');

// Tool 2: Fast Wavelet Transform data
const tool2Data = ref({
  decLevel: '',
  waveName: 'db1' // valor por defecto
});

// Tool 2: Fast Wavelet Transform
const submitTool2 = () => {
  if (!tool2Data.value.decLevel)
  {
    modalMessage.value = 'Falta llenar el campo Dec Level en el Fast Wavelet Transform.';
    console.error(modalMessage.value);
    showModal.value = true;
  }
  else
  {
    console.log('Fast Wavelet Transform:', tool2Data.value, 'Signal:', signalStore.signalJson);

    // Llamar a la función para calcular Fast Wavelet Transform
    calcularFastWaveletTransform();
  }
};

// Función para calcular Fast Wavelet Transform
const calcularFastWaveletTransform = async () => {
  // Verificar si signalObject está inicializado
  if (!signalComputed.value)
  {
    modalMessage.value = 'El objeto signalObject es null o no está inicializado.';
    console.error(modalMessage.value);
    showModal.value = true;
    return;
  }

  // Obtener el índice de la señal seleccionada
  const selectedIndex = signalStore.signalSelected;

  // Obtener el objeto raw desde el store
  const signalJson = toRaw(signalStore.signalJson);

  console.log('Signal JSON:', signalJson);
  console.log('Selected Index:', selectedIndex);
  console.log('Signal:', signalJson[selectedIndex]);
  console.log('Signal Numbers:', signalJson[selectedIndex].values);

  // Obtener la longitud de la señal
  const n = signalJson[selectedIndex].values.length;

  // Convertir decLevel a número
  const decLevel = Number(tool2Data.value.decLevel);

  // Calcular log2(n)
  const maxDecLevel = Math.floor(Math.log2(n));

  // Validar que decLevel es un número entero entre 1 y maxDecLevel
  if (!Number.isInteger(decLevel) || decLevel < 1 || decLevel > maxDecLevel)
  {
    modalMessage.value = `Dec Level debe ser un número entero entre 1 y log2(n) = ${maxDecLevel}. Valor proporcionado: ${decLevel}`;
    console.error(modalMessage.value);
    showModal.value = true; // Mostrar el modal

    return;
  }

  try {
    // Llamada al servicio gRPC para el cálculo de Fast Wavelet Transform
    const response = await SignalService.computeFastWaveletTransform(signalJson[selectedIndex], decLevel, tool2Data.value.waveName);
    console.log('Raw Response: ', response);

    // Guardar la respuesta en la base de datos.
    const db = await openDB('response-database', 2, {
      upgrade(db) {
        db.createObjectStore('responses');
      },
    });
    await db.put('responses', response, 'signalResponse');

    // Abrir otra ventana (nueva tab), el componente de esta nueva tab es ServiceResponseView.vue
    window.open('/response-results/FastWaveletTransform', '_blank');
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
  <h4 class="text-lg font-semibold text-green-500 mb-4">Fast Wavelet Transform</h4>
  <form @submit.prevent="submitTool2">
    <!-- Dec Level -->
    <label class="block text-sm font-medium text-gray-700 mb-2">Dec Level:</label>
    <input
        type="number"
        v-model="tool2Data.decLevel"
        step="1"
        min="1"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm mb-4"
    />

    <!-- Wave Name (Select Menu) -->
    <label class="block text-sm font-medium text-gray-700 mb-2">Wave Name:</label>
    <select
        v-model="tool2Data.waveName"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm mb-4"
    >
      <option value="db1">Daubechies 1 (db1)</option>
      <option value="db2">Daubechies 2 (db2)</option>
      <option value="db3">Daubechies 3 (db3)</option>
      <option value="db4">Daubechies 4 (db4)</option>
      <option value="bior3.1">Biorthogonal 3.1</option>
    </select>

    <button
        type="submit"
        class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
    >
      Submit Tool 2
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