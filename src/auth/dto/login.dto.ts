import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'John228Doe' })
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ example: 'superSecretPassword123' })
  @IsNotEmpty()
  password: string;
}
