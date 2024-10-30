<!-- CWTResponseComponent.vue -->
<script setup>
import { ref, onMounted, toRaw, watch } from 'vue';
import { openDB } from 'idb';
import { useResponseStore } from '@/stores/responseStore.js';
import { JellyfishLoader } from 'vue3-spinner';
import * as d3 from 'd3';

// Estado de carga inicial como ref para que sea reactivo
const loadingStatus = ref(true);
console.log('Loading Response Status: ', loadingStatus.value);

const responseStore = useResponseStore();
const svgRef = ref(null);

onMounted(async () => {
  console.log('Continuous Wavelet Transform Response component mounted');

  // Abrir la base de datos con la versión correcta
  const db = await openDB('response-database', 2);

  console.log('IndexedDB abierta con éxito');

  // Retrieve the response and original signal using consistent keys
  const response = await db.get('responses', 'responses');
  console.log('CWT Response from IndexedDB:', response);

  const originalSignal = await db.get('signals', 'signals');
  console.log('Original Signal from IndexedDB:', originalSignal);


  // Verificar si se obtuvieron los datos
  if (response && originalSignal) {
    responseStore.setSignalResponse(response);
    responseStore.setOriginalSignal(originalSignal);

    // Borrar los datos almacenados en IndexedDB para evitar duplicados
    await db.delete('responses', 'signalResponse');
    await db.delete('signals', 'originalSignal');
  } else {
    console.error('No se encontraron datos en IndexedDB');
  }

  console.log('CWT Response: ', toRaw(responseStore.signalResponse));
  console.log('Original Signal: ', toRaw(responseStore.originalSignal));

  // Llamar a la función para dibujar el heatmap
  drawHeatmap();

  // Desactivar el estado de carga después de procesar los datos
  loadingStatus.value = false;
});

// Observar cambios en los datos para redibujar el heatmap si es necesario
watch(
    () => responseStore.signalResponse,
    () => {
      if (!loadingStatus.value) {
        drawHeatmap();
      }
    }
);

function drawHeatmap() {
  console.log('Dibujando el heatmap...');

  // Limpiar cualquier SVG existente
  d3.select(svgRef.value).selectAll('*').remove();

  // Configurar las dimensiones del SVG
  const margin = { top: 20, right: 20, bottom: 50, left: 70 };
  const width = 1600 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  console.log('Dimensiones del SVG:', width, height);
  console.log('Referencia del SVG:', svgRef);
  console.log("SVG: ", svgRef.value);

  const svg = d3
      .select(svgRef.value)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  // Procesar los datos
  console.log('Procesando los datos de la respuesta...');
  const coeffs = toRaw(responseStore.signalResponse.coeffs);

  console.log('Coefficients:', coeffs);

  if (!coeffs || coeffs.length === 0) {
    console.error('No hay datos de coeficientes para dibujar el heatmap.');
    return;
  }

  const numScales = coeffs.length;
  console.log('Número de escalas: ', numScales);

  const numTimePoints = coeffs[0].coe.length;
  console.log('Número de puntos de tiempo: ', numTimePoints);

  // Número deseado de puntos en el eje del tiempo para evitar sobrecargar el navegador
  const desiredTimePoints = 1000;
  const timeSampleStep = Math.max(1, Math.floor(numTimePoints / desiredTimePoints));

  const dataArray = [];

  for (let scaleIdx = 0; scaleIdx < numScales; scaleIdx++) {
    const scaleData = coeffs[scaleIdx].coe;
    for (let timeIdx = 0; timeIdx < numTimePoints; timeIdx += timeSampleStep) {
      const d = scaleData[timeIdx];

      dataArray.push({
        scale: scaleIdx,
        time: timeIdx,
        value: d,
      });
    }
  }

  // Configurar las escalas
  const xScale = d3
      .scaleLinear()
      .domain([0, numTimePoints])
      .range([0, width]);

  const yScale = d3
      .scaleLinear()
      .domain([numScales, 0]) // Invertir dominio
      .range([height, 0]);

  // Escala de color
  const colorScale = d3
      .scaleSequential(d3.interpolateViridis)
      .domain(d3.extent(dataArray, (d) => d.value));

  // Dibujar el mapa de calor
  const cellWidth = width / (numTimePoints / timeSampleStep);
  const cellHeight = height / numScales;

  svg
      .selectAll('rect')
      .data(dataArray)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.time))
      .attr('y', (d) => yScale(d.scale))
      .attr('width', cellWidth)
      .attr('height', cellHeight)
      .attr('fill', (d) => colorScale(d.value));

  // Añadir ejes
  const xAxis = d3.axisBottom(xScale).ticks(10);
  svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .append('text')
      .attr('fill', '#000')
      .attr('x', width / 2)
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .text('Tiempo');

  const yAxis = d3.axisLeft(yScale).ticks(Math.min(numScales, 5));
  svg
      .append('g')
      .call(yAxis)
      .append('text')
      .attr('fill', '#000')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -50)
      .attr('text-anchor', 'middle')
      .text('Escala');
}
</script>

<template>
  <div class="bg-blue-50 px-4 py-10">
    <!-- Mostrar el loader si loadingStatus es true -->
    <div class="flex justify-center items-center w-full h-full fixed inset-0 m-auto bg-white bg-opacity-70" v-if="loadingStatus">
      <div class="transform scale-[2] flex flex-col justify-center items-center">
        <JellyfishLoader color="#3B82F6" />
        <h2 class="text-blue-600 mt-4">Procesando respuesta...</h2>
      </div>
    </div>
    <!-- Contenedor para el heatmap -->
    <div ref="svgRef"></div>
  </div>
</template>

<style scoped>
/* Puedes agregar estilos personalizados aquí */
</style>
