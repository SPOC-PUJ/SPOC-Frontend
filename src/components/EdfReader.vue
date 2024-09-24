<script setup>
import { onMounted, ref, defineEmits } from 'vue';
import DangerModal from "@/components/DangerModal.vue";
import {useSignalStore} from "@/stores/signalStore";
import { Complex } from '../proto/proto-ts/signal';
import {JellyfishLoader} from "vue3-spinner";


const showDangerModal = ref(false); // Controlar la visibilidad del modal.
const incompatibleFileName = ref(''); // Almacenar el nombre del archivo incompatible.
const incompatibleFileExtension = ref(''); // Almacenar la extensión del archivo incompatible.
const fileInputRef = ref(null); // Referencia al input de archivo.

const signalStore = useSignalStore();
const emit = defineEmits(['fileProcessed']); // Esto permite emitir eventos personalizados (los datos que usará el graficador)

const output = ref('');

// Estado de carga inicial
let loadingStatus = false;

const processFile = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  console.log(file.name);

  // Verificar la extensión del archivo
  if (file.name.endsWith(".edf") || file.name.endsWith(".abf")) {
    output.value = "Formato Correcto";

    // Activar el estado de carga
    loadingStatus = true;
  }
  else
  {
    output.value = "Formato Incorrecto, solo se aceptan archivos .edf y .abf.";

    incompatibleFileName.value = file.name; // Asignar el nombre del archivo
    incompatibleFileExtension.value = file.name.split('.').pop(); // Extraer la extensión del archivo

    showDangerModal.value = true; // Mostrar el modal de error
    return;
  }

  // ELIMINAR EL ASYNC
  reader.onload = async (e) => { // La "e" es el evento de carga del archivo
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
    signalStore.setSignalObject(sigInstanc);

    console.log(sigInstanc);
    if (sigInstanc.size() !== 0) {
      console.log(sigInstanc.size());
      console.log('signals found.');
    }

    // Almacenar los valores reales en un array y emitirlos
    var veceigen = sigInstanc.get(0);
    const realValues = []; // Array para almacenar los valores reales y pasarlos al graficador
    for (let i = 0; i < veceigen.size; i++) {
      var complexValue = veceigen.get(i);
      // console.log('Complex value:', complexValue);
      // console.log('Real part:', complexValue.real());
      // console.log('Imaginary part:', complexValue.imag());

      realValues.push(complexValue.real()); // Solo almacenar la parte real y enviarla al graficador
    }

    // ELIMINAR EL SLEEP
    await new Promise(r => setTimeout(r, 5000));

    // Emitir los valores reales procesados
    emit('fileProcessed', realValues); // Emitir los valores reales para que el graficador los muestre

    // Para crear el mensaje para grpc de una
    const signalData = [];
    for(let i = 0; i < sigInstanc.size(); i++){
      const vectorEigen = sigInstanc.get(i);
      const complexArray = [];
      for (let j = 0; j < vectorEigen.size; j++) {
        var complexValue = vectorEigen.get(j);
        complexArray.push(Complex.create({ real: complexValue.real(), imag: complexValue.imag() }));
      }
      signalData.push(complexArray); // Añadir el array de complejos al array principal
    }
    signalStore.setSignalJson(signalData);

    output.value = 'File processed successfully (Quitar)';

    // Desactivar el estado de carga
    loadingStatus = false;

    event.target.value = ''; // Clear the file input after processing

    // Liberar memoria de los objetos de WebAssembly
    edfInstance.delete();
    signalsInstance.delete();
    Module.FS_unlink('/filename');
  };

  reader.readAsArrayBuffer(file); // Leer como datos binarios
};

const handleRetry = () => {
  showDangerModal.value = false;
  fileInputRef.value.click(); // Reabrir el selector de archivos
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
    <DangerModal v-if="showDangerModal" @close="showDangerModal = false" @retry="handleRetry" v-bind:fileName="incompatibleFileName" v-bind:fileExtension="incompatibleFileExtension"/> <!-- Mostrar el modal de error -->
    <div class="flex justify-center items-center">
      <label for="fileInputRef" class="pi pi-upload cursor-pointer inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">   Cargar Archivo</label>
    </div>

    <div class="flex justify-center items-center w-[50vw] h-[50vh] fixed inset-0 m-auto" v-if="loadingStatus">
      <div class="transform scale-[2] flex justify-center items-center">
        <JellyfishLoader color="#3B82F6" />
        <h2 class="#3B82F6">Procesando archivo...</h2>
      </div>
    </div>


    <input id="fileInputRef" type="file" @change="processFile" hidden/>
    <pre hidden>{{ output }}</pre> <!-- TODO: Eliminarlo... bien -->
  </div>
</template>