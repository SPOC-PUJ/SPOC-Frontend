<script setup>
import * as d3 from 'd3';
import {ref, onMounted} from 'vue';

const chartContainer = ref(null);

onMounted(() =>
{
  // Paso #1: Crear el contenedor del gráfico
  const margin = {top: 20, right: 20, bottom: 30, left: 70}; // Márgenes del gráfico
  const width = 960 - margin.left - margin.right; // Ancho del gráfico
  const height = 500 - margin.top - margin.bottom; // Alto del gráfico

  // Paso #2: Crear las escalas para los ejes X e Y (esto es para definir el rango de valores que se mostrarán en el gráfico)
  const x = d3.scaleLinear().range([0, width]); // Escala para el eje X, en este caso se mostrarán valores lineales de 0 a width (width es el ancho del gráfico)
  const y = d3.scaleLinear().range([height, 0]); // Escala para el eje Y, en este caso se mostrarán valores lineales de height a 0 (height es el alto del gráfico)

  // Paso #3: Crear el contenedor SVG para el gráfico
  const svg = d3 // La variable svg es el contenedor principal del gráfico
      .select(chartContainer.value) // Selecciona el contenedor del gráfico
      .append('svg') // Añade un elemento SVG al contenedor
      .attr('width', width + margin.left + margin.right) // Añade el ancho del gráfico
      .attr('height', height + margin.top + margin.bottom) // Añade el alto del gráfico
      .append('g') // Añade un elemento g (grupo) al SVG (estos grupos es donde se añadirán los elementos del gráfico)
      .attr('transform', `translate(${margin.left}, ${margin.top})`); // Añade un desplazamiento al grupo para que no se superpongan los ejes

  // Paso #4: Dataset de prueba -  TODO tomar los datos del componente lector de archivos EDF
  const testDataset = [
    {punto: 1, value: 10},
    {punto: 2, value: 20},
    {punto: 3, value: 15},
    {punto: 4, value: 25},
    {punto: 5, value: 30},
    {punto: 6, value: 35},
    {punto: 7, value: 40},
    {punto: 8, value: 45},
    {punto: 9, value: 50},
    {punto: 10, value: 55},
  ];

  // Paso #5: Definir los dominios de las escalas X e Y (los dominios son los valores reales que se mostrarán en el gráfico)
  x.domain(d3.extent(testDataset, d => d.punto)); // El dominio de la escala X es el rango de valores de la propiedad 'punto' del dataset
  y.domain([0, d3.max(testDataset, d => d.value) * 1.1]); // El dominio de la escala Y es de 0 al valor máximo de la propiedad 'value' del dataset

  // Paso #6: Añadir el eje X
  svg.append('g') // Añade un grupo al SVG
      .attr('transform', `translate(0, ${height})`) // Desplaza el grupo al final del eje Y (esto es para que el eje X se muestre en la parte inferior del gráfico)
      .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format('d'))); // Esto le dice a D3 que añada un eje X al grupo, con 10 divisiones y formato de número entero

  // Paso #7: Añadir el eje Y
  svg.append('g').call(d3.axisLeft(y)); // Añade un eje Y al grupo (esto es para que el eje Y se muestre en la parte izquierda del gráfico)

  // Paso #8: Generar la línea del gráfico
  const line = d3.line() // La variable line es la función que generará la línea del gráfico
      .x(d => x(d.punto)) // La coordenada X de la línea se basa en la propiedad 'punto' del dataset
      .y(d => y(d.value)); // La coordenada Y de la línea se basa en la propiedad 'value' del dataset

  // Paso #9: Añadir la línea al gráfico (esto es lo que realmente dibuja la línea en el gráfico)
  svg.append('path') // Añade un elemento path al grupo (esto es para añadir la línea al gráfico)
      .datum(testDataset) // Añade el dataset a la línea
      .attr('fill', 'none') // Relleno de la línea (en este caso no tiene relleno)
      .attr('stroke', 'steelblue') // Color de la línea
      .attr('stroke-width', 2) // Grosor de la línea (en este caso 2 píxeles)
      .attr('d', line); // Añade la línea al gráfico
});
</script>

<template>
  <div ref="chartContainer" style="width: 100%; height: 100%;"></div>
</template>

<style scoped>
/* Estilos personalizados para el gráfico */
</style>