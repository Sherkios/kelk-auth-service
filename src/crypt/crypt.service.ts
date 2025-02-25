import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export default class CryptService {
  private salt: number = 10;

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt);
  }

  async compare(value: string, hashValue: string): Promise<boolean> {
    return bcrypt.compare(value, hashValue);
  }
}
