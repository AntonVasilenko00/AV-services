import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('okaiya-game')
@Controller('okaiya-game')
export class OkaiyaGameController {
  @ApiOperation({ summary: 'Health-check endpoint' })
  @ApiOkResponse()
  @UseGuards(JwtAuthGuard)
  @Get('/')
  getIndex() {
    return 'Okayia!';
  }
}
