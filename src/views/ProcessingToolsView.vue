<script setup>
import { ref } from "vue";

import SimpleChart from "@/components/SimpleChart.vue";
import UploadFileButtonCard from "@/components/UploadFileButtonCard.vue";

const realValues = ref([]); // Array para almacenar los valores reales y pasarlos al graficador

function handleFileProcessed(values) {
  // Almacenar los valores reales obtenidos del EDFReader
  realValues.value = values;
}
</script>

<template>
  <UploadFileButtonCard @fileProcessed="handleFileProcessed"/>
  <div class="flex justify-center">
    <SimpleChart v-bind:data="realValues" class="h-[40vh] w-full"/>  <!-- Pasar los valores reales al graficador -->
  </div>

  <!-- Components to add

  <FastWaveletHarr/>
  <FastWaveletTransform/>
  <FirstDifference/>
  <IFFTComponent/>
  <MovingAverage/>
  <RuningSum/>

  -->
</template>

<style scoped>

</style>