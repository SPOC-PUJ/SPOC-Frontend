<script setup>
import { ref, onMounted } from 'vue';
import { openDB } from 'idb';
import { useResponseStore } from '@/stores/responseStore.js';
import { JellyfishLoader } from "vue3-spinner";

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

  // Desactivar el estado de carga
  loadingStatus.value = false;
  console.log('Loading Response Status: ', loadingStatus.value);
});
</script>

<template>
  <div>
    <h1>Fast Wavelet Transform Response Component</h1>
  </div>

  <div class="flex justify-center items-center w-full h-full fixed inset-0 m-auto bg-white bg-opacity-70"
       v-if="loadingStatus">
    <div class="transform scale-[2] flex justify-center items-center">
      <JellyfishLoader color="#3B82F6"/>
      <h2 class="#3B82F6">Procesando respuesta...</h2>
    </div>
  </div>
</template>
