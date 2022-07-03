import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as _ from 'lodash';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { IAuthResponse } from './auth.controller';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Partial<User>> {
    const user = await this.usersService.findByUserName(username);

    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await user.comparePasswords(password);

    if (!isPasswordValid) throw new ForbiddenException('Invalid Password');

    return _.omit(user, 'password');
  }

  async login(user: User): Promise<IAuthResponse> {
    const payload = { username: user.userName, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
