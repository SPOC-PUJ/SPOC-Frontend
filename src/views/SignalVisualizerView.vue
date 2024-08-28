<script setup>
import { ref, onMounted } from 'vue';
import SimpleChart from "@/components/SimpleChart.vue";

import SumComponent from '@/components/SumComponent.vue';
import MovingAverage from '@/components/MovingAverage.vue';
const fileName = ref(null);

import LoadFileCard from "@/components/LoadFileCard.vue";

const realValues = ref([]); // Array para almacenar los valores reales y pasarlos al graficador


function handleFileProcessed(values) {
  // Almacenar los valores reales obtenidos del EDFReader
  realValues.value = values;
}

</script>

<template>
  <div class="border-dotted border-4 border-red-400">
    <LoadFileCard @fileProcessed="handleFileProcessed" />
  </div>
  <div class="border-dotted border-4 border-sky-500">

    <SimpleChart/>
    <!-- <SumComponent/> -->
    <MovingAverage/>
  </div>
  

    <SimpleChart v-bind:data="realValues"/> <!-- Pasar los valores reales al graficador -->
  </div>

</template>

<style scoped>

</style>
