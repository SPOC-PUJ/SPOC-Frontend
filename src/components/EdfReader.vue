<script setup>
import { onMounted, ref, defineEmits } from 'vue';
import DangerModal from "@/components/DangerModal.vue";
import { useSignalStore } from "@/stores/signalStore";
import { Complex } from '../proto/proto-ts/signal';
import { JellyfishLoader } from "vue3-spinner";
import { ReaderService } from '@/services/ReaderService';

const showDangerModal = ref(false); // Controlar la visibilidad del modal.
const incompatibleFileName = ref(''); // Almacenar el nombre del archivo incompatible.
const incompatibleFileExtension = ref(''); // Almacenar la extensión del archivo incompatible.
const fileInputRef = ref(null); // Referencia al input de archivo.

const signalStore = useSignalStore();
const emit = defineEmits(['fileProcessed']); // Emitir eventos personalizados.

const output = ref('');

// Estado de carga reactivo
const loadingStatus = ref(false);

const processFile = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  console.log("Archivo seleccionado:", file.name);

  // Verificar la extensión del archivo
  if (file.name.endsWith(".edf")) {
    output.value = "Formato Correcto (.edf)";

    // Activar el estado de carga
    loadingStatus.value = true;

    reader.onload = async () => {
      const data = new Uint8Array(reader.result);

      // Crear un archivo en el sistema de archivos del módulo WebAssembly
      Module.FS_createDataFile('/', 'filename', data, true, true, true);

      // Crear una instancia del lector EDF
      const edfInstance = new Module.EDF('filename');

      // Uso de la instancia EDF
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
        console.log('Señales encontradas.');
      }

      // Almacenar los valores reales en un array y emitirlos
      var veceigen = sigInstanc.get(0);
      const realValues = []; // Array para almacenar los valores reales
      for (let i = 0; i < veceigen.size; i++) {
        var complexValue = veceigen.get(i);
        realValues.push(complexValue.real()); // Almacenar la parte real
      }

      // Emitir los valores reales procesados
      emit('fileProcessed', realValues); // Emitir los valores para el graficador

      // Crear el mensaje para gRPC
      const signalData = [];
      for (let i = 0; i < sigInstanc.size(); i++) {
        const vectorEigen = sigInstanc.get(i);
        const complexArray = [];
        for (let j = 0; j < vectorEigen.size; j++) {
          var complexValue = vectorEigen.get(j);
          complexArray.push(Complex.create({ real: complexValue.real(), imag: complexValue.imag() }));
        }
        signalData.push({ values: complexArray }); // Añadir el array de complejos
      }
      signalStore.setSignalJson(signalData);

      output.value = 'Archivo .edf procesado exitosamente';

      // Desactivar el estado de carga
      loadingStatus.value = false;

      event.target.value = ''; // Limpiar el input de archivo

      // Liberar memoria de los objetos de WebAssembly
      edfInstance.delete();
      signalsInstance.delete();
      Module.FS_unlink('/filename');
    };

    reader.readAsArrayBuffer(file); // Leer como datos binarios
  }
  else if (file.name.toLowerCase().endsWith(".abf")) {
    output.value = "Formato Correcto (.abf)";

    // Activar el estado de carga
    loadingStatus.value = true;

    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result; // Obtener el ArrayBuffer
        const fileBytes = new Uint8Array(arrayBuffer); // Convertir a Uint8Array

        console.log("Bytes del archivo leídos:", fileBytes);

        // Enviar el Uint8Array al servidor
        const response = await ReaderService.ReadAbf(fileBytes);
        console.log('Respuesta del servidor:', response);

        // Procesar la respuesta y emitir los datos necesarios
        // Aquí debes adaptar el código según cómo manejes la respuesta del servidor
        const processedData = response.data; // Suponiendo que la respuesta tiene un campo 'data'

        // Emitir los valores procesados
        emit('fileProcessed', processedData); // Ajusta según tus necesidades

        output.value = 'Archivo .abf procesado exitosamente';
      } catch (error) {
        console.error('Error al subir el archivo:', error);
      } finally {
        // Desactivar el estado de carga
        loadingStatus.value = false;

        event.target.value = ''; // Limpiar el input de archivo
      }
    };

    reader.onerror = (error) => {
      console.error("Error al leer el archivo:", error);
    };

    reader.readAsArrayBuffer(file); // Leer el archivo como ArrayBuffer
  }
  else {
    output.value = "Formato Incorrecto, solo se aceptan archivos .edf y .abf.";

    incompatibleFileName.value = file.name; // Asignar el nombre del archivo
    incompatibleFileExtension.value = file.name.split('.').pop(); // Extraer la extensión

    showDangerModal.value = true; // Mostrar el modal de error
    return;
  }
};

const handleRetry = () => {
  showDangerModal.value = false;
  fileInputRef.value.click(); // Reabrir el selector de archivos
};

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'wasm/edf.js';
  script.onload = () => {
    console.log('Módulo WebAssembly inicializado');
  };
  document.body.appendChild(script);
});
</script>

<template>
  <div>
    <DangerModal v-if="showDangerModal" @close="showDangerModal = false" @retry="handleRetry" :fileName="incompatibleFileName" :fileExtension="incompatibleFileExtension" />
    <!-- Mostrar el modal de error -->
    <div class="flex justify-center items-center">
      <label for="fileInputRef" class="pi pi-upload cursor-pointer inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">Cargar Archivo</label>
    </div>

    <div class="flex justify-center items-center w-full h-full fixed inset-0 m-auto bg-white bg-opacity-70" v-if="loadingStatus">
      <div class="transform scale-[2] flex flex-col justify-center items-center">
        <JellyfishLoader color="#3B82F6" />
        <h2 class="text-blue-500 mt-4">Procesando archivo...</h2>
      </div>
    </div>

    <input id="fileInputRef" type="file" @change="processFile" accept=".edf,.abf" hidden />
    <pre hidden>{{ output }}</pre> <!-- Mensaje de salida oculto -->
  </div>
</template>
