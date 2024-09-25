<script setup>
import { ref } from "vue";

import SimpleChart from "@/components/SimpleChart.vue";
import UploadFileButtonCard from "@/components/UploadFileButtonCard.vue";
import ProcessingToolsFormsComponent from "@/components/ProcessingToolsFormsComponent.vue";

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

  <section class="bg-blue-50 px-4 py-10">
    <div class="ProcessingToolsForm justify-center w-1/2 border-green-300 border-2">
      <ProcessingToolsFormsComponent v-bind:data="realValues"/>
    </div>
  </section>


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
.ProcessingToolsForm {

  margin-top: 6rem;
}

</style>