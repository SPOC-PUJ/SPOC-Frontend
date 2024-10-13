<script setup>
import FastWaveletHaarResponse from "@/components/resultsWindows/FastWaveletHaarResponse.vue";
import FastWaveletTransformResponse from "@/components/resultsWindows/FastWaveletTransformResponse.vue";

console.log('ServiceResponseView.vue');

// Variable donde se almacenará la herramienta seleccionada
let selectedTool = null;

// Obtener la ruta actual y el último segmento para saber que herramienta se está utilizando
const lastSegment = (window.location.pathname).substring((window.location.pathname).lastIndexOf('/') + 1);

console.log('Last Segment of the URL:', lastSegment);

// Mostrar componente dependiendo de la herramienta seleccionada
switch (lastSegment) {
  case 'FastWaveletHaar':
    console.log('Fast Wavelet Harr');
    selectedTool = "FastWaveletHaarResponse";
    break;

  case 'FastWaveletTransform':
    console.log('Fast Wavelet Transform');
    selectedTool = "FastWaveletTransformResponse";
    break;

  case 'FirstDifference':
    console.log('First Difference');
    // TODO
    break;

  case 'IFFT-Tool':
    console.log('Inverse Fast Fourier Transform');
    // TODO
    break;

  case 'MovingAverage':
    console.log('Moving Average');
    // TODO
    break;
  case 'RunningSum':
    console.log('Running Sum');
    // TODO
    break;

  default:
    console.error('No se ha seleccionado ninguna herramienta.');
    // TODO
    break;
}
</script>

<template>
  <FastWaveletHaarResponse v-if="selectedTool === 'FastWaveletHaarResponse'"></FastWaveletHaarResponse>
  <FastWaveletTransformResponse v-if="selectedTool === 'FastWaveletTransformResponse'"></FastWaveletTransformResponse>
</template>

<style scoped>

</style>