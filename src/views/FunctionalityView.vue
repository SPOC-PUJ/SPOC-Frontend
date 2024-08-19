<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import FuncionalitiesItems from "@/Funcionalities.json"

const route = useRoute();
const functionality = ref(null);

// Se ejecuta de forma reactiva cuando cambia la ruta
watchEffect(() => {
  const id = route.params.id;
  functionality.value = FuncionalitiesItems.find(item => item.id === id);

  if (!functionality.value) {
    console.warn(`Functionality with ID ${id} not found`);
  }
});
</script>

<template>
  <section class="bg-green-50">
    <div class="container m-auto py-10 px-6">
      <div class="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
        <main>
          <div class="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
            <h1 class="text-3xl font-bold mb-4"> {{ functionality.title }} </h1>
            <div class="text-gray-500 mb-4">{{ functionality.subtitle }}</div>
            <div class="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
              <i class="pi pi-clock text-orange-700"></i>
              <p class="text-orange-700">{{ functionality.processTime }}</p>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 class="text-green-800 text-lg font-bold mb-6">
              Descripción de la funcionalidad
            </h3>

            <p class="mb-4">
              {{
                functionality.longDescription
              }}
            </p>
            <img :src="functionality.image" alt="Image related to the functionality" class="rounded-lg shadow-md mt-4"/>
            <p class="mt-6 mb-4">
              {{
                functionality.functionalityScientificExplanation
              }}
            </p>
          </div>
        </main>

        <!-- Sidebar -->
        <aside>
          <!-- Company Info -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-bold mb-6">Lorem ipsum dolor.</h3>

            <h2 class="text-2xl">Lorem ipsum</h2>

            <p class="my-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque suscipit maximus accumsan. Integer cursus
              laoreet accumsan. Cras volutpat maximus lectus eu pretium. Cras id nulla nibh. Proin elit dolor,
              vestibulum non risus eu, aliquet rutrum turpis. Proin dolor mauris, ornare vel porta vulputate,
              commodo eget justo. Nam malesuada est in velit cursus, at vestibulum velit pretium. Vivamus bibendum
              nulla id lacus suscipit sagittis.
            </p>

            <hr class="my-4" />

            <h3 class="text-xl">Email:</h3>

            <p class="my-2 bg-green-100 p-2 font-bold">
              a-vigna@javeriana.edu.co
            </p>

            <h3 class="text-xl">Teléfono:</h3>

            <p class="my-2 bg-green-100 p-2 font-bold">555-555-5555</p>
          </div>

          <!-- Manage -->
          <div class="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 class="text-xl font-bold mb-6">Manage Something</h3>
            <a
                href="add-job.html"
                class="bg-green-500 hover:bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
            >Edit</a
            >
            <button
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
            >
              Delete
            </button>
          </div>
        </aside>
      </div>
    </div>
  </section>

</template>

<style scoped>

</style>