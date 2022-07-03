import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' })
  access_token: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Login and provide jwt.' })
  @ApiOkResponse({ description: 'Logged in successfully', type: AuthResponse })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiForbiddenResponse({ description: 'Invalid password.' })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('/login')
  async login(@Request() req): Promise<AuthResponse> {
    return await this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Signup and provide jwt.' })
  @ApiCreatedResponse({
    description: 'User created successfully.',
    type: AuthResponse,
  })
  @ApiBadRequestResponse({ description: 'Failed to create a new user.' })
  @Post('/signup')
  async signUp(@Body() signupDto: CreateUserDto): Promise<AuthResponse> {
    try {
      const newUser = await this.usersService.create(signupDto);
      return this.authService.login(newUser);
    } catch (e) {
      throw new HttpException(e.detail, 400);
    }
  }
}
