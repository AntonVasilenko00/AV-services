import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);

    await this.usersRepository.save(user);

    return user;
  }

  async findAll(ids?: number[]): Promise<User[]> {
    if (ids && ids.length > 0)
      return await Promise.all(
        ids.map((id) => this.usersRepository.findOneBy({ id })),
      );

    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    // calls @BeforeUpdate to hash password
    if (updateUserDto.password) {
      user.password = updateUserDto.password;
    }

    return await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.usersRepository.delete({ id });
  }

  async findByUserName(userName: string): Promise<User> {
    return await this.usersRepository.findOneBy({ userName });
  }
}
