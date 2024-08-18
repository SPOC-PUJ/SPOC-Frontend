<script setup>
import { defineProps, ref, computed } from 'vue';
import { RouterLink } from "vue-router";

const props = defineProps({
  funcionality: Object
});

const toggleFullFuncionalityDescription = () => {
  showFullFuncionalityDescription.value = !showFullFuncionalityDescription.value;
};

const toggleFullFuncionalityBenefits = () => {
  showFullFuncionalityBenefits.value = !showFullFuncionalityBenefits.value;
};

const showFullFuncionalityDescription = ref(false);

const shorterDescription = computed(() => {
  let description = props.funcionality.description;

  if(showFullFuncionalityDescription.value === false)
  {
    description = description.substring(0, 100) + '...';
  }
  return description;
});


const showFullFuncionalityBenefits = ref(false);

const shorterBenefits = computed(() => {
  let benefits = props.funcionality.benefits;

  if(showFullFuncionalityBenefits.value === false)
  {
    benefits = benefits.substring(0, 100) + '...';
  }
  return benefits;
});

</script>

<template>
  <div class="bg-white rounded-xl shadow-md relative">
    <div class="p-4">
      <div class="mb-6">
        <h3 class="text-xl font-bold">{{ funcionality.title }}</h3>
        <div class="text-gray-600 my-2">{{ funcionality.subtitle }}</div>
      </div>

      <div class="mb-5">
        <div>
          {{ shorterDescription }}
        </div>
        <button @click="toggleFullFuncionalityDescription" class="text-green-500 hover:text-green-600 mb-5">
          {{ showFullFuncionalityDescription ? 'Ver menos' : 'Ver más' }}
        </button>
      </div>

      <!--  <h3 class="text-green-500 mb-2">$70 - $80K / Year</h3>  -->

      <div class="border border-gray-100 mb-5"></div>

      <div class="mb-5">
        <div>
          {{ shorterBenefits }}
        </div>
        <button @click="toggleFullFuncionalityBenefits" class="text-green-500 hover:text-green-600 mb-5">
          {{ showFullFuncionalityBenefits ? 'Ver menos' : 'Ver más' }}
        </button>
      </div>

      <div class="flex flex-col lg:flex-row justify-between mb-4">
        <div class="text-orange-700 mb-3">
          <i class="pi pi-clock text-orange-700"></i>
          {{ funcionality.processTime }}
        </div>
        <RouterLink v-bind:to="'/functionalities/' + funcionality.id" class="h-[36px] bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-center text-sm">
          Ver más
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>