<script setup>
import { onMounted } from 'vue';
import { openDB } from 'idb';
import { useResponseStore } from '@/stores/responseStore.js';

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
});
</script>

<template>
  <div>
    <h1>Fast Wavelet Transform Response Component</h1>
  </div>
</template>
