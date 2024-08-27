<script setup>
import { onMounted, ref, defineEmits } from 'vue';

const emit = defineEmits(['fileProcessed']); // Esto permite emitir eventos personalizados (los datos que usará el graficador)

const output = ref('');

const processFile = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => { // La "e" es el evento de carga del archivo
    const data = new Uint8Array(reader.result);

    // Crear un archivo en el sistema de archivos del módulo WebAssembly
    Module.FS_createDataFile('/', 'filename', data, true, true, true);

    // Crear una instancia del lector EDF
    const edfInstance = new Module.EDF('filename');

    // Ejemplo de uso de la instancia EDF
    edfInstance.PrintHeaderRecords();
    edfInstance.PrintDataRecords();
    edfInstance.PrintSizeSignals();
    edfInstance.PrintTopValues(5);

    console.log(edfInstance);

    // Obtener la instancia de señales
    const signalsInstance = edfInstance.Signals;

    console.log(signalsInstance);

    signalsInstance.CalculateMeans();
    signalsInstance.CalculateDeviation();
    signalsInstance.PrintMeanAndDeviation();

    var sigInstanc = signalsInstance.signals;

    console.log(sigInstanc);
    if (sigInstanc.size() !== 0) {
      console.log(sigInstanc.size());
      console.log('signals found.');
    }

    var veceigen = sigInstanc.get(0);
    console.log(veceigen);
    console.log(veceigen.size);

    // Almacenar los valores reales en un array y emitirlos
    const realValues = []; // Array para almacenar los valores reales y pasarlos al graficador
    for (let i = 0; i < veceigen.size; i++) {
      var complexValue = veceigen.get(i);
      console.log('Complex value:', complexValue);
      console.log('Real part:', complexValue.real());
      console.log('Imaginary part:', complexValue.imag());

      realValues.push(complexValue.real()); // Solo almacenar la parte real y enviarla al graficador
    }

    // Emitir los valores reales procesados
    emit('fileProcessed', realValues); // Emitir los valores reales para que el graficador los muestre

    output.value = 'File processed successfully (Quitar)';
    event.target.value = ''; // Clear the file input after processing
  };

  reader.readAsArrayBuffer(file); // Leer como datos binarios
};

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'wasm/edf.js';
  script.onload = () => {
    console.log('WebAssembly module initialized');
  };
  document.body.appendChild(script);
});
</script>

<template>
  <div>
    <h1>EDF File Processor</h1>
    <input type="file" @change="processFile"/>
    <pre>{{ output }}</pre>
  </div>
</template>