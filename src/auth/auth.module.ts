import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UsersModule} from '../users/users.module'
import {PassportModule} from '@nestjs/passport'
import {LocalStrategy} from './local.strategy'
import {JwtModule} from '@nestjs/jwt'

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({
    secret: process.env.JWT_SECRET || 'SUPER_SECRET_SECRET',
    signOptions: { expiresIn: '24h' }
  })],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy]
})
export class AuthModule {
}
