import {Body, Controller, Post} from '@nestjs/common';

@Controller('auth')
export class AuthController {

  @Post('/login')
  login(@Body() loginDto) {
    return 'login'

  }

  @Post('/signup')
  signUp(@Body() signupDto) {
    return 'signup'
  }
}
