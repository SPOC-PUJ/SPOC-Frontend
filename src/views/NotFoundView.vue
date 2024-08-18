<script setup>
import { RouterLink } from "vue-router";
import NotFoundImage from '@/assets/img/sad-dog.jpg'; // Asegúrate de que la ruta de la imagen sea correcta
</script>

<template>
  <section class="text-center flex flex-col justify-center items-center h-96">
    <h1 class="text-6xl font-bold mb-4">404 Not Found</h1>
    <img :src="NotFoundImage" alt="404 Not Found" class="w-64 h-32 mb-5" /> <!-- Imagen -->
    <p class="text-xl mb-5">Al parecer, esta página aún no existe.</p>
    <RouterLink to="/" class="text-white bg-green-700 hover:bg-green-900 rounded-md px-3 py-2 mt-4">
      Regresar
    </RouterLink>
  </section>
</template>

<style scoped>

</style>