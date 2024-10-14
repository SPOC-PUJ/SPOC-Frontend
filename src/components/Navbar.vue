<script setup>
import { RouterLink, useRoute } from "vue-router";
import logo from '../assets/img/logo.svg';

const isActiveLink = (routePath) => {
  const route = useRoute();
  return route.path === routePath;
}
</script>

<template>
  <nav class="bg-gray-900 border-b border-gray-700">
    <div class="mx-auto max-w-9xl px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <div
            class="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
        >
          <!-- Logo -->
          <RouterLink class="flex flex-shrink-0 items-center mr-4" to="/">
            <img class="h-10 w-auto" v-bind:src="logo" alt="SPOK - Signal Processing on Cloud" />
            <span class="hidden md:block text-gray-100 text-2xl font-bold ml-2">
              SPOK - Signal Processing on Kubernetes
            </span>
          </RouterLink>
          <div class="md:ml-auto">
            <div class="flex space-x-2">
              <RouterLink to="/" v-bind:class="[isActiveLink('/') ? 'bg-gray-700 text-white' : 'hover:bg-gray-800' , 'text-gray-100 rounded-md px-3 py-2']">
                Home
              </RouterLink>

              <RouterLink to="/functionalities" v-bind:class="[isActiveLink('/functionalities') ? 'bg-gray-700 text-white' : 'hover:bg-gray-800' , 'text-gray-100 rounded-md px-3 py-2']">
                Funcionalidades
              </RouterLink>

              <RouterLink to="/signal-visualizer" v-bind:class="[isActiveLink('/signal-visualizer') ? 'bg-gray-700 text-white' : 'hover:bg-gray-800' , 'text-gray-100 rounded-md px-3 py-2']">
                Visualizador
              </RouterLink>

              <RouterLink to="/processing-tools" v-bind:class="[isActiveLink('/processing-tools') ? 'bg-gray-700 text-white' : 'hover:bg-gray-800' , 'text-gray-100 rounded-md px-3 py-2']">
                Herramientas de Procesamiento
              </RouterLink>

              <RouterLink to="/documentation" v-bind:class="[isActiveLink('/documentation') ? 'bg-gray-700 text-white' : 'hover:bg-gray-800' , 'text-gray-100 rounded-md px-3 py-2']">
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

</style>