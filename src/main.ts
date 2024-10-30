import { NestFactory } from '@nestjs/core';
// import { CoreModule } from './modules/core.module';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
require('dotenv').config();

import * as dotenv from 'dotenv';

// dotenv.config({ path: `../config/env/${process.env.NODE_ENV}.env` });

async function bootstrap() {
  console.log("--- INIT ---");
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 4000;
  await app.listen(port);
}

bootstrap();
