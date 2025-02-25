import { Module } from '@nestjs/common';
import CryptService from 'src/crypt/crypt.service';

@Module({
  providers: [CryptService],
  exports: [CryptService],
})
export default class CryptModule {}
