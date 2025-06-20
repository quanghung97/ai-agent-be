import { Module, Global } from '@nestjs/common';
import { VectorStoreServicegRPC } from './grpc/vector-store.grpc';

@Global()
@Module({
  providers: [VectorStoreServicegRPC],
  exports: [VectorStoreServicegRPC],
})
export class VectorStoreModule {}
