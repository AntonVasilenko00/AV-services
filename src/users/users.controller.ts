import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ description: 'User created successfully.', type: User })
  @ApiBadRequestResponse({ description: 'Failed to create a new user.' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (e) {
      throw new HttpException(e.detail, 400);
    }
  }

  @ApiOperation({ summary: 'Get list of all users.' })
  @ApiOkResponse({
    description: 'User list retrieved successfully.',
    type: User,
    isArray: true,
  })
  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get user by id.' })
  @ApiOkResponse({ description: 'User is found.', type: User })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(+id);

    if (!user) throw new NotFoundException(`User with id=${id} not found.`);

    return user;
  }

  @ApiOperation({
    summary: 'Update user by id.',
    description: 'Can update one field or many',
  })
  @ApiOkResponse({ description: 'User updated.', type: User })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersService.findOne(+id);

    if (!user) throw new NotFoundException(`User with id=${id} not found.`);

    return await this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user by id.' })
  @ApiOkResponse({ description: 'User deleted.' })
  @ApiNotFoundResponse({ description: 'User does not exist.' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<string> {
    const removeResult = await this.usersService.remove(+id);

    if (!removeResult.affected)
      throw new NotFoundException(`User with id=${id} not found.`);

    return `User with id=${id} deleted.`;
  }
}
