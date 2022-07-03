import {Body, Controller, Post, Request, UseGuards} from '@nestjs/common';
import {LocalAuthGuard} from './local-auth.guard'

@Controller('auth')
export class AuthController {


  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req) {
    return req.user
  }

  @Post('/signup')
  signUp(@Body() signupDto) {
    return 'signup'
  }
}
