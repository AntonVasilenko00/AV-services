import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as _ from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { OkaiyaGame } from './entities/okaiya.game.entity';
import { DeleteResult, Repository } from 'typeorm';
import { FinaliseGameDto } from './dto/finalise-game.dto';
import { UsersService } from '../users/users.service';

export interface IRoom {
  players: string[];
  board: number[];
}

@Injectable()
export class OkaiyaGameService {
  constructor(
    @InjectRepository(OkaiyaGame)
    private readonly okaiyaGameRepository: Repository<OkaiyaGame>,
    private readonly usersService: UsersService,
  ) {}
  private readonly logger = new Logger(OkaiyaGameService.name);

  rooms: IRoom[] = [];
  roomsNumber = 9;
  maxPlayers = 2;
  boardDimension = 4;

  public async create(createOkaiyaGameDto: FinaliseGameDto) {
    const game = this.okaiyaGameRepository.create(createOkaiyaGameDto);

    game.players = await Promise.all(
      createOkaiyaGameDto.userIds.map(async (id) => {
        const player = await this.usersService.findOne(id);

        if (!player)
          throw new NotFoundException(`user with id=${id} not found.`);

        return player;
      }),
    );
    const { winnerId } = createOkaiyaGameDto;
    if (winnerId) {
      if (!createOkaiyaGameDto.userIds.includes(winnerId))
        throw new BadRequestException(`winnerId must be inside userIds array.`);

      if (createOkaiyaGameDto.isDraw)
        throw new BadRequestException(
          'there can not be a winner in a draw game.',
        );

      const winner = await this.usersService.findOne(
        createOkaiyaGameDto.winnerId,
      );

      if (!winner)
        throw new NotFoundException(
          `User with id=${createOkaiyaGameDto.winnerId}`,
        );

      game.winner = winner;
    } else {
      game.isDraw = true;
    }
    const savedGame = await this.okaiyaGameRepository.save(game);

    return await this.findOne(savedGame.id);
  }

  public async findAll(): Promise<OkaiyaGame[]> {
    return this.okaiyaGameRepository.find({
      relations: ['players', 'winner'],
      loadRelationIds: true,
    });
  }

  public async findOne(id: number): Promise<OkaiyaGame> {
    return this.okaiyaGameRepository.findOne({
      relations: ['players', 'winner'],
      loadRelationIds: true,
      where: { id },
    });
  }

  public async clearAll(): Promise<DeleteResult> {
    return await this.okaiyaGameRepository.delete({});
  }

  public initRooms(): void {
    for (let i = 0; i < this.roomsNumber; i++) {
      this.rooms.push({
        players: [],
        board: _.shuffle([...Array(this.boardDimension ** 2).keys()]),
      });
    }
  }

  public joinRoom(userId: string, roomNumber: number): boolean {
    const room: IRoom = this.rooms[roomNumber - 1];

    if (this.isAlreadyJoined(userId, room) || this.isRoomFull(room))
      return false;

    room.players.push(userId);
    return true;
  }

  public getRoomPlayers = (number: number): string[] =>
    this.rooms[number - 1].players;

  public getRoomBoard = (roomNumber: number): number[] =>
    this.rooms[roomNumber - 1].board;

  //returns the id of player left in room or undefined if now empty
  public handlePlayerLeave = (
    playerId: string,
    roomNumber: number,
  ): string | undefined => {
    const room = this.rooms[roomNumber - 1];
    const roomPlayers = room.players;

    if (roomPlayers.length === 1) {
      this.logger.log(
        `Last player leaving room ${roomNumber}, shuffling the board...`,
      );
      this.rooms[roomNumber - 1].board = _.shuffle(room.board);
    }
    this.rooms[roomNumber - 1].players = roomPlayers.filter(
      (id) => id !== playerId,
    );

    return this.rooms[roomNumber - 1].players[0];
  };

  private isAlreadyJoined = (userId: string, room: IRoom) =>
    room.players.some((playerId) => playerId === userId);

  private isRoomFull = (room: IRoom) => room.players.length === this.maxPlayers;
}
