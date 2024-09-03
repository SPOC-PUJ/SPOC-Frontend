import { SignalServiceClient } from '../proto/proto-ts/signal.client';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { RuningSumRequest , MovingAverageRequest, FirstDifferenceRequest, IFFTRequest} from '../proto/proto-ts/signal';

const client = new SignalServiceClient(
    new GrpcWebFetchTransport({ baseUrl: 'http://localhost:8080' })
);



export const SignalService = {
    // Método para calcular la suma acumulada (Running Sum)
    async computeRunningSum(signalJson) {
      const request = RuningSumRequest.fromJson({
        signal: signalJson,
      });
  
      try {
        const { response } = await client.computeRuningSum(request);
        return response;
      } catch (error) {
        console.error('Error al realizar la solicitud gRPC:', error);
        throw error;
      }
    },
  
    // Método para calcular el promedio móvil (Moving Average)
    async computeMovingAverage(signalJson, windowSize) {
      const request = MovingAverageRequest.fromJson({
        signal: signalJson,
        window_size: windowSize,
      });
  
      try {
        const { response } = await client.computeMovingAverage(request);
        return response;
      } catch (error) {
        console.error('Error al realizar la solicitud gRPC:', error);
        throw error;
      }
    },

    // Metodo primera derivada (First Difference)

    async computeFirstDifference(signalJson){
        const request = FirstDifferenceRequest.fromJson({
            signal: signalJson,
        });
        try {
            const { response } = await client.computeFirstDifference(request);
            return response;
        } catch (error) {
            console.error('Error al realizar la solicitud gRPC:', error);
            throw error;
        }
    },

    async computeIFFT(signalJson){
      const request = IFFTRequest.fromJson({
          signal: signalJson,
      });
      try {
          const { response } = await client.computeIFFT(request);
          return response;
      } catch (error) {
          console.error('Error al realizar la solicitud gRPC:', error);
          throw error;
      }
  },
  };