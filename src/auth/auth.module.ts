import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UsersModule} from '../users/users.module'
import {PassportModule} from '@nestjs/passport'
import {LocalStrategy} from './local.strategy'
import {JwtModule} from '@nestjs/jwt'
import jwtConfig from '../config/jwt'
import {JwtStrategy} from './jwt.strategy'

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({
    secret: jwtConfig.secret,
    signOptions: { expiresIn: jwtConfig.expiresIn }
  })],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {
}
