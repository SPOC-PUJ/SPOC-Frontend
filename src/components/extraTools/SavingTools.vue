<!-- SavingTools.vue -->
<script setup>
import { useResponseStore } from '@/stores/responseStore.js';

const emit = defineEmits(['download-image']);

const responseStore = useResponseStore();

const downloadCSV = () => {
  const signalData = responseStore.signalResponse;
  if (!signalData) {
    alert('No hay datos de señal disponibles para descargar.');
    return;
  }

  // Convertir signalData a formato CSV
  let csvContent = '';

  if (Array.isArray(signalData)) {
    if (signalData.length > 0 && typeof signalData[0] === 'object') {
      // Si signalData es un array de objetos
      const headers = Object.keys(signalData[0]).join(',');
      csvContent += headers + '\n';
      signalData.forEach(row => {
        const values = Object.values(row).join(',');
        csvContent += values + '\n';
      });
    } else {
      // Si signalData es un array de números o strings
      csvContent = signalData.join('\n');
    }
  } else {
    alert('Formato de datos no soportado para exportación CSV.');
    return;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'signalData.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const downloadImage = () => {
  emit('download-image');
}
</script>

<template>
  <div class="saving-tools">
    <button @click="downloadCSV">Descargar CSV</button>
    <button @click="downloadImage">Descargar Imagen</button>
  </div>
</template>
