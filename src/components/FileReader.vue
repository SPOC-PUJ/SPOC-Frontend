<script setup>
import { onMounted, ref, toRaw } from 'vue';
import DangerModal from "@/components/DangerModal.vue";
import { useSignalStore } from "@/stores/signalStore";
import { Complex } from '../proto/proto-ts/signal';
import { JellyfishLoader } from "vue3-spinner";
import { ABFReaderService } from "@/services/ReaderService.js";
import { MATReaderService } from "@/services/ReaderMatService.js";
import ProcessingToolsDangerModal from "@/components/dangerModals/ProcessingToolsDangerModal.vue";

const showDangerModal = ref(false); // Controlar la visibilidad del modal para archivos incompatibles
const incompatibleFileName = ref(''); // Almacenar el nombre del archivo incompatible
const incompatibleFileExtension = ref(''); // Almacenar la extensión del archivo incompatible
const fileInputRef = ref(null); // Referencia al input de archivo

const signalStore = useSignalStore();
const emit = defineEmits(['fileProcessed']); // Emitir eventos personalizados

const output = ref('');

// Estado de carga reactivo
const loadingStatus = ref(false);

// Variables para el ProcessingToolsDangerModal
const showModal = ref(false);
const modalTitle = ref('Error al procesar el archivo');
const modalMessage = ref('');

// Función para manejar la confirmación del modal
const handleModalConfirm = () => {
  showModal.value = false;
};

const processFile = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  console.log("Archivo seleccionado:", file.name);

  // Verificar la extensión del archivo
  if (file.name.toLowerCase().endsWith(".edf")) {
    output.value = "Formato Correcto (.edf)";

    // Activar el estado de carga
    loadingStatus.value = true;

    reader.onload = async () => {
      try {
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
            complexArray.push(Complex.create({real: complexValue.real(), imag: complexValue.imag()}));
          }
          signalData.push({values: complexArray}); // Añadir el array de complejos
        }
        signalStore.setSignalJson(signalData);
        console.log("En el signalStore (edf):", toRaw(signalStore.signalJson));

        output.value = 'Archivo .edf procesado exitosamente';

        // Desactivar el estado de carga
        loadingStatus.value = false;

        event.target.value = ''; // Limpiar el input de archivo

        // Liberar memoria de los objetos de WebAssembly
        edfInstance.delete();
        signalsInstance.delete();
        Module.FS_unlink('/filename');
      } catch (error) {
        console.error('Error al procesar el archivo .edf:', error);
        modal
        modalMessage.value = 'Error al procesar el archivo .edf: ' + error.message;
        showModal.value = true;
        loadingStatus.value = false;
        event.target.value = ''; // Limpiar el input de archivo
      }
    };

    reader.onerror = (error) => {
      console.error("Error al leer el archivo .edf:", error);
      modalMessage.value = 'Error al leer el archivo .edf: ' + error.message;
      showModal.value = true;
      loadingStatus.value = false;
      event.target.value = ''; // Limpiar el input de archivo
    };

    reader.readAsArrayBuffer(file); // Leer como datos binarios
  }
  else if (file.name.toLowerCase().endsWith(".csv")) {
    output.value = "Formato Correcto (.csv)";

    // Activar el estado de carga
    loadingStatus.value = true;

    reader.onload = async () => {
      try {
        const text = reader.result; // Leer el contenido del archivo como texto

        // Convertir el CSV en un array de números
        const rows = text.split("\n");
        const csvNumbers = [];
        for (const row of rows) {
          const values = row.split(",").map(v => parseFloat(v.trim()));
          csvNumbers.push(...values); // Agregar los valores del CSV al array de números
        }

        // Filtrar los valores NaN si los hay
        const filteredNumbers = csvNumbers.filter(value => !isNaN(value));

        // Transformar los números en el objeto de señal con duplas
        const signal = transformToSignalObjectWithReal(filteredNumbers);

        // Guardar la señal procesada en el signalStore
        signalStore.setSignalJson([signal]); // Usamos un array con una única señal
        console.log("Data Procesada:", signal);
        console.log("En el signalStore (csv):", toRaw(signalStore.signalJson));

        output.value = 'Archivo .csv procesado exitosamente';

        // Emitir los valores reales procesados
        emit('fileProcessed', filteredNumbers); // Emitir los valores para el graficador
      } catch (error) {
        console.error('Error al subir el archivo .csv:', error);
        modalMessage.value = 'Error al subir el archivo .csv: ' + error.message;
        showModal.value = true;
      } finally {
        // Desactivar el estado de carga
        loadingStatus.value = false;

        event.target.value = ''; // Limpiar el input de archivo
      }
    };

    reader.onerror = (error) => {
      console.error("Error al leer el archivo .csv:", error);
      modalMessage.value = 'Error al leer el archivo .csv: ' + error.message;
      showModal.value = true;
      loadingStatus.value = false;
      event.target.value = ''; // Limpiar el input de archivo
    };

    reader.readAsText(file); // Leer el archivo como texto
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
        const response = await ABFReaderService.ReadAbf(fileBytes);
        console.log("Respuesta del servidor:", response);

        // Procesar la respuesta para que toda la señal se almacene correctamente
        const rawNumbers = response.numbers; // Lista de números obtenida del servidor
        const signal = transformToSignalObjectWithReal(rawNumbers);

        // Guardar la señal procesada en el signalStore
        signalStore.setSignalJson([signal]); // Usamos un array con una única señal
        console.log("Data Procesada:", signal);
        console.log("En el signalStore (abf):", toRaw(signalStore.signalJson));

        output.value = 'Archivo .abf procesado exitosamente';

        // Emitir los valores reales procesados
        emit('fileProcessed', rawNumbers); // Emitir los valores para el graficador
      } catch (error) {
        console.error('Error al subir el archivo .abf:', error);
        modalMessage.value = 'Error al subir el archivo .abf: ' + error.message;
        showModal.value = true;
      } finally {
        // Desactivar el estado de carga
        loadingStatus.value = false;

        event.target.value = ''; // Limpiar el input de archivo
      }
    };

    reader.onerror = (error) => {
      console.error("Error al leer el archivo .abf:", error);
      modalMessage.value = 'Error al leer el archivo .abf: ' + error.message;
      showModal.value = true;
      loadingStatus.value = false;
      event.target.value = ''; // Limpiar el input de archivo
    };

    reader.readAsArrayBuffer(file); // Leer el archivo como ArrayBuffer
  } else if (file.name.toLowerCase().endsWith(".mat")) {
    output.value = "Formato Correcto (.mat)";

    // Activar el estado de carga
    loadingStatus.value = true;

    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result; // Obtener el ArrayBuffer
        const fileBytes = new Uint8Array(arrayBuffer); // Convertir a Uint8Array

        console.log("Bytes del archivo leídos:", fileBytes);

        // Enviar el Uint8Array al servidor
        const response = await MATReaderService.ReadMat(fileBytes, "m_Trials_selected");
        console.log('Respuesta del servidor:', response);

        // Procesar la respuesta para que toda la señal se almacene correctamente
        const rawNumbers = response.numbers; // Lista de números obtenida del servidor
        const signal = transformToSignalObjectWithReal(rawNumbers);

        // Guardar la señal procesada en el signalStore
        signalStore.setSignalJson([signal]); // Usamos un array con una única señal
        console.log("Data Procesada:", signal);
        console.log("En el signalStore (mat):", toRaw(signalStore.signalJson));

        output.value = 'Archivo .mat procesado exitosamente';

        // Emitir los valores reales procesados
        emit('fileProcessed', rawNumbers); // Emitir los valores para el graficador
      } catch (error) {
        console.error('Error al subir el archivo .mat:', error);
        modalMessage.value = 'Error al subir el archivo .mat: ' + error.message;
        showModal.value = true;
      } finally {
        // Desactivar el estado de carga
        loadingStatus.value = false;

        event.target.value = ''; // Limpiar el input de archivo
      }
    };

    reader.onerror = (error) => {
      console.error("Error al leer el archivo .mat:", error);
      modalMessage.value = 'Error al leer el archivo .mat: ' + error.message;
      showModal.value = true;
      loadingStatus.value = false;
      event.target.value = ''; // Limpiar el input de archivo
    };

    reader.readAsArrayBuffer(file); // Leer el archivo como ArrayBuffer
  } else {
    output.value = "Formato Incorrecto, solo se aceptan archivos .edf, .abf y .mat.";

    incompatibleFileName.value = file.name; // Asignar el nombre del archivo
    incompatibleFileExtension.value = file.name.split('.').pop(); // Extraer la extensión

    showDangerModal.value = true; // Mostrar el modal de error
    return;
  }
};

// Función para transformar los números en objetos de señales con duplas (para .abf y .mat)
function transformToSignalObjectWithReal(numbers) {
  const values = numbers.map(num => ({
    real: num, // Mapeamos cada número a un objeto con la propiedad 'real'
  }));

  return { values }; // Devolvemos un objeto con los valores como propiedad
}

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
    <!-- Modal para mostrar errores durante el procesamiento -->
    <ProcessingToolsDangerModal
        v-if="showModal"
        :title="modalTitle"
        :message="modalMessage"
        @close="showModal = false"
        @confirm="handleModalConfirm"
    />

    <!-- Modal para archivos incompatibles -->
    <DangerModal
        v-if="showDangerModal"
        @close="showDangerModal = false"
        @retry="handleRetry"
        :fileName="incompatibleFileName"
        :fileExtension="incompatibleFileExtension"
    />

    <!-- Botón para cargar archivo -->
    <div class="flex justify-center items-center">
      <label for="fileInputRef"
             class="pi pi-upload cursor-pointer inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
        Cargar Archivo
      </label>
    </div>

    <!-- Loader mientras se procesa el archivo -->
    <div class="flex justify-center items-center w-full h-full fixed inset-0 m-auto bg-white bg-opacity-70" v-if="loadingStatus">
      <div class="transform scale-[2] flex flex-col justify-center items-center">
        <JellyfishLoader color="#3B82F6" />
        <h2 class="text-blue-500 mt-4">Procesando archivo...</h2>
      </div>
    </div>

    <input id="fileInputRef" type="file" @change="processFile" accept=".edf,.abf,.mat,.csv" hidden />
    <pre hidden>{{ output }}</pre> <!-- Mensaje de salida oculto -->
  </div>
</template>
