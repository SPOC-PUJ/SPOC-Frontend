import { MatServiceClient } from '../proto/proto-ts/mat_service.client';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { MatRequest } from '../proto/proto-ts/mat_service';

const client = new MatServiceClient(
    new GrpcWebFetchTransport({ baseUrl: 'http://34.173.110.150:80' })
);

export const MATReaderService = {

    async ReadMat(fileBytes,field) {
      const request = MatRequest.create({
        fileContent: fileBytes,
        field: field,
      });
  
      try {
        const { response } = await client.readMat(request);
        return response;
      } catch (error) {
        console.error('Error al realizar la solicitud gRPC:', error);
        throw error;
      }
  },

};