<script setup>
import { ref, computed, toRaw } from 'vue';
import { Complex } from '../proto/proto-ts/signal';
import { useSignalStore } from '@/stores/signalStore';
import { SignalService } from '@/services/signalService';

// Obtener la instancia del store
const signalStore = useSignalStore();

// Computed property para acceder a signalObject
const signalComputed = computed(() => signalStore.signalObject);


// Tool 6: Running Sum
const tool6Data = ref({
  field1: ''
});

// Validación de datos y submit
const submitTool6 = () => {
  if (!tool6Data.value.field1)
  {
    console.error('Error: Falta llenar el campo Window Size en Running Sum');
  }
  else
  {
    console.log('Running Sum Tool:', tool6Data.value, 'Signal:', signalStore.signalJson);

    // Llamar a la función para calcular Running Sum
    CalcularRunningSum();
  }
};

// Función para calcular Running Sum
const CalcularRunningSum = async () => {
  // Verificar si signalObject está inicializado
  if (!signalComputed.value) {
    console.error('El objeto signalObject es null o no está inicializado.');
    return;
  }

  // Obtener el objeto raw desde el store
  const signalJson = toRaw(signalStore.signalJson);

  try {
    // Llamada al servicio gRPC para el cálculo de Running Sum
    const response = await SignalService.computeRunningSum(signalJson[0]);
    console.log(response);
  } catch (error) {
    console.error('Error al realizar la solicitud gRPC:', error);
  }
};
</script>


<template>
  <h4 class="text-lg font-semibold text-green-500 mb-4">Running Sum</h4>
  <form @submit.prevent="submitTool6">
    <label class="block text-sm font-medium text-gray-700 mb-2">Window Size:</label>
    <input type="number" v-model="tool6Data.field1"
           class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm mb-4"/>
    <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Procesar...
    </button>
  </form>
</template>