import { Module } from '@nestjs/common';
import { OkaiyaGameController } from './okaiya-game.controller';
import { OkaiyaGameService } from './okaiya-game.service';
import { OkaiyaGameGateway } from './okaiya-game.gateway';

@Module({
  controllers: [OkaiyaGameController],
  providers: [OkaiyaGameService, OkaiyaGameGateway],
})
export class OkaiyaGameModule {}
