<script setup>
import { RouterLink } from "vue-router";

import Card from "@/components/Card.vue";
</script>

<template>
  <section class="hero-section-component">
    <Hero />
  </section>

  <section class="py-4">
    <div class="container-xl lg:container m-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
        <Card cardBackground="bg-white shadow-md">
          <h2 class="text-2xl font-bold text-gray-800">Visualización de Señales</h2>
          <p class="mt-2 mb-4 text-gray-600">
            Explora y analiza tus señales en tiempo real con nuestro visualizador rápido y eficiente. Diseñado para manejar grandes volúmenes de datos sin sacrificar la velocidad ni la interactividad.
          </p>
          <RouterLink to="/signal-visualizer" class="inline-block bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700">
            Visualizar Señales
          </RouterLink>
        </Card>
        <Card cardBackground="bg-white shadow-md">
          <h2 class="text-2xl font-bold text-gray-800">Procesamiento de Alta Velocidad</h2>
          <p class="mt-2 mb-4 text-gray-600">
            Aprovecha la potencia de C y C++ para el procesamiento y transformación de señales. Nuestro sistema optimizado garantiza tiempos de respuesta mínimos y un rendimiento superior en la nube.
          </p>
          <RouterLink to="/processing-tools" class="inline-block bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700">
            Procesar Señales
          </RouterLink>
        </Card>
      </div>
    </div>
  </section>

  <section class="py-4">
    <div class="container-xl lg:container m-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
        <Card cardBackground="bg-white shadow-md">
          <h2 class="text-2xl font-bold text-gray-800">Transformación Avanzada de Señales</h2>
          <p class="mt-2 mb-4 text-gray-600">
            Aplica transformadas wavelet, filtrado de ruido y más con nuestras herramientas de procesamiento avanzadas. Diseñado para ofrecer precisión y eficiencia en cada operación.
          </p>
          <RouterLink to="/processing-tools" class="inline-block bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700">
            Herramientas Avanzadas
          </RouterLink>
        </Card>
        <Card cardBackground="bg-white shadow-md">
          <h2 class="text-2xl font-bold text-gray-800">Código Abierto y Colaborativo</h2>
          <p class="mt-2 mb-4 text-gray-600">
            SPOK es un proyecto OpenSource, impulsado por la colaboración de una comunidad global. Contribuye, adapta y mejora la plataforma según tus necesidades específicas.
          </p>
          <RouterLink to="/documentation" class="inline-block bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700">
            Ir a la Documentación
          </RouterLink>
        </Card>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section-component {
  background: linear-gradient(to bottom, #68D391, #ffffff); /* Gradiente que va desde el color del hero hasta blanco */
}
</style>