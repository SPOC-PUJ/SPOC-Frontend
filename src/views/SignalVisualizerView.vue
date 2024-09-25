<script setup>
import {ref, onMounted} from 'vue';
import SimpleChart from "@/components/SimpleChart.vue";

import FastWaveletTransform from '@/components/FastWaveletTransform.vue';


const fileName = ref(null);

import UploadFileButtonCard from "@/components/UploadFileButtonCard.vue";

const realValues = ref([]); // Array para almacenar los valores reales y pasarlos al graficador


function handleFileProcessed(values) {
  // Almacenar los valores reales obtenidos del EDFReader
  realValues.value = values;
}

</script>

<template>
  <UploadFileButtonCard @fileProcessed="handleFileProcessed"/>
  <div>
    <LoadFileCard @fileProcessed="handleFileProcessed" />
  </div>
  <div>
    <SimpleChart v-bind:data="realValues"/> <!-- Pasar los valores reales al graficador -->

    <FastWaveletTransform/>
  </div>
</template>

<style scoped>

</style>
