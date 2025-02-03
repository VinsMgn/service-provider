import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FranceConnectModule } from './services/france-connect/france-connect.module';
import { ConfigModule } from '@nestjs/config';
import { FranceConnectService } from './services/france-connect/france-connect.service';
import { IdentityService } from './services/identity/identity.service';

@Module({
  imports: [FranceConnectModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, FranceConnectService, IdentityService],
})
export class AppModule {}
