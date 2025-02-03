import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IdentityService } from './identity.service';

@Module({
  providers: [IdentityService, ConfigService],
})
export class IdentityServiceModule {}
