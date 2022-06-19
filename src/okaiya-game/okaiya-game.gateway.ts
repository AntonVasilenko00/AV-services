import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { v4 } from 'uuid';

@WebSocketGateway(process.env.PORT || 3000)
export class OkaiyaGameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: any;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  afterInit(server: any): any {}

  handleConnection(client: any, ...args: any[]): any {
    return;
  }

  @SubscribeMessage('login')
  handleLogin(client: any): string {
    if (client.id) {
      return `Error, user is already logged in with id=${client.id}`;
    } else {
      const uid = v4();
      client.id = uid;
      return uid;
    }
  }

  @SubscribeMessage('move')
  handlePlayerMove(client: any, payload: number): string {
    if (!client.id) {
      return `Error, user is not logged in`;
    } else {
      console.log(payload);
      this.server.clients.forEach((enemy) => {
        if (enemy.id !== client.id) {
          const response = { event: 'move', data: payload };
          enemy.send(JSON.stringify(response));
        }
      });
    }
  }

  handleDisconnect(client: any): any {}
}
