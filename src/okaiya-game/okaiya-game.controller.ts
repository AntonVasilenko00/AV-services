import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FinaliseGameDto } from './dto/finalise-game.dto';
import { OkaiyaGameService } from './okaiya-game.service';
import { UsersService } from '../users/users.service';

@ApiTags('okaiya')
@Controller('okaiya')
export class OkaiyaGameController {
  constructor(
    private readonly okaiyaGameService: OkaiyaGameService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Health-check endpoint' })
  @ApiOkResponse()
  @UseGuards(JwtAuthGuard)
  @Get('/')
  getIndex() {
    return 'Okayia!';
  }

  @ApiOperation({ summary: 'Finalise the game with a winner or draw' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Post('/finalise-game')
  async finaliseGame(@Body() finaliseGameDto: FinaliseGameDto) {
    return await this.okaiyaGameService.create(finaliseGameDto);
  }

  @ApiOperation({ summary: 'Clears all games data!!!' })
  @ApiOkResponse()
  @Delete('/games')
  clearGames() {
    return this.okaiyaGameService.clearAll();
  }

  @Get('/games')
  getGames() {
    return this.okaiyaGameService.findAll();
  }
}
