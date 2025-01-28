import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';

declare const module: any;

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./secrets/key.pem'),
    cert: fs.readFileSync('./secrets/cert.pem'),
  };
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions
  });
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('ejs'); // Définir EJS comme moteur de rendu
  await app.listen(process.env.PORT ?? 3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
