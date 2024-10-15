import { NestFactory } from '@nestjs/core';
import { CoreModule } from './modules/core.module';

import * as dotenv from 'dotenv';

dotenv.config({ path: `../config/env/${process.env.NODE_ENV}.env` });

async function bootstrap() {
  console.log("--- INIT ---")
  const app = await NestFactory.create(CoreModule);
  await app.listen(3000);
}
bootstrap();
