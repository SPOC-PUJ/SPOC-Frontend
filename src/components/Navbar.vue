<script setup>
import logo from '../assets/img/logo.svg';
</script>

<template>
  <nav class="bg-[#010D00] border-b border-[#735620]">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <div
            class="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
        >
          <!-- Logo -->
          <a class="flex flex-shrink-0 items-center mr-4" href="index.html">
            <img class="h-10 w-auto" v-bind:src="logo" alt="SPOC - Signal Processing on Cloud" />
            <span class="hidden md:block text-[#F2E74B] text-2xl font-bold ml-2"
            >SPOC - Signal Processing on Cloud</span
            >
          </a>
          <div class="md:ml-auto">
            <div class="flex space-x-2">
              <a href="index.html" class="text-[#F2E74B] bg-[#735620] hover:bg-[#F2B441] hover:text-[#010D00] rounded-md px-3 py-2">
                Home
              </a>

              <a href="/functionalities" class="text-[#F2E74B] hover:bg-[#F2D544] hover:text-[#010D00] rounded-md px-3 py-2">
                Funcionalidades
              </a>

              <a href="/signal-visualizer" class="text-[#F2E74B] hover:bg-[#F2D544] hover:text-[#010D00] rounded-md px-3 py-2">
                Visualizador
              </a>

              <a href="/processing-tools" class="text-[#F2E74B] hover:bg-[#F2D544] hover:text-[#010D00] rounded-md px-3 py-2">
                Herramientas de Procesamiento
              </a>

              <a href="/documentation" class="text-[#F2E74B] hover:bg-[#F2D544] hover:text-[#010D00] rounded-md px-3 py-2">
                Documentación
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Aquí puedes agregar estilos adicionales si es necesario */
</style>