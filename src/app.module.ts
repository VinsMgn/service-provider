import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FranceConnectModule } from './france-connect/france-connect.module';
import { ConfigModule } from '@nestjs/config';
import { FranceConnectService } from './france-connect/france-connect.service';

@Module({
  imports: [FranceConnectModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, FranceConnectService],
})
export class AppModule {}
