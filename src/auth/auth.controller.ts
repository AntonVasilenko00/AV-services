import {
  Body,
  Controller,
  HttpException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

export interface IAuthResponse {
  access_token: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req): Promise<IAuthResponse> {
    return await this.authService.login(req.user);
  }

  @Post('/signup')
  async signUp(@Body() signupDto: CreateUserDto): Promise<IAuthResponse> {
    try {
      const newUser = await this.usersService.create(signupDto);
      return this.authService.login(newUser);
    } catch (e) {
      throw new HttpException(e.detail, 400);
    }
  }
}
