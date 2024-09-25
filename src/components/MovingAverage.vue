<script setup>
import { ref, computed, toRaw } from 'vue';
import { Complex } from '../proto/proto-ts/signal';
import { useSignalStore } from '@/stores/signalStore';
import { SignalService } from '@/services/signalService';

// Accede a la store
const signalStore = useSignalStore();
const signalComputed = computed(() => signalStore.signalObject);

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
    <button @click="calcularPromedioMovil">EL PROMEDIO</button>
</template>