<script setup>
import { ref, onMounted } from 'vue';
import EdfReader from '@/components/EdfReader.vue';
import SimpleChart from "@/components/SimpleChart.vue";
import SumComponent from '@/components/SumComponent.vue';
const fileName = ref(null);

function handleFileUpload(event) {
  const file = event.target.files[0];
  const validTypes = ['application/pdf', 'application/octet-stream', 'application/x-edf'];

  if (file) {
    if (validTypes.includes(file.type)) {
      console.log('Archivo correcto:', file.name);
      fileName.value = file.name;
      localStorage.setItem('uploadedFileName', file.name);
      // Aquí puedes guardar el archivo completo o procesarlo según tus necesidades
    } else {
      console.log('Tipo de archivo incorrecto:', file.type);
    }
  }
}

onMounted(() => {
  const storedFileName = localStorage.getItem('uploadedFileName');
  if (storedFileName) {
    fileName.value = storedFileName;
  }
});
</script>

<template>
  <div class="border-dotted border-4 border-red-400">
    <h1>Signal Visualizer</h1>
    <input type="file" @change="handleFileUpload"/>
    <p v-if="fileName">Archivo cargado: {{ fileName }}</p>
    <EdfReader/>
  </div>
  <div class="border-dotted border-4 border-sky-500">
    <SimpleChart/>
    <SumComponent/>
  </div>
  
</template>

<style scoped>

</style>