<script setup>
import { ref } from 'vue';
import MovingAverage from "@/components/MovingAverage.vue";
import FastWaveletHarr from "@/components/FastWaveletHarr.vue";
import FastWaveletTransform from "@/components/FastWaveletTransform.vue";
import FirstDifference from "@/components/FirstDifference.vue";
import IFFTComponent from "@/components/IFFTComponent.vue";
import RunningSum from "@/components/RunningSum.vue";


// Reactive variables
const selectedTool = ref('');
</script>


<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    <div class="mb-6 text-center">
      <h3 class="text-xl font-bold">Herramientas de Procesamiento</h3>
      <p class="text-gray-600">Seleccione una de las herraientas para poder introducir los paramentros necesarios.</p>
    </div>

    <div class="mb-5">
      <label for="toolSelect" class="block text-sm font-medium text-gray-700 mb-2">Seleccione una herraienta:</label>
      <select id="toolSelect" v-model="selectedTool"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm">
        <option value="" disabled>Select a tool</option>
        <option value="FastWaveletHarr">Fast Wavelet Harr</option>
        <option value="FastWaveletTransform">Fast Wavelet Transform</option>
        <option value="FirstDifference">First Difference</option>
        <option value="IFFT-Tool">Inverse Fast Fourier Transform</option>
        <option value="MovingAverage">Moving Average</option>
        <option value="RunningSum">Running Sum</option>
      </select>
    </div>

    <!-- Formularios Condicionales -->
    <!-- Formulario para la Herramienta 1: Fast Wavelet Harr -->
    <div v-if="selectedTool === 'FastWaveletHarr'" class="mb-6">
      <FastWaveletHarr/>
    </div>

    <!-- Formulario para la Herramienta 2: Fast Wavelet Transform -->
    <div v-if="selectedTool === 'FastWaveletTransform'" class="mb-6">
      <FastWaveletTransform/>
    </div>


    <!-- Formulario para la Herramienta 3: First Difference -->
    <div v-if="selectedTool === 'FirstDifference'" class="mb-6">
      <FirstDifference/>
    </div>

    <!-- Formulario para la Herramienta 4: Inverse Fast Fourier Transform -->
    <div v-if="selectedTool === 'IFFT-Tool'" class="mb-6">
      <IFFTComponent/>
    </div>

    <!-- Formulario para la Herramienta 5: Moving Average -->
    <div v-if="selectedTool === 'MovingAverage'" class="mb-6">
      <MovingAverage/>
    </div>

    <!-- Formulario para la Herramienta 6: Running Sum -->
    <div v-if="selectedTool === 'RunningSum'" class="mb-6">
      <RunningSum/>
    </div>

  </div>
</template>

<style scoped>
</style>
