<script setup>
import EDFReader from '@/components/EdfReader.vue';
</script>

<template>
  <div class="bg-white rounded-xl shadow-md relative border-blue-400">
      <div class="mb-6 p-4 border-red-400 border-4">
        <div class="absolute inset-y-0 right-0 p-4">
          <i class="pi pi-exclamation-triangle text-orange-700 ">Extensiones de archivos admitidos: .edf y .abfx</i>
        </div>
        <div class="p-4">
          <!-- Botón de carga de archivos delegado a EDFReader -->
          <EDFReader @fileProcessed="$emit('fileProcessed', $event)"/>
        </div>
      </div>
  </div>
</template>

<style scoped>

</style>
