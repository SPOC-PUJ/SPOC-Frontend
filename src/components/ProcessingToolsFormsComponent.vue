<script setup>
import { ref } from 'vue';
import MovingAverage from "@/components/MovingAverage.vue";
import FastWaveletHarr from "@/components/FastWaveletHarr.vue";
import FastWaveletTransform from "@/components/FastWaveletTransform.vue";
import FirstDifference from "@/components/FirstDifference.vue";
import IFFTComponent from "@/components/IFFTComponent.vue";
import RunningSum from "@/components/RunningSum.vue";
import AverageComponent from "@/components/AverageComponent.vue";
import FFTComponent from "@/components/FFTComponent.vue";
import CWTComponent from "@/components/CWTComponent.vue";

// Reactive variables
const selectedTool = ref('');
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-6 border-2">
    <div class="mb-6 text-center">
      <h3 class="text-xl font-bold text-gray-800">Herramientas de Procesamiento</h3>
      <p class="text-gray-600">Seleccione una de las herramientas para poder introducir los parámetros necesarios.</p>
    </div>

    <div class="mb-5">
      <label for="toolSelect" class="block text-sm font-medium text-gray-700 mb-2">Seleccione una herramienta:</label>
      <div class="relative">
        <select id="toolSelect" v-model="selectedTool"
                class="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm">
          <option value="" disabled>Seleccione una herramienta</option>
          <!-- <option value="FastWaveletHarr">Transformada Wavelet Rápida Harr (HECHO)</option> -->
          <option value="FastWaveletTransform">Descomposición Wavelet</option>
          <option value="MovingAverage">Media Móvil</option>
          <option value="SignalAverage">Promediar Señales</option>
          <!-- <option value="FirstDifference">Primera Diferencia (HECHO)</option> -->
          <!-- <option value="IFFT-Tool">Transformada Inversa de Fourier Rápida (HECHO)</option> -->
          <option value="FFT-Tool">Transformada Rápida de Fourier</option>
          <option value="CWT-Tool">Transformada Wavelet</option>
          <!-- <option value="RunningSum">Suma Acumulativa</option> -->

        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
          </svg>
        </div>
      </div>
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

    <!-- Formulario para la Herramienta 5: Moving Average -->
    <div v-if="selectedTool === 'MovingAverage'" class="mb-6">
      <MovingAverage/>
    </div>

    <!-- Formulario para la Herramienta 3: Signal Average -->
    <div v-if="selectedTool === 'SignalAverage'" class="mb-6">
      <AverageComponent/>
    </div>

    <!-- Formulario para la Herramienta 3: First Difference -->
    <div v-if="selectedTool === 'FirstDifference'" class="mb-6">
      <FirstDifference/>
    </div>

    <!-- Formulario para la Herramienta 4: Inverse Fast Fourier Transform -->
    <div v-if="selectedTool === 'IFFT-Tool'" class="mb-6">
      <IFFTComponent/>
    </div>

    <!-- Formulario para la Herramienta 7: Fast Fourier Transform -->
    <div v-if="selectedTool === 'FFT-Tool'" class="mb-6">
      <FFTComponent/>
    </div>

    <!-- Formulario para la Herramienta 8: Continuous Wavelet Transform -->
    <div v-if="selectedTool === 'CWT-Tool'" class="mb-6">
      <CWTComponent/>
    </div>

    <!-- Formulario para la Herramienta 6: Running Sum -->
    <div v-if="selectedTool === 'RunningSum'" class="mb-6">
      <RunningSum/>
    </div>
  </div>
</template>

<style scoped>
/* Personalización adicional para el select para hacerlo más atractivo */
select {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
}
</style>