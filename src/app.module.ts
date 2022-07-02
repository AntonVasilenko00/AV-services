import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OkaiyaGameModule } from './okaiya-game/okaiya-game.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [OkaiyaGameModule, UsersModule, ConfigModule.forRoot(), MongooseModule.forRoot(`mongodb+srv://antonvasilenko:${process.env.MONGO_DB_USER_PASSWORD}@maincluster.g8rf6.mongodb.net/?retryWrites=true&w=majority`, {dbName: process.env.MONGO_DB_NAME })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
