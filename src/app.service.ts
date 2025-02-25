import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getHello(): string {
    const node = this.configService.get<string>('NODE_ENV', 'development');
    return node;
  }
}
