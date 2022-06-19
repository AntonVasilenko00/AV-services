import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OkaiyaGameModule } from './okaiya-game/okaiya-game.module';

@Module({
  imports: [OkaiyaGameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
