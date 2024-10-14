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
  <div class="bg-white rounded-xl shadow-md border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br from-green-100 via-transparent to-white">
    <div class="p-4">
      <div class="mb-6">
        <h3 class="text-xl font-bold text-gray-800">{{ funcionality.title }}</h3>
        <div class="text-gray-600 my-2">{{ funcionality.subtitle }}</div>
      </div>

      <div class="mb-5">
        <div>
          {{ shorterDescription }}
        </div>
        <button @click="toggleFullFuncionalityDescription" class="text-green-600 hover:text-green-700 mb-5">
          {{ showFullFuncionalityDescription ? 'Ver menos' : 'Ver más' }}
        </button>
      </div>

      <div class="border border-gray-100 mb-5"></div>

      <div class="mb-5">
        <div>
          {{ shorterBenefits }}
        </div>
        <button @click="toggleFullFuncionalityBenefits" class="text-green-600 hover:text-green-700 mb-5">
          {{ showFullFuncionalityBenefits ? 'Ver menos' : 'Ver más' }}
        </button>
      </div>

      <div class="flex justify-center mb-4">
        <RouterLink v-bind:to="'/functionalities/' + funcionality.id" class="h-[48px] bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-center text-lg">
          Ver más
        </RouterLink>
      </div>
    </div>
  </div>
</template>


<style scoped>

</style>