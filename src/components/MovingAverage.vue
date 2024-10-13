<script setup>
import { ref, computed, toRaw } from 'vue';
import { Complex } from '../proto/proto-ts/signal';
import { useSignalStore } from '@/stores/signalStore';
import { SignalService } from '@/services/signalService';
import {openDB} from "idb";

// Accede a la store
const signalStore = useSignalStore();
const signalComputed = computed(() => signalStore.signalObject);


// Tool 5: Moving Average
const tool5Data = ref({
  field1: ''
});

// Tool 5: Moving Average
const submitTool5 = () => {
  if (!tool5Data.value.field1) {
    console.error('Error: Falta llenar el campo Window Size en Tool 5');
  } else {
    console.log('Tool 5 Data:', tool5Data.value, 'Signal Store:', signalStore.signalJson, 'Signal Selected:', signalStore.signalSelected);

    calcularPromedioMovil()
  }
};


const calcularPromedioMovil = async () => {
  if (!signalComputed.value) {
    console.error('El objeto signalObject es null o no está inicializado.');
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
    const db = await openDB('response-database', 1, {
      upgrade(db) {
        db.createObjectStore('responses');
      },
    });
    await db.put('responses', response, 'signalResponse');

    // Abrir otra ventana (nueva tab), el componente de esta nueva tab es ServiceResponseView.vue
    window.open('/response-results/MovingAverage', '_blank');
  } catch (error) {
    console.error('Error al realizar la solicitud gRPC:', error);
  }
};
</script>


<template>
    <h4 class="text-lg font-semibold text-green-500 mb-4">Moving Average</h4>
    <form @submit.prevent="submitTool5">
      <label class="block text-sm font-medium text-gray-700 mb-2">Window Size:</label>
      <input type="number" v-model="tool5Data.field1" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm mb-4"/>
      <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Procesar...</button>
    </form>
</template>