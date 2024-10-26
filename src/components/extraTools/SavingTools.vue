<!-- SavingTools.vue -->
<script setup>
import { useResponseStore } from '@/stores/responseStore.js';
import { toRaw } from 'vue'; // Importa toRaw para desreactivar los datos

const emit = defineEmits(['download-image']);
const responseStore = useResponseStore();

const downloadCSV = () => {
  const signalData = toRaw(responseStore.signalResponse.result); // Desenvuelve los datos reactivos

  console.log('Signal Data: ', signalData);

  if (!signalData || !Array.isArray(signalData) || signalData.length === 0) {
    alert('No hay datos de señal disponibles para descargar.');
    return;
  }

  // Inicializar contenido del CSV con encabezados explícitos
  let csvContent = 'real,imag\n';

  // Recorrer cada objeto del array y construir las filas del CSV
  signalData.forEach(row => {
    const realValue = row.real !== undefined ? row.real.toFixed(6) : '';
    const imagValue = row.imag !== undefined ? row.imag.toFixed(6) : '';

    csvContent += `${realValue},${imagValue}\n`;
  });

  // Crear un blob y enlace para descargar el archivo CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'signalData.csv');
  link.style.visibility = 'hidden';

  // Descargar el archivo y limpiar el enlace temporal
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadImage = () => {
  emit('download-image');
};
</script>

<template>
  <div class="saving-tools">
    <button @click="downloadCSV">Descargar CSV</button>
    <button @click="downloadImage">Descargar Imagen</button>
  </div>
</template>
