import { User } from '../users/entities/user.entity';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export default {
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
} as TypeOrmModuleAsyncOptions;
