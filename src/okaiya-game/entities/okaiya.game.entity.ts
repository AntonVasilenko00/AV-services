import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
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

  @ApiProperty({ example: 23 })
  @Column()
  winnerId: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'looserId' })
  looser: User;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'winnerId' })
  winner: User;

  @ApiProperty({ example: true })
  @Column({ default: false })
  isDraw: boolean;
}
