import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FranceConnectModule } from './france-connect/france-connect.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [FranceConnectModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
