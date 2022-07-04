import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FinaliseGameDto {
  @ApiProperty()
  @IsNotEmpty()
  winnerId: number;

  @ApiProperty()
  @IsNotEmpty()
  looserId: number;

  @ApiProperty()
  isDraw?: boolean;
}
