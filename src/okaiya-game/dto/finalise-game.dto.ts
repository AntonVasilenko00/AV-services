import { ApiProperty } from '@nestjs/swagger';

export class FinaliseGameDto {
  @ApiProperty()
  winnerId: number;

  @ApiProperty()
  looserId: number;

  @ApiProperty()
  isDraw?: boolean;
}
