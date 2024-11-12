<script setup>
import { ref, computed, toRaw, watch } from 'vue';
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
  decLevel: 1, // Valor inicial (se actualizará al valor máximo)
  waveName: 'db1' // valor por defecto
});

// Obtener el índice de la señal seleccionada
const selectedIndex = computed(() => signalStore.signalSelected);

// Obtener el objeto raw desde el store
const signalJson = computed(() => toRaw(signalStore.signalJson));

// Calcular n (longitud de la señal)
const n = computed(() =>
{
  if (signalJson.value && signalJson.value[selectedIndex.value] && signalJson.value[selectedIndex.value].values)
  {
    return signalJson.value[selectedIndex.value].values.length;
  }
  else
  {
    return 0;
  }
});

// Calcular maxDecLevel
const maxDecLevel = computed(() =>
{
  if (n.value > 0)
  {
    return Math.floor(Math.log2(n.value));
  }
  else
  {
    return 1;
  }
});

// Actualizar decLevel cuando maxDecLevel cambie
watch(
    maxDecLevel,
    (newMax) => {
      if (newMax > 0)
      {
        tool2Data.value.decLevel = newMax;
      }
      else
      {
        tool2Data.value.decLevel = 1;
      }
    },
    { immediate: true } // Ejecutar inmediatamente al montar el componente
);

// Tool 2: Fast Wavelet Transform
const submitTool2 = () => {
  if (!tool2Data.value.decLevel)
  {
    modalMessage.value = 'Falta seleccionar el nivel de descomposición en el Fast Wavelet Transform.';
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
  if (!signalStore.signalJson)
  {
    modalMessage.value = 'El objeto signalObject es null o no está inicializado.';
    console.error(modalMessage.value);
    showModal.value = true;
    return;
  }

  // Obtener la longitud de la señal
  const nValue = n.value;

  // Convertir decLevel a número
  const decLevel = Number(tool2Data.value.decLevel);

  // Calcular maxDecLevel
  const maxDecLevelValue = maxDecLevel.value;

  // Validar que decLevel es un número entero entre 1 y maxDecLevel
  if (!Number.isInteger(decLevel) || decLevel < 1 || decLevel > maxDecLevelValue)
  {
    modalMessage.value = `El nivel de descomposición debe ser un número entero entre 1 y log2(n) = ${maxDecLevelValue}. Valor proporcionado: ${decLevel}`;
    console.error(modalMessage.value);
    showModal.value = true; // Mostrar el modal

    return;
  }

  try
  {
    // Llamada al servicio gRPC para el cálculo de Fast Wavelet Transform
    console.log('Datos a enviar:', signalJson.value[selectedIndex.value], decLevel, tool2Data.value.waveName);

    const response = await SignalService.computeFastWaveletTransform(signalJson.value[selectedIndex.value], decLevel, tool2Data.value.waveName);
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
  <h4 class="text-lg font-semibold text-green-500 mb-4">Descomposición Wavelet</h4>
  <form @submit.prevent="submitTool2">
    <!-- Niveles de Descomposición (Slider) -->
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Niveles de Descomposición: <span class="font-bold text-green-500">{{ tool2Data.decLevel }}</span>
    </label>
    <div class="mb-6">
      <input
          type="range"
          v-model="tool2Data.decLevel"
          :min="1"
          :max="maxDecLevel"
          step="1"
          class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
      />
    </div>

    <!-- Wave Name (Select Menu) -->
    <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de la Wavelet:</label>
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

<style scoped>
/* Estilos personalizados para el slider */
input[type="range"].slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
}

input[type="range"].slider-thumb:focus {
  outline: none;
}

/* Estilos para la pista del slider */
input[type="range"].slider-thumb::-webkit-slider-runnable-track {
  width: 100%;
  height: 8px;
  background: #d1d5db; /* Tailwind's gray-300 */
  border-radius: 4px;
  cursor: pointer;
}

input[type="range"].slider-thumb::-moz-range-track {
  width: 100%;
  height: 8px;
  background: #d1d5db;
  border-radius: 4px;
  cursor: pointer;
}

input[type="range"].slider-thumb::-ms-track {
  width: 100%;
  height: 8px;
  background: transparent;
  border-color: transparent;
  color: transparent;
  cursor: pointer;
}

/* Estilos para el pulgar del slider */
input[type="range"].slider-thumb::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  margin-top: -5px; /* Ajustar según la altura de la pista */
  width: 18px;
  height: 18px;
  background: #10b981; /* Tailwind's green-500 */
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease;
}

input[type="range"].slider-thumb:hover::-webkit-slider-thumb {
  background: #059669; /* Tailwind's green-600 */
}

input[type="range"].slider-thumb:active::-webkit-slider-thumb {
  background: #047857; /* Tailwind's green-700 */
}

input[type="range"].slider-thumb::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #10b981;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease;
}

input[type="range"].slider-thumb:hover::-moz-range-thumb {
  background: #059669;
}

input[type="range"].slider-thumb:active::-moz-range-thumb {
  background: #047857;
}

input[type="range"].slider-thumb::-ms-thumb {
  width: 18px;
  height: 18px;
  background: #10b981;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease;
}

input[type="range"].slider-thumb:hover::-ms-thumb {
  background: #059669;
}

input[type="range"].slider-thumb:active::-ms-thumb {
  background: #047857;
}

/* Estilos para el relleno antes del pulgar */
input[type="range"].slider-thumb::-moz-range-progress {
  background-color: #10b981;
  height: 8px;
  border-radius: 4px;
}

input[type="range"].slider-thumb::-ms-fill-lower {
  background-color: #10b981;
  border-radius: 4px;
}
</style>
