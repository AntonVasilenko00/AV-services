import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OkaiyaGameModule } from './okaiya-game/okaiya-game.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        url: config.get('DATABASE_URL'),
        type: 'postgres',
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [User],
        synchronize: true, // This for development
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    OkaiyaGameModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
