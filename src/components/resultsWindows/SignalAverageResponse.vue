<script setup>
import {ref, onMounted, toRaw} from 'vue';
import {openDB} from 'idb';
import {useResponseStore} from '@/stores/responseStore.js';
import {JellyfishLoader} from 'vue3-spinner';
import SimpleChart from '@/components/SimpleChart.vue';
import SavingTools from "@/components/extraTools/SavingTools.vue";

// Estado de carga inicial (Jellyfish Loader) como ref para que sea reactivo
const loadingStatus = ref(true);
console.log('Loading Response Status: ', loadingStatus.value);

const responseStore = useResponseStore();

onMounted(async () => {
  console.log('Signal Average Response');
  const db = await openDB('response-database', 2);
  const response = await db.get('responses', 'signalResponse');

  // Una vez cargada la página, revisar si hay una respuesta almacenada en IndexedDB
  if (response) {
    responseStore.setSignalResponse(response);
    // Borrar los datos de la respuesta almacenada en IndexedDB para evitar duplicados.
    await db.delete('responses', 'signalResponse');
  } else {
    console.error('No signalResponse found in IndexedDB');
  }

  console.log('Signal Response: ', toRaw(responseStore.signalResponse));

  // Desactivar el estado de carga
  loadingStatus.value = false;
  console.log('Loading Response Status: ', loadingStatus.value);
});


const simpleChartRef = ref(null);

const handleDownloadImage = () => {
  const chartCanvas = simpleChartRef.value?.$el.querySelector('canvas');

  if (!chartCanvas) {
    alert('No se encontró el gráfico.');
    return;
  }

  const link = document.createElement('a');
  link.download = 'chart.png';
  link.href = chartCanvas.toDataURL('image/png');
  link.click();
};
</script>

<template>
  <div class="bg-blue-50 px-4 py-10">
    <!-- SavingTools -->
    <SavingTools @download-image="handleDownloadImage" />

    <!-- Mostrar el loader si loadingStatus es true -->
    <div class="flex justify-center items-center w-full h-full fixed inset-0 m-auto bg-white bg-opacity-70" v-if="loadingStatus">
      <div class="transform scale-[2] flex flex-col justify-center items-center">
        <JellyfishLoader color="#3B82F6" />
        <h2 class="text-blue-600 mt-4">Procesando respuesta...</h2>
      </div>
    </div>

    <!-- Mostrar los gráficos una vez que loadingStatus es false -->
    <div v-else>
      <!-- Caja para Moving Average -->
      <div class="bg-white rounded-xl shadow-md relative mt-4 pb-16">
        <div class="p-4">
          <h3 class="text-xl font-bold">Signal Average</h3>
          <SimpleChart dataSource="usingSingleSignal" class="h-[80vh] w-full"/>
        </div>
      </div>


    </div>
  </div>
</template>
