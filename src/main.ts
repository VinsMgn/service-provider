import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('ejs'); // Définir EJS comme moteur de rendu
    // Middleware de session
    app.use(
      session({
        secret: '5b46cea0c3b78e8a585d3c554e71b7096fc66d88609a0e71d90e3c78a010ab36',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
      }));
  
  await app.listen(process.env.PORT ?? 3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
