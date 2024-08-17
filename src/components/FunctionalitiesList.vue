<script setup>
import Funcionality from "@/components/Funcionality.vue";

// Se importa el archivo JSON con las funcionalidades de SPOC.
import FuncionalitiesItems from "@/Funcionalities.json"

// Se crea una variable reactiva para almacenar las funcionalidades.
import { ref } from "vue";

// Se almacenan las funcionalidades en la variable reactiva.
const funcionalities = ref(FuncionalitiesItems);
console.log("Funcionalities Items: ", funcionalities.value);
</script>

<template>
  <section class="bg-blue-50 px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <h2 class="text-3xl font-bold text-green-500 mb-6 text-center">
        Funcionalidades de SPOC
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Funcionality v-for="funcionality in funcionalities" :key="funcionality.id" v-bind:funcionality="funcionality"/>
      </div>
    </div>
  </section>

</template>

<style scoped>

</style>