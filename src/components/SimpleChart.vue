<script setup>
import { ref, onMounted, watch, computed, toRaw } from 'vue';
import { useSignalStore } from '@/stores/signalStore';
import { useResponseStore } from '@/stores/responseStore';
import SimpleChartControls from './SimpleChartControls.vue';
import * as d3 from 'd3';

// Definir las props
const props = defineProps({
  dataSource: {
    type: String,
    default: '',
  },
});

// Obtener las instancias de los stores
const signalStore = useSignalStore();
const responseStore = useResponseStore();

const chartContainer = ref(null);
const zoomYEnabled = ref(false); // Estado del checkbox para habilitar/deshabilitar el zoom en Y
const lineWidth = ref(1); // Estado para el grosor de la línea

// Función que se llama cuando el checkbox de "Habilitar Zoom en Y" cambia de estado
function handleZoomYToggle(isZoomYEnabled) {
  zoomYEnabled.value = isZoomYEnabled; // Actualiza el estado de zoom en Y
}

// Función que se llama cuando el grosor de la línea cambia
function handleLineWidthUpdate(newLineWidth) {
  lineWidth.value = newLineWidth; // Actualiza el grosor de la línea
}

// Variables para D3
let x, y, svg, lineGroup, xAxisGroup, yAxisGroup;
let brush;
let initialXDomain, initialYDomain;
let width, height;

// Computed property para el dataset
const dataset = computed(() => {
  let data = [];
  let index = 0;
  let dataSource = props.dataSource;

  if (dataSource.includes('_')) {
    const parts = dataSource.split('_');
    dataSource = parts[0];
    index = parseInt(parts[1], 10) || 0;
  }

  switch (dataSource) {
    case 'useFastWaveletApproximations':
      console.log(`Usando datos de Fast Wavelet Approximations, índice ${index}`);
      index = responseStore.fastFourierTransformDecLevelIndex;
      if (
          responseStore.signalResponse &&
          responseStore.signalResponse.approximations &&
          responseStore.signalResponse.approximations.length > index
      ) {
        const initialData = toRaw(responseStore.signalResponse.approximations[index]);
        data = initialData.values;

        // Transformar data al formato esperado
        if (Array.isArray(data) && data.length > 0) {
          if (typeof data[0] === 'number') {
            data = data.map((value, index) => ({
              punto: index + 1,
              value: value,
            }));
          } else if (typeof data[0] === 'object' && data[0].hasOwnProperty('real')) {
            data = data.map((item, index) => ({
              punto: index + 1,
              value: item.real,
            }));
          } else {
            console.error('Los elementos de data no están en un formato reconocido.');
          }
        } else {
          console.error('Data no es un arreglo o está vacío.');
        }
      } else {
        console.error('No hay datos de aproximaciones disponibles en responseStore');
      }
      break;

    case 'useFastWaveletDetails':
      console.log(`Usando datos de Fast Wavelet Details, índice ${index}`);
      index = responseStore.fastFourierTransformDecLevelIndex;
      if (
          responseStore.signalResponse &&
          responseStore.signalResponse.details &&
          responseStore.signalResponse.details.length > index
      ) {
        const initialData = toRaw(responseStore.signalResponse.details[index]);
        data = initialData.values;

        // Transformar data al formato esperado
        if (Array.isArray(data) && data.length > 0) {
          if (typeof data[0] === 'number') {
            data = data.map((value, index) => ({
              punto: index + 1,
              value: value,
            }));
          } else if (typeof data[0] === 'object' && data[0].hasOwnProperty('real')) {
            data = data.map((item, index) => ({
              punto: index + 1,
              value: item.real,
            }));
          } else {
            console.error('Los elementos de data no están en un formato reconocido.');
          }
        } else {
          console.error('Data no es un arreglo o está vacío.');
        }
      } else {
        console.error('No hay datos de detalles disponibles en responseStore');
      }
      break;

    case 'usingSingleSignal':
      console.log('Usando datos de una sola señal');

      if (responseStore.signalResponse) {
        const initialData = toRaw(responseStore.signalResponse);
        data = initialData.result;

        console.log('Initial Data:', initialData);
        console.log('Data:', data);

        // Transformar data al formato esperado
        if (Array.isArray(data) && data.length > 0) {
          if (typeof data[0] === 'number') {
            data = data.map((value, index) => ({
              punto: index + 1,
              value: value,
            }));
          } else if (typeof data[0] === 'object' && data[0].hasOwnProperty('real')) {
            data = data.map((item, index) => ({
              punto: index + 1,
              value: item.real,
            }));
          } else {
            console.error('Los elementos de data no están en un formato reconocido.');
          }
        } else {
          console.error('Data no es un arreglo o está vacío.');
        }
      } else {
        console.error('No hay datos de Moving Average disponibles en responseStore');
      }
      break;

    case 'usingSingleSignalForIFFT':
      console.log('Usando datos de una sola señal para IFFT');

      if (responseStore.signalResponse) {
        const initialData = toRaw(responseStore.signalResponse);
        data = initialData.result;

        console.log('Initial Data:', initialData);
        console.log('Data:', data);

        // Transformar data al formato esperado
        if (Array.isArray(data) && data.length > 0) {
          if (typeof data[0] === 'number') {
            data = data.map((value, index) => ({
              punto: index + 1,
              value: value,
            }));
          } else if (typeof data[0] === 'object' && data[0].hasOwnProperty('real')) {
            data = data.map((item, index) => ({
              punto: index + 1,
              value: Math.abs(item.real),
            }));
          } else {
            console.error('Los elementos de data no están en un formato reconocido.');
          }
        } else {
          console.error('Data no es un arreglo o está vacío.');
        }
      } else {
        console.error('No hay datos de Moving Average disponibles en responseStore');
      }
      break;

    case 'usingSingleSignalForFFT':
      console.log('Usando datos de una sola señal para FFT');

      if (responseStore.signalResponse) {
        const initialData = toRaw(responseStore.signalResponse);
        data = initialData.result;

        console.log('Initial Data:', initialData);
        console.log('Data (primeros 10 elementos sin sumar):', data.slice(0, 10));

        // Transformar data al formato esperado
        if (Array.isArray(data) && data.length > 0) {
          if (typeof data[0] === 'number') {
            data = data.map((value, index) => ({
              punto: index + 1,
              value: value,
            }));
          } else if (
              typeof data[0] === 'object' &&
              data[0].hasOwnProperty('real') &&
              data[0].hasOwnProperty('imag')
          ) {
            // Imprimir los primeros 10 valores con la suma de real e imag
            const summedData = data.map((item, index) => ({
              punto: index + 1,
              value: Math.abs(item.real + item.imag), // Sumar la parte real e imaginaria y obtener el valor absoluto
            }));

            console.log(
                'Data (primeros 10 elementos después de sumar real e imag):',
                summedData.slice(0, 10)
            );

            // Reemplazar data por la suma
            data = summedData;
          } else {
            console.error('Los elementos de data no están en un formato reconocido.');
          }
        } else {
          console.error('Data no es un arreglo o está vacío.');
        }
      } else {
        console.error('No hay datos de FFT disponibles en responseStore');
      }
      break;

    case 'usingSingleSignalForCWT':
      console.log('Usando señal original para el CWT');

      if (responseStore.originalSignal) {
        const initialData = toRaw(responseStore.originalSignal);
        data = initialData.values;

        console.log('Initial Data:', initialData);
        console.log('Data:', data);

        // Transformar data al formato esperado
        if (Array.isArray(data) && data.length > 0) {
          if (typeof data[0] === 'number') {
            data = data.map((value, index) => ({
              punto: index + 1,
              value: value,
            }));
          } else if (typeof data[0] === 'object' && data[0].hasOwnProperty('real')) {
            data = data.map((item, index) => ({
              punto: index + 1,
              value: item.real,
            }));
          } else {
            console.error('Los elementos de data no están en un formato reconocido.');
          }
        } else {
          console.error('Data no es un arreglo o está vacío.');
        }
      } else {
        console.error('No hay datos de Moving Average disponibles en responseStore');
      }
      break;

    default:
      console.log('Usando datos de signalStore');
      if (signalStore.signalJson && signalStore.signalJson.length > 0) {
        const selectedSignalData = signalStore.signalJson[signalStore.signalSelected];
        if (
            selectedSignalData &&
            selectedSignalData.values &&
            selectedSignalData.values.length > 0
        ) {
          const selectedSignal = selectedSignalData.values;
          data = selectedSignal.map((dupla, index) => ({
            punto: index + 1,
            value: dupla.real, // Usar la parte real de la dupla
          }));
        } else {
          console.error('No hay datos de señal válidos disponibles');
        }
      } else {
        console.error('No hay datos disponibles en signalStore');
      }
      break;
  }

  console.log('Dataset procesado:', data);

  return data;
});

// Función para decimar datos usando el Teorema de Muestreo de Nyquist-Shannon
function decimateDataNyquist(data, xScale, width) {
  const domain = xScale.domain();
  const range = xScale.range();
  const pixelsPerBucket = 1; // Puedes ajustar este valor según tus necesidades
  const numberOfBuckets = Math.ceil((range[1] - range[0]) / pixelsPerBucket);

  // Filtrar los datos dentro del dominio visible
  const visibleData = data.filter((d) => d.punto >= domain[0] && d.punto <= domain[1]);

  // Si hay pocos puntos, no es necesario decimar
  if (visibleData.length <= numberOfBuckets * 2) {
    return visibleData;
  }

  const bucketSize = Math.floor(visibleData.length / numberOfBuckets);
  const decimatedData = [];

  for (let i = 0; i < numberOfBuckets; i++) {
    const start = i * bucketSize;
    const end = i === numberOfBuckets - 1 ? visibleData.length : (i + 1) * bucketSize;
    const bucket = visibleData.slice(start, end);

    const minPoint = d3.min(bucket, (d) => d.value);
    const maxPoint = d3.max(bucket, (d) => d.value);

    const minData = bucket.find((d) => d.value === minPoint);
    const maxData = bucket.find((d) => d.value === maxPoint);

    if (minData && maxData) {
      // Aseguramos el orden cronológico
      if (minData.punto < maxData.punto) {
        decimatedData.push(minData, maxData);
      } else {
        decimatedData.push(maxData, minData);
      }
    }
  }

  return decimatedData;
}

onMounted(() => {
  // Paso #1: Crear el contenedor del gráfico
  const margin = { top: 50, right: 20, bottom: 50, left: 70 }; // Márgenes del gráfico
  width = chartContainer.value.clientWidth - margin.left - margin.right; // Ancho dinámico del gráfico
  height = chartContainer.value.clientHeight - margin.top - margin.bottom; // Alto dinámico del gráfico

  // Paso #2: Crear las escalas para los ejes X e Y
  x = d3.scaleLinear().range([0, width]); // Escala para el eje X
  y = d3.scaleLinear().range([height, 0]); // Escala para el eje Y

  // Paso #3: Crear el contenedor SVG para el gráfico
  svg = d3 // La variable svg es el contenedor principal del gráfico
      .select(chartContainer.value) // Selecciona el contenedor del gráfico
      .append('svg') // Añade un elemento SVG al contenedor
      .attr('width', width + margin.left + margin.right) // Añade el ancho del gráfico
      .attr('height', height + margin.top + margin.bottom) // Añade el alto del gráfico
      .append('g') // Añade un elemento g (grupo) al SVG
      .attr('transform', `translate(${margin.left}, ${margin.top})`); // Añade un desplazamiento al grupo

  // Paso #4: Definir clipping para el gráfico (evitar que la línea salga del área visible)
  const clip = svg
      .append('defs')
      .append('svg:clipPath') // Añadir un clipPath al SVG
      .attr('id', 'clip') // Asignar un ID al clipPath
      .append('svg:rect') // Añadir un rectángulo al clipPath
      .attr('width', width) // Ancho del rectángulo
      .attr('height', height) // Alto del rectángulo
      .attr('x', 0) // Posición X del rectángulo
      .attr('y', 0); // Posición Y del rectángulo

  // Paso #5: Añadir el grupo de la línea con clipping al SVG
  lineGroup = svg
      .append('g') // Añadir un grupo al SVG
      .attr('clip-path', 'url(#clip)'); // Añadir el clipPath al grupo

  // Grupos de ejes X e Y
  xAxisGroup = svg.append('g').attr('transform', `translate(0, ${height})`);
  yAxisGroup = svg.append('g');

  // Función para actualizar el brush
  function updateBrush() {
    // Eliminar el brush existente
    svg.select('.brush').remove();

    // Configurar el brush según el estado de zoomYEnabled
    brush = zoomYEnabled.value
        ? d3.brush().extent([[0, 0], [width, height]]).on('end', brushed)
        : d3.brushX().extent([[0, 0], [width, height]]).on('end', brushed);

    // Añadir el brush al SVG
    svg.append('g').attr('class', 'brush').call(brush);
  }

  // Llamar a updateBrush en onMounted
  updateBrush();

  // Observar cambios en zoomYEnabled para actualizar el brush
  watch(zoomYEnabled, (newValue) => {
    updateBrush();
  });

  // Observar cambios en el dataset
  watch(
      () => dataset.value,
      (newDataset) => {
        if (newDataset && newDataset.length > 0) {
          const rawDataset = toRaw(newDataset);

          // Establecer dominios iniciales
          x.domain(d3.extent(rawDataset, (d) => d.punto));
          y.domain([
            d3.min(rawDataset, (d) => d.value) * 1.1,
            d3.max(rawDataset, (d) => d.value) * 1.1,
          ]);

          // Almacenar los dominios iniciales
          initialXDomain = x.domain();
          initialYDomain = y.domain();

          // Llamar a updateChart para dibujar el gráfico
          updateChart();
        } else {
          console.error('El dataset está vacío o es inválido');
        }
      },
      { immediate: true }
  );

  // Función para actualizar el gráfico con animación
  function updateChart() {
    const rawDataset = toRaw(dataset.value);

    // Filtrar los datos según el dominio actual de X
    const xDomain = x.domain();
    const filteredData = rawDataset.filter((d) => d.punto >= xDomain[0] && d.punto <= xDomain[1]);

    // Si el zoom en Y está habilitado, ajustar el dominio de Y basado en los datos filtrados
    if (zoomYEnabled.value) {
      y.domain([
        d3.min(filteredData, (d) => d.value) * 1.1,
        d3.max(filteredData, (d) => d.value) * 1.1,
      ]);
    }

    // Decimar los datos si es necesario
    const decimatedData = decimateDataNyquist(filteredData, x, width);

    // Definir la línea
    const line = d3
        .line()
        .x((d) => x(d.punto))
        .y((d) => y(d.value));

    // Actualizar la línea con animación
    const path = lineGroup.selectAll('path').data([decimatedData]);

    path
        .enter()
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', lineWidth.value)
        .merge(path)
        .transition()
        .duration(750)
        .attr('d', line);

    path.exit().remove();

    // Actualizar los ejes con animación
    xAxisGroup
        .transition()
        .duration(750)
        .call(d3.axisBottom(x));

    yAxisGroup
        .transition()
        .duration(750)
        .call(d3.axisLeft(y));

    // Actualizar las gridlines
    const xTicks = x.ticks().length;
    const yTicks = y.ticks().length;

    // Gridlines verticales (eje X)
    const xGrid = svg.selectAll('.xGrid').data(x.ticks(xTicks));

    xGrid
        .enter()
        .append('line')
        .attr('class', 'xGrid')
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 1)
        .attr('opacity', 0.7)
        .attr('y1', 0)
        .attr('y2', height)
        .merge(xGrid)
        .transition()
        .duration(750)
        .attr('x1', (d) => x(d))
        .attr('x2', (d) => x(d));

    xGrid.exit().remove();

    // Gridlines horizontales (eje Y)
    const yGrid = svg.selectAll('.yGrid').data(y.ticks(yTicks));

    yGrid
        .enter()
        .append('line')
        .attr('class', 'yGrid')
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 1)
        .attr('opacity', 0.7)
        .attr('x1', 0)
        .attr('x2', width)
        .merge(yGrid)
        .transition()
        .duration(750)
        .attr('y1', (d) => y(d))
        .attr('y2', (d) => y(d));

    yGrid.exit().remove();
  }

  // Función para manejar el evento de brush
  function brushed(event) {
    const selection = event.selection;

    if (!selection) {
      // Si no hay selección, no hacer nada
      return;
    }

    if (zoomYEnabled.value) {
      const [[x0, y0], [x1, y1]] = selection;

      // Convertir valores de píxeles a valores de dominio
      const newXDomain = [x.invert(x0), x.invert(x1)];
      const newYDomain = [y.invert(y1), y.invert(y0)]; // Invertir y0 y y1

      // Actualizar los dominios
      x.domain(newXDomain);
      y.domain(newYDomain);
    } else {
      const [x0, x1] = selection;
      const newXDomain = [x.invert(x0), x.invert(x1)];

      // Actualizar el dominio de X
      x.domain(newXDomain);

      // Mantener el dominio de Y inicial
      y.domain(initialYDomain);
    }

    // Redibujar el gráfico con animación
    updateChart();

    // Eliminar el brush
    svg.select('.brush').call(brush.move, null);
  }

  // Agregar un botón para restablecer el zoom
  const resetZoomButton = d3
      .select(chartContainer.value)
      .append('button')
      .text('Restablecer Zoom')
      .style('position', 'absolute')
      .style('top', '10px')
      .style('right', '10px')
      .on('click', () => {
        // Restablecer los dominios iniciales
        x.domain(initialXDomain);
        y.domain(initialYDomain);

        // Redibujar el gráfico con animación
        updateChart();
      });
});
</script>

<template>
  <div style="position: relative;">
    <div ref="chartContainer" style="width: 100%; height: 100%;"></div>

    <!-- Componente de control como Zoom en Y, slider de grosor y más -->
    <div class="px-4">
      <SimpleChartControls
          @toggle-zoom-y="handleZoomYToggle"
          @update-line-width="handleLineWidthUpdate"
      />
    </div>
  </div>
</template>
