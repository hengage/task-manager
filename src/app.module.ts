import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config';
import { ConfigModule } from '@nestjs/config';
import { UsersModule, UsersService } from './users';
import { AuthModule, AuthService } from './auth';
import { JwtModule } from '@nestjs/jwt';
import { TasksModule } from './tasks';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    JwtModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersService, AuthService],
})
export class AppModule {}
