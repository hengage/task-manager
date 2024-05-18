import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config';
import { ConfigModule } from '@nestjs/config';
import { UsersModule, UsersService } from './users';
import { AuthModule, AuthService } from './auth';
import { JwtModule } from '@nestjs/jwt';
import { TasksModule, TasksService } from './tasks';
import { AgendaModule, AgendaService } from './agenda';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    JwtModule,
    TasksModule,
    AgendaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UsersService,
    AuthService,
    // AgendaService,
    TasksService,
  ],
})
export class AppModule {}
