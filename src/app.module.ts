import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import CryptModule from 'src/crypt/crypt.module';
import { PrismaService } from 'src/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from 'src/config/schema/env.schema';
import AuthModule from 'src/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import UserModule from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import RolesModule from 'src/roles/roles.module';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    CryptModule,
    AuthModule,
    UserModule,
    RolesModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        stores: [
          createKeyv(
            `redis://:${configService.get('REDIS_PASSWORD')}@redis:${configService.get('REDIS_PORT')}`,
          ),
        ],
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: jwtConstants(configService).secret,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
