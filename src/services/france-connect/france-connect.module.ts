import { Module } from '@nestjs/common';
import { FranceConnectService } from './france-connect.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [FranceConnectService, ConfigService],
})
export class FranceConnectModule {}
