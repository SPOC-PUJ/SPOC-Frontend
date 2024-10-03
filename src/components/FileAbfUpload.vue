<template>
  <div>
    <h1>Subir archivo ABF</h1>
    <input type="file" @change="onFileChange" accept=".ABF" />
    <button @click="uploadFile">Subir</button>
  </div>
</template>

<script>
import { ReaderService } from '@/services/ReaderService';



export default {
  data() {
    return {
      file: null,  // Ahora 'null' en lugar de una cadena vacía
    };
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
      console.log("Archivo seleccionado:", this.file);
      this.uploadFile()
    },
    async uploadFile() {
      if (this.file) {
        const reader = new FileReader();
        
        reader.onload = async () => {
          try {
            // Lee el archivo como un ArrayBuffer
            const arrayBuffer = reader.result; // Obtiene el ArrayBuffer
            const fileBytes = new Uint8Array(arrayBuffer); // Convierte a Uint8Array

            console.log("Bytes del archivo leídos:",fileBytes);

            // Envía el Uint8Array como bytes
            const response = await ReaderService.ReadAbf(fileBytes);
            console.log('Respuesta del servidor:', response);
          } catch (error) {
            console.error('Error al subir el archivo:', error);
          }
        };

        reader.onerror = (error) => {
          console.error("Error al leer el archivo:", error);
        };

        console.log("antes de leer el archivo");
        reader.readAsArrayBuffer(this.file);  // Leer el archivo directamente como ArrayBuffer
      } else {
        console.error("No hay archivo seleccionado");
      }
    },
  },
};
</script>

<style scoped>
/* Estilos personalizados */
</style>
