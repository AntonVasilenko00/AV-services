import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Application Health-check endpoint' })
  @ApiOkResponse()
  @Get('/')
  getServer(): string {
    return this.appService.getServer();
  }
}
