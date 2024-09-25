<script setup>
import { ref, computed, toRaw } from 'vue';
import { Complex } from '../proto/proto-ts/signal';
import { useSignalStore } from '@/stores/signalStore';
import { SignalService } from '@/services/signalService';

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
    console.log('Tool 5 Data:', tool5Data.value, 'Signal Store:', signalStore.signalJson);

    calcularPromedioMovil()
  }
};


const calcularPromedioMovil = async () => {
  if (!signalComputed.value) {
    console.error('El objeto signalObject es null o no está inicializado.');
    return;
  }

  // Comentario original, en caso de que se requiera más adelante.
  // const signal = toRaw(signalStore.signalObject);
  // const signalData = [];
  // const veceigen = signal.get(0);

  // for(let i = 0; i < veceigen.size; i++) {
  //   const complexValue = veceigen.get(i);
  //   signalData.push(Complex.create({ real: complexValue.real(), imag: complexValue.imag() }));
  // }

  const signalJson = toRaw(signalStore.signalJson);
  console.log("Después de traer el JSON", signalJson[0]);

  try {
    const response = await SignalService.computeMovingAverage(signalJson[0], 10);
    console.log(response);
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