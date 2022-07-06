import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity()
export class OkaiyaGame extends BaseEntity {
  @ApiProperty({ example: 9 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: true })
  @Column({ default: false })
  isDraw: boolean;

  @ManyToMany((type) => User)
  @JoinTable()
  players: User[];

  @ManyToOne((type) => User)
  @JoinColumn()
  winner: User;
}
