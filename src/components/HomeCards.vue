<script setup>
import Card from "@/components/Card.vue";
</script>

<template>
  <section class="py-4">
    <div class="container-xl lg:container m-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
        <Card cardBackground="bg-[#F2E74B]">
          <h2 class="text-2xl font-bold text-[#010D00]">Visualización de Señales</h2>
          <p class="mt-2 mb-4 text-[#735620]">
            Explora y analiza tus señales en tiempo real con nuestro visualizador rápido y eficiente. Diseñado para manejar grandes volúmenes de datos sin sacrificar la velocidad ni la interactividad.
          </p>
          <a href="visualizador.html" class="inline-block bg-[#F2B441] text-[#010D00] rounded-lg px-4 py-2 hover:bg-[#735620] hover:text-white">
            TO-DO
          </a>
        </Card>
        <Card cardBackground="bg-[#F2E74B]">
          <h2 class="text-2xl font-bold text-[#010D00]">Procesamiento de Alta Velocidad</h2>
          <p class="mt-2 mb-4 text-[#735620]">
            Aprovecha la potencia de C y C++ para el procesamiento y transformación de señales. Nuestro sistema optimizado garantiza tiempos de respuesta mínimos y un rendimiento superior en la nube.
          </p>
          <a href="herramientas.html" class="inline-block bg-[#F2B441] text-[#010D00] rounded-lg px-4 py-2 hover:bg-[#735620] hover:text-white">
            TO-DO
          </a>
        </Card>
      </div>
    </div>
  </section>

  <section class="py-4">
    <div class="container-xl lg:container m-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
        <Card cardBackground="bg-[#F2E74B]">
          <h2 class="text-2xl font-bold text-[#010D00]">Transformación Avanzada de Señales</h2>
          <p class="mt-2 mb-4 text-[#735620]">
            Aplica transformadas wavelet, filtrado de ruido y más con nuestras herramientas de procesamiento avanzadas. Diseñado para ofrecer precisión y eficiencia en cada operación.
          </p>
          <a href="herramientas.html" class="inline-block bg-[#F2B441] text-[#010D00] rounded-lg px-4 py-2 hover:bg-[#735620] hover:text-white">
            TO-DO
          </a>
        </Card>
        <Card cardBackground="bg-[#F2E74B]">
          <h2 class="text-2xl font-bold text-[#010D00]">Código Abierto y Colaborativo</h2>
          <p class="mt-2 mb-4 text-[#735620]">
            SPOC es un proyecto OpenSource, impulsado por la colaboración de una comunidad global. Contribuye, adapta y mejora la plataforma según tus necesidades específicas.
          </p>
          <a href="documentacion.html" class="inline-block bg-[#F2B441] text-[#010D00] rounded-lg px-4 py-2 hover:bg-[#735620] hover:text-white">
            Ir a la Documentación
          </a>
        </Card>
      </div>
    </div>
  </section>

</template>

<style scoped>

</style>