import { NestFactory } from '@nestjs/core';
import { CoreModule } from '../legacy/modules/core.module';

async function bootstrap() {
  console.log("--- INIT ---")
  const app = await NestFactory.create(CoreModule);
  await app.listen(3000);
}
bootstrap();
