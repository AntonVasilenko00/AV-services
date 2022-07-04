import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FinaliseGameDto } from './dto/finalise-game.dto';
import { OkaiyaGameService } from './okaiya-game.service';

@ApiTags('okaiya')
@Controller('okaiya')
export class OkaiyaGameController {
  constructor(private readonly okaiyaGameService: OkaiyaGameService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Health-check endpoint' })
  @ApiOkResponse()
  @UseGuards(JwtAuthGuard)
  @Get('/')
  getIndex() {
    return 'Okayia!';
  }

  @Post('/finalise-game')
  finaliseGame(@Body() finaliseGameDto: FinaliseGameDto) {
    return this.okaiyaGameService.create(finaliseGameDto);
  }
}
