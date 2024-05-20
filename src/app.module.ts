import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config';
import { ConfigModule } from '@nestjs/config';
import { UsersModule, UsersService } from './users';
import { AuthModule, AuthService } from './auth';
import { JwtModule } from '@nestjs/jwt';
import { TasksModule, TasksService } from './tasks';
import { AgendaModule } from './agenda';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    JwtModule,
    TasksModule,
    AgendaModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersService, AuthService, TasksService],
})
export class AppModule {}
