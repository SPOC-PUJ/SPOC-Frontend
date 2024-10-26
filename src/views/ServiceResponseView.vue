<script setup>
import FastWaveletHaarResponse from "@/components/resultsWindows/FastWaveletHaarResponse.vue";
import FastWaveletTransformResponse from "@/components/resultsWindows/FastWaveletTransformResponse.vue";
import MovingAverageResponse from "@/components/resultsWindows/MovingAverageResponse.vue";
import SignalAverageResponse from "@/components/resultsWindows/SignalAverageResponse.vue";
import FirstDifferenceResponse from "@/components/resultsWindows/FirstDifferenceResponse.vue";
import IFFTResponse from "@/components/resultsWindows/IFFTResponse.vue";
import FFTComponent from "@/components/FFTComponent.vue";
import FFTResponse from "@/components/resultsWindows/FFTResponse.vue";
import ContinuousWaveletTransformResponse from "@/components/resultsWindows/ContinuousWaveletTransformResponse.vue";

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

  case 'MovingAverage':
    console.log('Moving Average');
    selectedTool = "MovingAverageResponse";
    break;

  case 'SignalAverage':
    console.log('Signal Average');
    selectedTool = "SignalAverageResponse";
    break;

  case 'FirstDifference':
    console.log('First Difference');
    selectedTool = "FirstDifferenceResponse";
    break;

  case 'IFFT-Tool':
    console.log('Inverse Fast Fourier Transform');
    selectedTool = "IFFTResponse";
    break;

  case 'FFT-Tool':
    console.log('Fast Fourier Transform');
    selectedTool = "FFTResponse";
    break;

  case 'CWT-Tool':
    console.log('Continuous Wavelet Transform');
    selectedTool = "ContinuousWaveletTransformResponse";
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
  <MovingAverageResponse v-if="selectedTool === 'MovingAverageResponse'"></MovingAverageResponse>
  <SignalAverageResponse v-if="selectedTool === 'SignalAverageResponse'"></SignalAverageResponse>
  <FirstDifferenceResponse v-if="selectedTool === 'FirstDifferenceResponse'"></FirstDifferenceResponse>
  <IFFTResponse v-if="selectedTool === 'IFFTResponse'"></IFFTResponse>
  <FFTResponse v-if="selectedTool === 'FFTResponse'"></FFTResponse>
  <ContinuousWaveletTransformResponse v-if="selectedTool === 'ContinuousWaveletTransformResponse'"></ContinuousWaveletTransformResponse>
</template>

<style scoped>

</style>