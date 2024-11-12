import { ABFServiceClient } from '../proto/proto-ts/reader.client';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { ABFRequest } from '../proto/proto-ts/reader';

const client = new ABFServiceClient(
    new GrpcWebFetchTransport({ baseUrl: 'http://34.173.110.150:80' })
);


export const ABFReaderService = {

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