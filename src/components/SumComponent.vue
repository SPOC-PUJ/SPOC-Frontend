<template>
  <div class="sum-component">
    <h2>Sumar Números</h2>
    <div>
      <label for="numero1">Número 1:</label>
      <input type="number" v-model="numero1" id="numero1" />
    </div>
    <div>
      <label for="numero2">Número 2:</label>
      <input type="number" v-model="numero2" id="numero2" />
    </div>
    <button @click="sumarNumeros">Sumar</button>
    <p v-if="resultado !== null">Resultado: {{ resultado }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { numbers } from '../proto/proto-ts/math'; // Asegúrate de que este es el mensaje correcto
import { SumServiceClient } from '../proto/proto-ts/math.client';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

export default {
  setup() {
    const numero1 = ref(0);
    const numero2 = ref(0);
    const resultado = ref(null);

    const client = new SumServiceClient(
      new GrpcWebFetchTransport({ baseUrl: 'http://localhost:5000' })
    );

    const sumarNumeros = async () => {
      const request = numbers.fromJson({
        x: parseFloat(numero1.value),
        y: parseFloat(numero2.value),
      });

      try {
        const response = await client.suma(request);
        resultado.value = response.value;
      } catch (error) {
        console.error("Error al realizar la suma:", error);
      }
    };

    return {
      numero1,
      numero2,
      resultado,
      sumarNumeros,
    };
  },
};
</script>


<style scoped>
.sum-component {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
button {
  margin-top: 10px;
}
</style>
