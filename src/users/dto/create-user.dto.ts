import { IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'John228Doe' })
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ example: 'superSecretPassword123' })
  @Length(8, 24)
  password: string;
}
