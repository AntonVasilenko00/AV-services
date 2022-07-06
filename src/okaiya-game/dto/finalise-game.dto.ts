import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class FinaliseGameDto {
  @ApiProperty({ example: [20, 41] })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  userIds: number[];

  @ApiProperty({ example: 20 })
  @IsOptional()
  winnerId?: number;

  @ApiProperty({ example: false })
  @IsOptional()
  isDraw?: boolean;
}
