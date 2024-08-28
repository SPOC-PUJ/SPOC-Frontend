<script setup>
import EDFReader from '@/components/EdfReader.vue';
</script>

<template>
  <div class="bg-white rounded-xl shadow-md relative">
    <div class="p-4">
      <div class="mb-6">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold">Cargar Archivo</h3>
          <i class="pi pi-exclamation-triangle text-orange-700">Extensiones de archivos admitidos: .edf y .abfx</i>
        </div>
        <div class="border-red-400 border-dotted border-4 p-4 rounded-lg">
          <!-- Botón de carga de archivos delegado a EDFReader -->
          <EDFReader @fileProcessed="$emit('fileProcessed', $event)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
