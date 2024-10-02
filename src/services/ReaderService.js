import { ABFServiceClient } from '../proto/proto-ts/reader.client';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { ABFRequest } from '../proto/proto-ts/reader';

const client = new ABFServiceClient(
    new GrpcWebFetchTransport({ baseUrl: 'http://localhost:8080' })
);


export const ReaderService = {

    async ReadAbf(fileBytes) {
        const request = ABFRequest.create({
          fileContent: fileBytes,
        });
    
        try {
          const { response } = await client.readAbf(request);
          return response;
        } catch (error) {
          console.error('Error al realizar la solicitud gRPC:', error);
          throw error;
        }
    },

};