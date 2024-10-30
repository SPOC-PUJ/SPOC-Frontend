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
  <div class="saving-tools flex space-x-4">
    <button
        @click="downloadCSV"
        class="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
    >
      <i class="pi pi-file-excel mr-2"></i>
      Descargar CSV
    </button>

    <button
        @click="downloadImage"
        class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
    >
      <i class="pi pi-image mr-2"></i>
      Descargar Imagen
    </button>
  </div>
</template>

<style scoped>
.saving-tools {
  justify-content: center;
  align-items: center;
}
</style>
