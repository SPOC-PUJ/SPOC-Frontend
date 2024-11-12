<script setup>
import {ref, onMounted} from 'vue';
import SimpleChart from "@/components/SimpleChart.vue";

const fileName = ref(null);

import UploadFileButtonCard from "@/components/UploadFileButtonCard.vue";
import CWTComponent from '@/components/CWTComponent.vue';

const realValues = ref([]); // Array para almacenar los valores reales y pasarlos al graficador


function handleFileProcessed(values) {
  // Almacenar los valores reales obtenidos del EDFReader
  realValues.value = values;
}

</script>

<template>
  <UploadFileButtonCard @fileProcessed="handleFileProcessed"/>
  <div class="flex justify-center">
    <SimpleChart v-bind:data="realValues" class="h-[80vh] w-full"/> <!-- Pasar los valores reales al graficador -->
  </div>
</template>

<style scoped>

</style>
