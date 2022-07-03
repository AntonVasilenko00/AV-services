import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {UsersService} from '../users/users.service'
import * as _ from 'lodash'
import {User} from '../users/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {
  }

  async validateUser(username: string, password: string): Promise<Partial<User> | false> {
    const user = await this.usersService.findByUserName(username);

    if (!user) throw new NotFoundException('User not found')

    const isPasswordValid = await user.comparePasswords(password)

    if (!isPasswordValid) throw new ForbiddenException('Invalid Password')

    return _.omit(user, 'password');
  }
}
