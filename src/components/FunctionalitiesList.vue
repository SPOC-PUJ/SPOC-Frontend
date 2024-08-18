<script setup>
// Se crea una variable reactiva para almacenar las funcionalidades.
import { ref, defineProps } from "vue";

import Funcionality from "@/components/Funcionality.vue";

// Se importa el archivo JSON con las funcionalidades de SPOC.
import FuncionalitiesItems from "@/Funcionalities.json"

// Se almacenan las funcionalidades en la variable reactiva.
const funcionalities = ref(FuncionalitiesItems);
console.log("Funcionalities Items: ", funcionalities.value);

defineProps({
  limitOfFuncionalities: Number
})
</script>

<template>
  <section class="bg-blue-50 px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <h2 class="text-3xl font-bold text-green-500 mb-6 text-center">
        Funcionalidades de SPOC
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Funcionality v-for="funcionality in funcionalities.slice(0, limitOfFuncionalities || funcionalities.lenght)" :key="funcionality.id" v-bind:funcionality="funcionality"/>
      </div>
    </div>
  </section>

</template>

<style scoped>

</style>