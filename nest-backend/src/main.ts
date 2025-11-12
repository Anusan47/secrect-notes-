import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({ origin: true, credentials: true });
  app.use(rateLimit.default({ windowMs: 15*60*1000, max: 100 }));
  await app.listen(process.env.PORT || 4000);
  console.log('Server running on port', process.env.PORT || 4000);
}
bootstrap();
