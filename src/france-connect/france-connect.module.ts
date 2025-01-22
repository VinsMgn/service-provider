import { Module } from '@nestjs/common';
import { FranceConnectService } from './france-connect.service';

@Module({
  providers: [FranceConnectService]
})
export class FranceConnectModule {}
