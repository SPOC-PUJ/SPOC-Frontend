<template>
    <button @click="calcularPromedioMovil">EL PROMEDIO</button>
</template>

<script>
import { ref } from 'vue';
import { MovingAverageRequest, Complex } from '../proto/proto-ts/signal'; // Asegúrate de que este es el mensaje correcto
import { SignalServiceClient } from '../proto/proto-ts/signal.client';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

export default {
  setup() {
  

    const client = new SignalServiceClient(
      new GrpcWebFetchTransport({ baseUrl: 'http://localhost:8080' })
    );

    const calcularPromedioMovil = async () => {
      const request = MovingAverageRequest.fromJson({
        signal: [
          { real: 1.0, imag: 2.0 },
          { real: 3.0, imag: 4.0 },
          { real: 5.0, imag: 6.0 },
          { real: 7.0, imag: 8.0 }
        ],
        window_size: 2,
      });

      try {
        const {response} = await client.computeMovingAverage(request);
        console.log(response);
        
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