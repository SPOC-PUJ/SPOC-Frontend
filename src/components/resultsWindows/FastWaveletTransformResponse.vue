<script setup>
import { ref, onMounted, toRaw } from 'vue';
import { openDB } from 'idb';
import { useResponseStore } from '@/stores/responseStore.js';
import { JellyfishLoader } from 'vue3-spinner';

// Estado de carga inicial (Jellyfish Loader) como ref para que sea reactivo
const loadingStatus = ref(true);
console.log('Loading Response Status: ', loadingStatus.value);

const responseStore = useResponseStore();

onMounted(async () => {
  const db = await openDB('response-database', 1);
  const response = await db.get('responses', 'signalResponse');

  // Una vez cargada la página, revisar si hay una respuesta almacenada en IndexedDB
  if (response)
  {
    responseStore.setSignalResponse(response);
    // Borrar los datos de la respuesta almacenada en IndexedDB para evitar duplicados.
    await db.delete('responses', 'signalResponse');
  }
  else
  {
    console.error('No signalResponse found in IndexedDB');
  }

  console.log('Signal Response:', responseStore.signalResponse);

  // Acceder a las aproximaciones y detalles utilizando toRaw
  const approximations = toRaw(responseStore.signalResponse.approximations);
  const details = toRaw(responseStore.signalResponse.details);

  // Verificar que existan y sean arreglos
  if (Array.isArray(approximations)) {
    console.log('Approximations:');
    approximations.forEach((approximation, index) => {
      console.log(`Approximation ${index + 1}:`);
      if (Array.isArray(approximation)) {
        // Si approximation es un arreglo, iteramos sobre sus valores
        approximation.forEach((value, idx) => {
          console.log(`  Value ${idx + 1}:`, value);
        });
      } else if (typeof approximation === 'object' && approximation !== null) {
        // Si es un objeto, imprimimos sus propiedades
        const rawApproximation = toRaw(approximation);
        for (const [key, value] of Object.entries(rawApproximation)) {
          console.log(`  ${key}:`, value);
        }
      } else {
        // Si es un valor primitivo, lo imprimimos directamente
        console.log(`  ${approximation}`);
      }
    });
  } else {
    console.error('Approximations is not an array or does not exist.');
  }

  if (Array.isArray(details)) {
    console.log('Details:');
    details.forEach((detail, index) => {
      console.log(`Detail ${index + 1}:`);
      if (Array.isArray(detail)) {
        // Si detail es un arreglo, iteramos sobre sus valores
        detail.forEach((value, idx) => {
          console.log(`  Value ${idx + 1}:`, value);
        });
      } else if (typeof detail === 'object' && detail !== null) {
        // Si es un objeto, imprimimos sus propiedades
        const rawDetail = toRaw(detail);
        for (const [key, value] of Object.entries(rawDetail)) {
          console.log(`  ${key}:`, value);
        }
      } else {
        // Si es un valor primitivo, lo imprimimos directamente
        console.log(`  ${detail}`);
      }
    });
  } else {
    console.error('Details is not an array or does not exist.');
  }

  // Desactivar el estado de carga
  loadingStatus.value = false;
  console.log('Loading Response Status: ', loadingStatus.value);
});
</script>
<h1>Aproximaciones</h1>
<!-- SignalResponseChart (con los valores de aproximaciones) -->

<h1>Detalles</h1>
<!-- SignalResponseChart con los valores de detalles) -->

<template>
  <div class="flex justify-center items-center w-full h-full fixed inset-0 m-auto bg-white bg-opacity-70" v-if="loadingStatus">
    <div class="transform scale-[2] flex flex-col justify-center items-center">
      <JellyfishLoader color="#3B82F6"/>
      <h2 class="text-blue-600 mt-4">Procesando respuesta...</h2>
    </div>
  </div>
</template>
