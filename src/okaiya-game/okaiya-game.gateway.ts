import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { v4 } from 'uuid';
import { Logger } from '@nestjs/common';
import { OkaiyaGameService } from './okaiya-game.service';

@WebSocketGateway({ path: '/okaiya/gateway' })
export class OkaiyaGameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly okaiyaGameService: OkaiyaGameService) {}

  private readonly logger = new Logger(OkaiyaGameGateway.name);

  private readonly MESSAGE_GATEWAY_INIT: string = 'Gateway init';
  private readonly MESSAGE_CLIENT_CONNECTED: string = 'Client connected';

  @WebSocketServer()
  server: any;

  afterInit(server: any): any {
    this.okaiyaGameService.initRooms();
    this.logger.log(this.MESSAGE_GATEWAY_INIT);
  }

  handleConnection(client: any, ...args: any[]): any {
    this.logger.log(this.MESSAGE_CLIENT_CONNECTED);
    return;
  }

  @SubscribeMessage('login')
  handleLogin(client: any): WsResponse {
    if (client.id) {
      return {
        event: 'login',
        data: {
          error: `You are already logged in with id=${client.id}`,
        },
      };
    } else {
      const uid = v4();
      client.id = uid;

      this.logger.log(`Client logged in, id=${uid}`);

      return {
        event: 'login',
        data: {
          userId: uid,
        },
      };
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    client: any,
    { roomNumber }: { roomNumber: number },
  ): WsResponse {
    if (!client.id)
      return {
        event: 'join-room',
        data: {
          error: 'Log in before joining rooms',
        },
      };

    const isJoined = this.okaiyaGameService.joinRoom(client.id, roomNumber);

    if (isJoined) {
      client.roomNumber = roomNumber;
      this.server.clients.forEach((enemy) => {
        if (enemy.roomNumber === roomNumber && enemy.id !== client.id)
          enemy.send(
            JSON.stringify({
              event: 'new-user-joined',
              data: {
                userId: client.id,
              },
            }),
          );
      });
    }

    const roomPlayers = this.okaiyaGameService.getRoomPlayers(roomNumber);

    this.logger.log(
      this.getRoomJoinLogMessage(isJoined, client.id, roomNumber, roomPlayers),
    );

    return this.getRoomJoinResponseMessage(isJoined, roomNumber, roomPlayers);
  }

  @SubscribeMessage('move')
  handlePlayerMove(client: any, payload: number): WsResponse {
    if (!client.id) {
      return { event: 'move', data: { error: 'user is not logged in' } };
    } else {
      const response = { event: 'move', data: payload };
      this.server.clients.forEach((enemy) => {
        if (enemy.id !== client.id && client.roomNumber === enemy.roomNumber) {
          enemy.send(JSON.stringify(response));
        }
      });
    }
  }

  handleDisconnect(client: any): any {
    this.logger.log(
      `Client ${client.id || ''} disconnected ${
        client.roomNumber ? `- left room ${client.roomNumber}` : ''
      }`,
    );

    if (client.id && client.roomNumber) {
      const remainingPlayerId = this.okaiyaGameService.handlePlayerLeave(
        client.id,
        client.roomNumber,
      );

      if (remainingPlayerId)
        this.server.clients.forEach((enemy) => {
          if (enemy.id === remainingPlayerId)
            enemy.send(
              JSON.stringify({
                event: 'enemy-left',
              }),
            );
        });
    }
  }

  private getRoomJoinLogMessage = (
    isJoined: boolean,
    userId: string,
    roomNumber: number,
    playersIds: string[],
  ) =>
    isJoined
      ? `User ${userId} has joined Room ${roomNumber}, current players: ${
          playersIds.length
        } - ${JSON.stringify(playersIds)}`
      : `User ${userId} tried to join room ${roomNumber} but failed, the room had following users - ${
          playersIds.length
        } - ${JSON.stringify(playersIds)}`;

  private getRoomJoinResponseMessage = (
    isJoined: boolean,
    roomNumber: number,
    playersIds: string[],
  ): WsResponse => {
    const successMessage = {
      event: 'join-room',
      data: {
        status: 'ok',
        roomNumber,
        playersInRoom: playersIds.length,
        playersIds,
        board: this.okaiyaGameService.getRoomBoard(roomNumber),
      },
    };

    const failureMessage = {
      event: 'join-room',
      data: {
        status: 'error',
        message:
          playersIds.length === this.okaiyaGameService.maxPlayers
            ? 'Room is already full!'
            : 'You have already joined the room!',
        roomNumber,
      },
    };

    return isJoined ? successMessage : failureMessage;
  };
}
