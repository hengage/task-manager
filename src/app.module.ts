import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config';
import { ConfigModule } from '@nestjs/config';
import { UsersModule, UsersService } from './users';
import { AuthModule, AuthService } from './auth';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersService, AuthService],
})
export class AppModule {}
