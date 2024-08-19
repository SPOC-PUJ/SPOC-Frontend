<script setup>
import { RouterLink } from "vue-router";
import NotFoundImage from '@/assets/img/sad-dog.jpg'; // Asegúrate de que la ruta de la imagen sea correcta
</script>

<template>
  <section class="text-center flex flex-col justify-center items-center h-auto mt-6">
    <i class="pi pi-exclamation-triangle text-red-600 text-7xl mb-5"></i>
    <h1 class="text-6xl font-bold mb-4">404 Not Found</h1>
    <img :src="NotFoundImage" alt="404 Not Found" class="w-64 h-32 mb-5" /> <!-- Imagen -->
    <div>
      <p class="text-lg">Lo sentimos, la página que buscas no existe.</p>
    </div>


    <RouterLink to="/" class="text-white bg-green-700 hover:bg-green-900 rounded-md px-3 py-2 mt-4">
      Regresar
    </RouterLink>
  </section>
</template>

<style scoped>

</style>