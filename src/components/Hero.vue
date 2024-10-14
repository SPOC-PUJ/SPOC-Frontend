<script setup>

</script>

<template>
  <!-- Hero -->
  <section class="bg-gradient-to-r from-green-400 to-blue-500 py-20 mb-4 relative overflow-hidden animate-bg-gradient">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
          SPOK
        </h1>
        <p class="my-4 text-xl text-gray-100">
          Signal Processing on Kubernetes
        </p>
      </div>
    </div>
    <div class="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
      <div v-for="n in 15" :key="n" class="absolute w-8 h-8 bg-white rounded-full animate-bounce-signal" :style="`top: ${Math.random() * 90}%; left: ${Math.random() * 90}%; animation-delay: ${Math.random() * 5}s;`"></div>
    </div>
  </section>
</template>

<style scoped>
@keyframes bg-gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes bounce-signal {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(50px, 50px);
  }
}

.animate-bg-gradient {
  background: linear-gradient(270deg, #68D391, #63B3ED, #4FD1C5, #B794F4);
  background-size: 600% 600%;
  animation: bg-gradient 30s ease infinite;
}

.animate-bounce-signal {
  position: absolute;
  animation: bounce-signal 10s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}
</style>