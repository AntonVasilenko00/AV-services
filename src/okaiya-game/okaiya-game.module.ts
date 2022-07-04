import { Module } from '@nestjs/common';
import { OkaiyaGameController } from './okaiya-game.controller';
import { OkaiyaGameService } from './okaiya-game.service';
import { OkaiyaGameGateway } from './okaiya-game.gateway';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OkaiyaGame } from './entities/okaiya.game.entity';

@Module({
  controllers: [OkaiyaGameController],
  providers: [OkaiyaGameService, OkaiyaGameGateway],
  imports: [TypeOrmModule.forFeature([OkaiyaGame]), UsersModule, AuthModule],
})
export class OkaiyaGameModule {}
