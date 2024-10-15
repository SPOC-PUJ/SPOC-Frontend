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

  <!-- Aquí el fondo se extiende hasta el final de la página -->
  <section class="flex-grow bg-gradient-to-t from-slate-300 via-slate-50 to-white px-4 py-10 shadow-md rounded-lg min-h-[calc(100vh-40vh)]">
    <div class="ProcessingToolsForm justify-center">
      <ProcessingToolsFormsComponent v-bind:data="realValues"/>
    </div>
  </section>
</template>

<style scoped>
.ProcessingToolsForm {
  margin-top: 6rem;
}
</style>