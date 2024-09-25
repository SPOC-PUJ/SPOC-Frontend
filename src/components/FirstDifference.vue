<script setup>
import {ref, computed, toRaw} from 'vue';
import {Complex} from '../proto/proto-ts/signal';
import {useSignalStore} from '@/stores/signalStore';
import {SignalService} from '@/services/signalService';

// Obtener la instancia del store
const signalStore = useSignalStore();

// Computed property para acceder a signalObject
const signalComputed = computed(() => signalStore.signalObject);

// Tool 3: First Difference
const submitTool3 = () => {
  if (!signalStore.signalJson)
  {
    console.error('El objeto signalObject es null o no está inicializado.');
  }
  else
  {
    console.log('First Difference Tool:', signalStore.signalJson);

    // Llamar a la función para calcular First Difference
    calcularFirstDifference();
  }
};

// Función para calcular First Difference
const calcularFirstDifference = async () => {
  // Verificar si signalObject está inicializado
  if (!signalComputed.value)
  {
    console.error('El objeto signalObject es null o no está inicializado.');
    return;
  }

  // Obtener el objeto raw desde el store
  const signalJson = toRaw(signalStore.signalJson);
  console.log('después de traer el json', signalJson[0]);

  try
  {
    // Llamada al servicio gRPC para el cálculo de First Difference
    const response = await SignalService.computeFirstDifference(signalJson[0]);
    console.log(response);
  }
  catch (error)
  {
    console.error('Error al realizar la solicitud gRPC:', error);
  }
};
</script>


<template>
  <h4 class="text-lg font-semibold text-green-500 mb-4">First Difference</h4>
  <form @submit.prevent="submitTool3">
    <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Procesar...</button>
  </form>
</template>