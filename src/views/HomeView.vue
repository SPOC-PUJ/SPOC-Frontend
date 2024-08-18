<script setup>
import Hero from "@/components/Hero.vue";
import HomeCards from "@/components/HomeCards.vue";
import FunctionalitiesList from "@/components/FunctionalitiesList.vue";
</script>

<template>
  <Hero />
  <HomeCards />
  <FunctionalitiesList v-bind:limitOfFuncionalities="6" v-bind:showSeeAllButton="true" />
</template>

<style scoped>

</style>