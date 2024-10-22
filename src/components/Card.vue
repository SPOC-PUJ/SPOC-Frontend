<script setup>
defineProps({
  cardBackground: {
    type: String,
    default: 'bg-gray-100'
  }
})
</script>

<template>
  <div v-bind:class="`${cardBackground} p-6 rounded-lg shadow-md`">
    <slot>
      <!-- Default content here -->

    </slot>
  </div>
</template>

<style scoped>

</style>