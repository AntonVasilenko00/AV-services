import { Injectable, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import { shuffle } from 'lodash';

export interface IRoom {
  players: string[];
  board: number[];
}

@Injectable()
export class OkaiyaGameService {
  private readonly logger = new Logger(OkaiyaGameService.name);

  rooms: IRoom[] = [];
  roomsNumber = 9;
  maxPlayers = 2;
  boardDimension = 4;

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
