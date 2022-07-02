import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  console.log( process.env.MONGO_DB_NAME)

  const app = await NestFactory.create(AppModule);

  

  app.enableCors();

  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
