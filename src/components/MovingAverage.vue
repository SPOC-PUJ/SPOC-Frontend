<template>
    <button @click="calcularPromedioMovil">EL PROMEDIO</button>
</template>

<script>
import { ref, computed , toRaw} from 'vue';
import { MovingAverageRequest, Complex } from '../proto/proto-ts/signal'; // Asegúrate de que este es el mensaje correcto
import { SignalServiceClient } from '../proto/proto-ts/signal.client';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import {useSignalStore} from "@/stores/signalStore";


export default {
  setup() {
  
    const signalStore = useSignalStore()
    const signalComputed = computed(() => signalStore.signalObject);

    const client = new SignalServiceClient(
      new GrpcWebFetchTransport({ baseUrl: 'http://localhost:8080' })
    );

    const calcularPromedioMovil = async () => {
      if (!signalComputed.value) {
        console.error('El objeto signalObject es null o no está inicializado.');
        return;
      }
      const signal = toRaw(signalStore.signalObject);
      const signalData = [];
      const veceigen = signal.get(0);

      for(let i=0; i< veceigen.size ; i++){
        const complexValue = veceigen.get(i);

        signalData.push(Complex.create({ real:complexValue.real() , imag: complexValue.imag() }));
      }

      const request = MovingAverageRequest.fromJson({
        signal: signalData,
        window_size: 10,
      });

      try {
        const {response} = await client.computeMovingAverage(request);
        console.log(response);
        console.log(signal);
        
      } catch (error) {
        console.error('Error al realizar la solicitud gRPC:', error);
      }
    };

    return {
      calcularPromedioMovil,
    };
  },
};
</script>