<script setup>
import SimpleChartControls from './SimpleChartControls.vue';

import * as d3 from 'd3';
import { ref, onMounted, watch, computed } from 'vue';
import { useSignalStore } from '@/stores/signalStore'; // Importa el store de señales

// Obtener la instancia del store
const signalStore = useSignalStore();

const chartContainer = ref(null);
const zoomYEnabled = ref(false); // Estado del checkbox para habilitar/deshabilitar el zoom en Y
const lineWidth = ref(1); // Estado para el grosor de la línea

// Eliminar la variable local signalSelected y utilizar la del store
// const signalSelected = ref(0); // Estado de la señal seleccionada (eliminado)

// Función que se llama cuando el checkbox de "Habilitar Zoom en Y" cambia de estado
function handleZoomYToggle(isZoomYEnabled) {
  zoomYEnabled.value = isZoomYEnabled; // Actualiza el estado de zoom en Y
}

// Función que se llama cuando el grosor de la línea cambia
function handleLineWidthUpdate(newLineWidth) {
  lineWidth.value = newLineWidth; // Actualiza el grosor de la línea
}

// Función que se llama cuando la señal seleccionada cambia
// Ya no es necesaria porque usamos signalStore.signalSelected directamente
// function handleSignalSelectedUpdate(newSignalSelected) {
//   signalSelected.value = newSignalSelected; // Actualiza la señal seleccionada
// }

onMounted(() => {
  // Paso #1: Crear el contenedor del gráfico
  const margin = { top: 50, right: 20, bottom: 50, left: 70 }; // Márgenes del gráfico
  const width = chartContainer.value.clientWidth - margin.left - margin.right; // Ancho dinámico del gráfico
  const height = chartContainer.value.clientHeight - margin.top - margin.bottom; // Alto dinámico del gráfico

  // Paso #2: Crear las escalas para los ejes X e Y
  const x = d3.scaleLinear().range([0, width]); // Escala para el eje X
  const y = d3.scaleLinear().range([height, 0]); // Escala para el eje Y

  // Paso #3: Crear el contenedor SVG para el gráfico
  const svg = d3 // La variable svg es el contenedor principal del gráfico
      .select(chartContainer.value) // Selecciona el contenedor del gráfico
      .append('svg') // Añade un elemento SVG al contenedor
      .attr('width', width + margin.left + margin.right) // Añade el ancho del gráfico
      .attr('height', height + margin.top + margin.bottom) // Añade el alto del gráfico
      .append('g') // Añade un elemento g (grupo) al SVG (estos grupos es donde se añadirán los elementos del gráfico)
      .attr('transform', `translate(${margin.left}, ${margin.top})`); // Añade un desplazamiento al grupo para que no se superpongan los ejes

  // Paso #4: Definir clipping para el gráfico (evitar que la línea salga del área visible)
  const clip = svg
      .append('defs')
      .append('svg:clipPath') // Añadir un clipPath al SVG
      .attr('id', 'clip') // Asignar un ID al clipPath
      .append('svg:rect') // Añadir un rectángulo al clipPath (esto es para definir el área visible del gráfico)
      .attr('width', width) // Ancho del rectángulo
      .attr('height', height) // Alto del rectángulo
      .attr('x', 0) // Posición X del rectángulo
      .attr('y', 0); // Posición Y del rectángulo

  // Paso #5: Añadir el grupo de la línea con clipping al SVG
  const lineGroup = svg
      .append('g') // Añadir un grupo al SVG
      .attr('clip-path', 'url(#clip)'); // Añadir el clipPath al grupo

  // Paso #6: Crear el comportamiento de zoom
  const zoom = d3
      .zoom() // Crear un comportamiento de zoom y pan para el gráfico
      .translateExtent([[-width, -height], [width * 2, height * 2]]) // Limitar el área de pan
      .extent([[0, 0], [width, height]]) // Limitar el área de zoom
      .on('zoom', zoomed); // Añadir un evento de zoom al comportamiento

  d3.select(chartContainer.value).select('svg').call(zoom); // Añadir comportamiento de zoom y pan al SVG del gráfico

  // Grupos de ejes X e Y
  let xAxisGroup = svg.append('g').attr('transform', `translate(0, ${height})`);

  let yAxisGroup = svg.append('g');

  // Observar los cambios en `signalStore.signalJson` y `signalStore.signalSelected`
  watch(
      [() => signalStore.signalJson, () => signalStore.signalSelected],
      ([newSignalJson, newSignalSelected]) => {
        if (newSignalJson && newSignalJson.length > 0) {
          const selectedSignal = newSignalJson[newSignalSelected]; // Tomar la señal seleccionada
          if (selectedSignal && selectedSignal.length > 0) {
            // Paso #7: Crear el dataset a partir de los datos proporcionados
            const dataset = selectedSignal.map((dupla, index) => ({
              punto: index + 1,
              value: dupla.real, // Usar la parte real de la dupla
            }));

            // Paso #8: Definir los dominios de las escalas X e Y
            x.domain(d3.extent(dataset, (d) => d.punto)); // Escala en X basada en el índice de los datos
            y.domain([
              d3.min(dataset, (d) => d.value) * 1.1,
              d3.max(dataset, (d) => d.value) * 1.1,
            ]); // Escala en Y basada en el valor de los datos

            // Paso #9: Crear la línea del gráfico
            const line = d3
                .line()
                .x((d) => x(d.punto))
                .y((d) => y(d.value));

            // Limpiar el gráfico antes de redibujar
            lineGroup.selectAll('path').remove();

            // Paso #10: Dibujar la línea del gráfico
            lineGroup
                .append('path')
                .datum(dataset)
                .attr('fill', 'none')
                .attr('stroke', 'steelblue')
                .attr('stroke-width', lineWidth.value) // Usar el grosor de la línea dinámico
                .attr('d', line);

            // Paso #11: Dibujar los ejes X e Y
            xAxisGroup.call(
                d3.axisBottom(x).ticks(20).tickFormat(d3.format('d'))
            ); // Eje X
            yAxisGroup.call(
                d3
                    .axisLeft(y)
                    .ticks(
                        (d3.max(dataset, (d) => d.value) -
                            d3.min(dataset, (d) => d.value)) /
                        1000
                    ) // Eje Y con formato de k (miles)
                    .tickFormat((d) => `${(d / 1000).toFixed(1)}k`)
            ); // Formato de los números del eje Y
          }
        }
      },
      { immediate: true }
  );

  // Función para aplicar zoom a las escalas y redibujar el gráfico
  function zoomed(event) {
    const transform = event.transform;

    // Reescalar solo la escala X siempre
    const newX = transform.rescaleX(x);

    // Condicionalmente reescalar la escala Y solo si el checkbox está marcado
    const newY = zoomYEnabled.value ? transform.rescaleY(y) : y;

    // Paso #13: Actualizar los ejes con las nuevas escalas
    xAxisGroup.call(d3.axisBottom(newX).ticks(20).tickFormat(d3.format('d')));

    // Actualizar el eje Y solo si zoom en Y está habilitado, si no, mantener la escala Y fija
    yAxisGroup.call(
        d3
            .axisLeft(newY)
            .ticks((d3.max(newY.domain()) - d3.min(newY.domain())) / 1000)
            .tickFormat((d) => `${(d / 1000).toFixed(1)}k`)
    );

    // Añadir gridlines verticales (para el eje X)
    svg
        .selectAll('.xGrid')
        .data(newX.ticks(20)) // Basado en la nueva escala X
        .join(
            (enter) => enter.append('line').attr('class', 'xGrid'),
            (update) => update,
            (exit) => exit.remove()
        )
        .attr('x1', (d) => newX(d))
        .attr('x2', (d) => newX(d))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 1);

    // Añadir gridlines horizontales (para el eje Y)
    svg
        .selectAll('.yGrid')
        .data(
            newY.ticks((d3.max(newY.domain()) - d3.min(newY.domain())) / 1000)
        ) // Basado en la nueva escala Y
        .join(
            (enter) => enter.append('line').attr('class', 'yGrid'),
            (update) => update,
            (exit) => exit.remove()
        )
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', (d) => newY(d))
        .attr('y2', (d) => newY(d))
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 1);

    // Redibujar la línea del gráfico con la nueva escala X y Y (si está habilitado)
    const line = d3
        .line()
        .x((d) => newX(d.punto))
        .y((d) => newY(d.value));

    lineGroup
        .selectAll('path')
        .attr('d', line)
        .attr('stroke-width', lineWidth.value); // Actualizar el grosor de la línea durante el zoom
  }
});
</script>

<template>
  <div>
    <div ref="chartContainer" style="width: 100%; height: 100%;"></div>

    <!-- Componente de control como Zoom en Y, slider de grosor y más -->
    <SimpleChartControls
        @toggle-zoom-y="handleZoomYToggle"
        @update-line-width="handleLineWidthUpdate"
    />
  </div>
</template>

<style scoped>
</style>
