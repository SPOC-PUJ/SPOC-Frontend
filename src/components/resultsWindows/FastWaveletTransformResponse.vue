<script setup>
import { onMounted } from 'vue';
import { useResponseStore } from '@/stores/responseStore.js';

console.log('Fast Wavelet Transform Response Component mounted.');

// Obtain the response store instance
const responseStore = useResponseStore();

onMounted(() => {
  // Retrieve the response from localStorage
  const storedResponse = localStorage.getItem('signalResponse');
  if (storedResponse) {
    const response = JSON.parse(storedResponse);
    // Store it in the response store
    responseStore.setSignalResponse(response);
    // Remove it from localStorage
    localStorage.removeItem('signalResponse');
  } else {
    console.error('No signalResponse found in localStorage');
  }

  // Print the store contents
  console.log('Signal Response:', responseStore.signalResponse);
});
</script>

<template>
  <div>
    <h1>Fast Wavelet Transform Response Component</h1>
    <!-- Display your response data here -->
    <pre>{{ responseStore.signalResponse }}</pre>
  </div>
</template>

<style scoped>

</style>
