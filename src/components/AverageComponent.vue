<template>
    <button @click="calcularAverage">Average</button>
</template>


<script>
import { ref, computed , toRaw} from 'vue';
import { Complex } from '../proto/proto-ts/signal'; 
import {useSignalStore} from "@/stores/signalStore";
import { SignalService } from '@/services/signalService';


export default {
  setup() {
  
    const signalStore = useSignalStore()
    const signalComputed = computed(() => signalStore.signalObject);

    const calcularAverage = async () => {

      if (!signalComputed.value) {
        console.error('El objeto signalObject es null o no está inicializado.');
        return;
      }
      // despues se decide como trabajar esto
      // const signal = toRaw(signalStore.signalObject);
      // const signalData = [];
      // const veceigen = signal.get(0);

      // for(let i=0; i< veceigen.size ; i++){
      //   const complexValue = veceigen.get(i);

      //   signalData.push(Complex.create({ real:complexValue.real() , imag: complexValue.imag() }));
      // }

      const signalJson = toRaw(signalStore.signalJson)
      console.log("despues de traer el json",signalJson);
      
      try {
        const response = await SignalService.computeAverage(signalJson);
        console.log(response);
        
      } catch (error) {
        console.error('Error al realizar la solicitud gRPC:', error);
      }
    };

    return {
        calcularAverage,
    };
  },
};
</script>