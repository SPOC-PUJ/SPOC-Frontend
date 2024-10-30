<script setup>
import FileReader from "@/components/FileReader.vue";
</script>

<template>
  <div class="bg-white rounded-xl shadow-md relative">
      <div class="mb-6 p-4 border-red-400 border-2">
        <div class="absolute inset-y-0 right-0 p-4">
          <i class="pi pi-exclamation-triangle text-orange-700 ">Extensiones de archivos admitidos: .edf, .abf, .csv, .mat</i>
        </div>
        <div class="p-4">
          <!-- Botón de carga de archivos delegado a EDFReader -->
          <FileReader @fileProcessed="$emit('fileProcessed', $event)"/>
        </div>
      </div>
  </div>
</template>

<style scoped>

</style>
