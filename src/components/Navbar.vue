<script setup>
import { RouterLink } from "vue-router";
import logo from '../assets/img/logo.svg';
</script>

<template>
  <nav class="bg-[#010D00] border-b border-[#735620]">
    <div class="mx-auto max-w-9xl px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <div
            class="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
        >
          <!-- Logo -->
          <RouterLink class="flex flex-shrink-0 items-center mr-4" to="/">
            <img class="h-10 w-auto" v-bind:src="logo" alt="SPOC - Signal Processing on Cloud" />
            <span class="hidden md:block text-[#F2E74B] text-2xl font-bold ml-2">
              SPOC - Signal Processing on Cloud
            </span>
          </RouterLink>
          <div class="md:ml-auto">
            <div class="flex space-x-2">
              <RouterLink to="/" class="text-[#F2E74B] bg-[#735620] hover:bg-[#F2B441] hover:text-[#010D00] rounded-md px-3 py-2">
                Home
              </RouterLink>

              <RouterLink to="/functionalities" class="text-[#F2E74B] hover:bg-[#F2D544] hover:text-[#010D00] rounded-md px-3 py-2">
                Funcionalidades
              </RouterLink>

              <RouterLink to="/signal-visualizer" class="text-[#F2E74B] hover:bg-[#F2D544] hover:text-[#010D00] rounded-md px-3 py-2">
                Visualizador
              </RouterLink>

              <RouterLink to="/processing-tools" class="text-[#F2E74B] hover:bg-[#F2D544] hover:text-[#010D00] rounded-md px-3 py-2">
                Herramientas de Procesamiento
              </RouterLink>

              <RouterLink to="/documentation" class="text-[#F2E74B] hover:bg-[#F2D544] hover:text-[#010D00] rounded-md px-3 py-2">
                Documentación
              </RouterLink>
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