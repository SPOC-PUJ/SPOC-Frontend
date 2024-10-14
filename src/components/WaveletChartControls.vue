<script setup>
import { ref, watch } from 'vue';
import { useResponseStore } from '@/stores/responseStore';

const responseStore = useResponseStore();

// Obtener el número total de niveles de descomposición disponibles
const totalLevels = ref(0);

// Obtenemos las aproximaciones y detalles para determinar el número de niveles
watch(
    () => responseStore.signalResponse,
    (newResponse) => {
      if (newResponse) {
        const approximations = newResponse.approximations || [];
        const details = newResponse.details || [];
        totalLevels.value = Math.max(approximations.length, details.length);
      }
    },
    { immediate: true }
);

// Función para actualizar el índice seleccionado
function updateDecLevelIndex(event) {
  const selectedIndex = parseInt(event.target.value, 10);
  responseStore.fastFourierTransformDecLevelIndex = selectedIndex;
}

</script>

<template>
  <!-- Sección de controles para Wavelet -->
  <div class="p-4 bg-green-50 rounded-lg shadow-md flex items-center justify-between space-x-4">
    <!-- Selector de nivel de descomposición -->
    <div class="flex items-center space-x-2">
      <label for="decLevelSelect" class="font-semibold text-black">
        Seleccionar Nivel de Descomposición:
      </label>
      <select
          id="decLevelSelect"
          :value="responseStore.fastFourierTransformDecLevelIndex"
          @change="updateDecLevelIndex"
          class="form-select"
      >
        <option v-for="level in totalLevels" :key="level - 1" :value="level - 1">
          Nivel {{ level }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
/* Puedes agregar estilos personalizados aquí */
</style>
