import {Controller, Get} from '@nestjs/common';

@Controller('okaiya-game')
export class OkaiyaGameController {
  @Get("/")
  getIndex(){
    return "Okaya"
  }
}
