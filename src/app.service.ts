import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getServer(): string {
    return 'Server is running!';
  }
}
