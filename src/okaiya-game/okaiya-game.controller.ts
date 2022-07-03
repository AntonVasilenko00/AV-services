import {Controller, Get, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard'

@Controller('okaiya-game')
export class OkaiyaGameController {
  @UseGuards(JwtAuthGuard)
  @Get('/')
  getIndex() {
    return 'Okayia';
  }
}
