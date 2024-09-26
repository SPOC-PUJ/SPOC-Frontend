import { SignalServiceClient } from '../proto/proto-ts/signal.client';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { RuningSumRequest , MovingAverageRequest, FirstDifferenceRequest, IFFTRequest, FastWaveletTransformHaarRequest, FastWaveletTransformRequest,FFTRequest,AverageRequest,FftConvolveRequest} from '../proto/proto-ts/signal';

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

    async computeFastWaveletHarr(signalJson){
      const request = FastWaveletTransformHaarRequest.fromJson({
          signal: signalJson,
      });
      try {
          const { response } = await client.computeFastWaveletHaar(request);
          return response;
      } catch (error) {
          console.error('Error al realizar la solicitud gRPC:', error);
          throw error;
      }
  },

    async computeFastWaveletTransform(signalJson, decLevel,WaveName){
      const request = FastWaveletTransformRequest.fromJson({
          signal: signalJson,
          dec_level:decLevel,
          wave_name:WaveName,
      });
      try {
          console.log(WaveName);
          
          const { response } = await client.computeFastWaveletTransform(request);
          return response;
      } catch (error) {
          console.error('Error al realizar la solicitud gRPC:', error);
          throw error;
      }
  },

    async computeFFT(signalJson){
      const request = FFTRequest.fromJson({
          signal: signalJson,
      });
      try {
          const { response } = await client.computeFFT(request);
          return response;
      } catch (error) {
          console.error('Error al realizar la solicitud gRPC:', error);
          throw error;
      }
    },

    async computeFFT_convolve(signalJsonx,signalJsonh,shift){
      const request = FftConvolveRequest.fromJson({
        signalx: signalJsonx,
        signalh: signalJsonh,
        shift: shift,
  
      });
      try {
          const { response } = await client.computeFftConvolve(request);
          return response;
      } catch (error) {
          console.error('Error al realizar la solicitud gRPC:', error);
          throw error;
      }
    },
  

    async computeAverage(signalJson){
      const request = AverageRequest.fromJson({
        signals: signalJson,
  
      });
      try {
          const { response } = await client.computeAverage(request);
          return response;
      } catch (error) {
          console.error('Error al realizar la solicitud gRPC:', error);
          throw error;
      }
    },
  };