<template>
    <div>
      <button @click="calcularCWT">CWT</button>
      <div>
        <label for="start">Start:</label>
        <input type="number" v-model="start" id="start" />
      </div>
      <div>
        <label for="end">End:</label>
        <input type="number" v-model="end" id="end" />
      </div>
      <div>
        <label for="numScales">Num Scales:</label>
        <input type="number" v-model="numScales" id="numScales" min="1" />
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, toRaw } from 'vue';
  import { Complex } from '../proto/proto-ts/signal'; 
  import { useSignalStore } from "@/stores/signalStore";
  import { SignalService } from '@/services/signalService';
  
  export default {
    setup() {
      const signalStore = useSignalStore();
      const signalComputed = computed(() => signalStore.signalObject);
      
      // Nuevas propiedades reactivas para start, end y numScales
      const start = ref(1); // Valor inicial
      const end = ref(10);   // Valor inicial
      const numScales = ref(5); // Valor inicial
  
      const calcularCWT = async () => {
        if (!signalComputed.value) {
          console.error('El objeto signalObject es null o no está inicializado.');
          return;
        }
  
        const signalJson = toRaw(signalStore.signalJson);
        console.log("despues de traer el json", signalJson[0]);
        console.log(start.value);
        console.log(end.value);
        console.log(numScales.value);
        
        try {
          // Llama a computeCWT con los nuevos parámetros
          const response = await SignalService.computeCWT(signalJson[0], start.value, end.value, numScales.value);
          console.log(response);
        } catch (error) {
          console.error('Error al realizar la solicitud gRPC:', error);
        }
      };
  
      return {
        calcularCWT,
        start,
        end,
        numScales,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Estilos opcionales para mejorar la apariencia */
  label {
    margin-right: 10px;
  }
  input {
    margin-bottom: 10px;
    display: block;
  }
  </style>
  