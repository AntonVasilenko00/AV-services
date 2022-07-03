import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OkaiyaGameModule } from './okaiya-game/okaiya-game.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      url: 'postgres://rzzwqjveuoznlk:d23ef1a2c65eaeddb7f5d17bc7c17dcaebfe6ca2e46ae11aaa044bc16818cce2@ec2-54-75-184-144.eu-west-1.compute.amazonaws.com:5432/d6mividaqovmdo',
      type: 'postgres',
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [User],
      synchronize: true, // This for development
      autoLoadEntities: true,
    }),
    OkaiyaGameModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
